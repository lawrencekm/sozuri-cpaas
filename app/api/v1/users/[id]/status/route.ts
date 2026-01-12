import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: userId } = await params;

    // Only allow users to check their own status or admins to check any user
    if (session.user.id !== userId && session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if user has any projects
    const projectCount = await prisma.project.count({
      where: { userId }
    });

    // Check if user has any other data that indicates they're not new
    // You can add more checks here based on your data model
    const hasContacts = await prisma.contact.count({
      where: { userId }
    });

    // Check campaigns through projects (campaigns belong to projects, not directly to users)
    const hasCampaigns = await prisma.campaign.count({
      where: { 
        project: {
          userId: userId
        }
      }
    });

    // Consider user as having data if they have any projects, contacts, or campaigns
    const hasData = projectCount > 0 || hasContacts > 0 || hasCampaigns > 0;

    return NextResponse.json({
      userId,
      projectCount,
      hasContacts: hasContacts > 0,
      hasCampaigns: hasCampaigns > 0,
      hasData,
      isNewUser: !hasData
    });

  } catch (error) {
    console.error('Error checking user status:', error);
    
    // Get userId for error response
    const { id: userId } = await params;
    
    // Fallback: if we can't check the database, assume they're a new user
    // This ensures the flow continues even if there's a DB issue
    return NextResponse.json({
      userId,
      projectCount: 0,
      hasContacts: false,
      hasCampaigns: false,
      hasData: false,
      isNewUser: true
    });
  }
}