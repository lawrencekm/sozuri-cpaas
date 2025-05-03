import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Placeholder type - Should match the one in ../route.ts
interface IntegrationConfig {
  id: string;
  type: 'zapier' | 'salesforce' | 'hubspot' | 'custom';
  name: string;
  connected: boolean;
  createdAt: string;
}

// Mock database - Use the same mock data source ideally, or manage state consistently
// For simplicity, we redefine it here but this should point to a single source of truth
let mockIntegrations: IntegrationConfig[] = [
  { id: 'int_1', type: 'zapier', name: 'My Zapier Connection', connected: true, createdAt: new Date().toISOString() },
  { id: 'int_2', type: 'hubspot', name: 'Marketing HubSpot', connected: true, createdAt: new Date().toISOString() },
];

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/integrations/[id]
 * Retrieves details for a specific integration.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  // TODO: Implement Authentication & Authorization check
  // Ensure user is logged in and authorized to view this specific integration.

  const { id } = params;

  try {
    // TODO: Replace with actual database query
    const integration = mockIntegrations.find(int => int.id === id);

    if (!integration) {
      return NextResponse.json({ message: 'Integration not found' }, { status: 404 });
    }

    // TODO: Add logic to check if the logged-in user owns this integration

    return NextResponse.json(integration);
  } catch (error) {
    console.error(`Failed to fetch integration ${id}:`, error);
    // TODO: Use/Implement a server-side centralized error handler here
    // handleError(error, ErrorType.API, { context: { route: `/api/integrations/${id}`, method: 'GET' } });
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT /api/integrations/[id]
 * Updates a specific integration configuration.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  // TODO: Implement Authentication & Authorization check
  // Ensure user is logged in and authorized to update this specific integration.

  const { id } = params;

  try {
    // TODO: Replace with actual database query
    const integrationIndex = mockIntegrations.findIndex(int => int.id === id);

    if (integrationIndex === -1) {
      return NextResponse.json({ message: 'Integration not found' }, { status: 404 });
    }

    // TODO: Add logic to check if the logged-in user owns this integration

    const body = await request.json();
    // TODO: Implement Input Validation (use Zod or similar)
    const { name, connected /*, other updatable fields */ } = body;

    // Create the updated object - only update provided fields
    const updatedIntegration = { 
        ...mockIntegrations[integrationIndex], 
        ...(name !== undefined && { name }),
        ...(connected !== undefined && { connected }),
        // Add other fields here
    };

    // TODO: Implement actual update logic in the database
    mockIntegrations[integrationIndex] = updatedIntegration;

    return NextResponse.json(updatedIntegration);
  } catch (error) {
    console.error(`Failed to update integration ${id}:`, error);
    // TODO: Use/Implement a server-side centralized error handler here
    // handleError(error, errorType, { context: { route: `/api/integrations/${id}`, method: 'PUT', ... } });
     if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/integrations/[id]
 * Deletes/disconnects a specific integration.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // TODO: Implement Authentication & Authorization check
  // Ensure user is logged in and authorized to delete this specific integration.

  const { id } = params;

  try {
    // TODO: Replace with actual database query
    const integrationIndex = mockIntegrations.findIndex(int => int.id === id);

    if (integrationIndex === -1) {
      return NextResponse.json({ message: 'Integration not found' }, { status: 404 });
    }

    // TODO: Add logic to check if the logged-in user owns this integration

    // TODO: Implement actual deletion logic
    // - Remove from database
    // - Revoke tokens/disconnect from third-party if necessary
    mockIntegrations.splice(integrationIndex, 1);

    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error) {
    console.error(`Failed to delete integration ${id}:`, error);
    // TODO: Use/Implement a server-side centralized error handler here
    // handleError(error, ErrorType.API, { context: { route: `/api/integrations/${id}`, method: 'DELETE' } });
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 