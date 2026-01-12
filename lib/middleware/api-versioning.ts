import { NextRequest, NextResponse } from 'next/server';

export type ApiVersion = 'v1' | 'v2';

export interface VersionedRequest extends NextRequest {
  apiVersion: ApiVersion;
  isVersionDeprecated: boolean;
  deprecationInfo?: {
    sunsetDate: Date;
    migrationGuide: string;
  };
}

export interface ApiVersioningConfig {
  defaultVersion: ApiVersion;
  supportedVersions: ApiVersion[];
  deprecatedVersions: {
    version: ApiVersion;
    sunsetDate: Date;
    migrationGuide: string;
  }[];
  versionHeader: string;
  versionQueryParam: string;
}

export interface VersioningResult {
  version: ApiVersion;
  enhancedRequest: VersionedRequest;
  response?: NextResponse;
}

export class ApiVersioningMiddleware {
  private config: ApiVersioningConfig;

  constructor(config: ApiVersioningConfig) {
    this.config = config;
  }

  /**
   * Process API versioning for a request
   */
  process(request: NextRequest): VersioningResult {
    const version = this.extractVersion(request);
    const deprecationInfo = this.getDeprecationInfo(version);
    
    // Check if version is supported
    if (!this.config.supportedVersions.includes(version)) {
      return {
        version: this.config.defaultVersion,
        enhancedRequest: this.createVersionedRequest(request, this.config.defaultVersion, false),
        response: this.createUnsupportedVersionResponse(version)
      };
    }

    const isDeprecated = !!deprecationInfo;
    const enhancedRequest = this.createVersionedRequest(request, version, isDeprecated, deprecationInfo);

    return {
      version,
      enhancedRequest
    };
  }

  /**
   * Extract API version from request
   */
  private extractVersion(request: NextRequest): ApiVersion {
    // 1. Check URL path first (/api/v1/...)
    const { pathname } = request.nextUrl;
    const pathVersionMatch = pathname.match(/^\/api\/(v\d+)\//);
    if (pathVersionMatch) {
      const pathVersion = pathVersionMatch[1] as ApiVersion;
      if (this.config.supportedVersions.includes(pathVersion)) {
        return pathVersion;
      }
    }

    // 2. Check version header
    const headerVersion = request.headers.get(this.config.versionHeader);
    if (headerVersion && this.config.supportedVersions.includes(headerVersion as ApiVersion)) {
      return headerVersion as ApiVersion;
    }

    // 3. Check query parameter
    const url = new URL(request.url);
    const queryVersion = url.searchParams.get(this.config.versionQueryParam);
    if (queryVersion && this.config.supportedVersions.includes(queryVersion as ApiVersion)) {
      return queryVersion as ApiVersion;
    }

    // 4. Default version
    return this.config.defaultVersion;
  }

  /**
   * Get deprecation info for a version
   */
  private getDeprecationInfo(version: ApiVersion) {
    return this.config.deprecatedVersions.find(dep => dep.version === version);
  }

  /**
   * Create versioned request object
   */
  private createVersionedRequest(
    request: NextRequest,
    version: ApiVersion,
    isDeprecated: boolean,
    deprecationInfo?: { sunsetDate: Date; migrationGuide: string }
  ): VersionedRequest {
    const versionedRequest = request as VersionedRequest;
    versionedRequest.apiVersion = version;
    versionedRequest.isVersionDeprecated = isDeprecated;
    versionedRequest.deprecationInfo = deprecationInfo;
    
    return versionedRequest;
  }

  /**
   * Create response for unsupported version
   */
  private createUnsupportedVersionResponse(version: string): NextResponse {
    return NextResponse.json(
      {
        error: 'Unsupported API version',
        code: 'UNSUPPORTED_VERSION',
        message: `API version '${version}' is not supported`,
        supportedVersions: this.config.supportedVersions,
        defaultVersion: this.config.defaultVersion
      },
      { status: 400 }
    );
  }

  /**
   * Create versioned response with appropriate headers
   */
  createVersionedResponse(response: NextResponse, version: ApiVersion): NextResponse {
    response.headers.set('X-API-Version', version);
    
    const deprecationInfo = this.getDeprecationInfo(version);
    if (deprecationInfo) {
      response.headers.set('X-API-Deprecated', 'true');
      response.headers.set('X-API-Sunset-Date', deprecationInfo.sunsetDate.toISOString());
      response.headers.set('X-API-Migration-Guide', deprecationInfo.migrationGuide);
    }

    return response;
  }
}

/**
 * Default API versioning configuration
 */
export const defaultApiVersioningConfig: ApiVersioningConfig = {
  defaultVersion: 'v1',
  supportedVersions: ['v1', 'v2'],
  deprecatedVersions: [
    // Example: v1 deprecated, sunset in 6 months
    // {
    //   version: 'v1',
    //   sunsetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
    //   migrationGuide: 'https://docs.example.com/api/v2-migration'
    // }
  ],
  versionHeader: 'X-API-Version',
  versionQueryParam: 'version'
};

/**
 * Create API versioning middleware with default config
 */
export function createApiVersioningMiddleware(
  customConfig?: Partial<ApiVersioningConfig>
): ApiVersioningMiddleware {
  const config = { ...defaultApiVersioningConfig, ...customConfig };
  return new ApiVersioningMiddleware(config);
}