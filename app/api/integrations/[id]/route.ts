import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

interface IntegrationConfig {
  id: string;
  type: 'zapier' | 'salesforce' | 'hubspot' | 'custom';
  name: string;
  connected: boolean;
  createdAt: string;
}

const mockIntegrations: IntegrationConfig[] = [
  { id: 'int_1', type: 'zapier', name: 'My Zapier Connection', connected: true, createdAt: new Date().toISOString() },
  { id: 'int_2', type: 'hubspot', name: 'Marketing HubSpot', connected: true, createdAt: new Date().toISOString() },
];

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;

  try {
    const integration = mockIntegrations.find(int => int.id === id);

    if (!integration) {
      return NextResponse.json({ message: 'Integration not found' }, { status: 404 });
    }

    return NextResponse.json(integration);
  } catch (error) {
    console.error(`Failed to fetch integration ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = params;

  try {
    const integrationIndex = mockIntegrations.findIndex(int => int.id === id);

    if (integrationIndex === -1) {
      return NextResponse.json({ message: 'Integration not found' }, { status: 404 });
    }
    const body = await request.json();
    const { name, connected } = body;

    // Create the updated object - only update provided fields
    const updatedIntegration = {
        ...mockIntegrations[integrationIndex],
        ...(name !== undefined && { name }),
        ...(connected !== undefined && { connected }),
    };

    mockIntegrations[integrationIndex] = updatedIntegration;

    return NextResponse.json(updatedIntegration);
  } catch (error) {
    console.error(`Failed to update integration ${id}:`, error);
     if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = params;

  try {
    const integrationIndex = mockIntegrations.findIndex(int => int.id === id);

    if (integrationIndex === -1) {
      return NextResponse.json({ message: 'Integration not found' }, { status: 404 });
    }

    mockIntegrations.splice(integrationIndex, 1);

    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error) {
    console.error(`Failed to delete integration ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}