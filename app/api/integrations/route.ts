import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Placeholder type for an integration configuration
interface IntegrationConfig {
  id: string;
  type: 'zapier' | 'salesforce' | 'hubspot' | 'custom';
  name: string;
  connected: boolean;
  createdAt: string;
}

// Mock database
const mockIntegrations: IntegrationConfig[] = [
  { id: 'int_1', type: 'zapier', name: 'My Zapier Connection', connected: true, createdAt: new Date().toISOString() },
  { id: 'int_2', type: 'hubspot', name: 'Marketing HubSpot', connected: true, createdAt: new Date().toISOString() },
];

/**
 * GET /api/integrations
 */
export async function GET() {
  try {
    const integrations = mockIntegrations;
    return NextResponse.json(integrations);
  } catch (error) {
    console.error("Failed to fetch integrations:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name } = body;

    if (!type || !name) {
      return NextResponse.json({ message: 'Missing required fields: type, name' }, { status: 400 });
    }

    const newIntegration: IntegrationConfig = {
      id: `int_${Date.now()}`,
      type,
      name,
      connected: true,
      createdAt: new Date().toISOString(),
    };

    mockIntegrations.push(newIntegration);

    return NextResponse.json(newIntegration, { status: 201 });

  } catch (error) {
    console.error("Failed to create integration:", error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}