import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json({ message: 'Invalid verification link' }, { status: 400 });
    }

    // Find verification token
    const verificationEntry = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationEntry || verificationEntry.identifier !== email) {
      return NextResponse.json({ message: 'Invalid or expired verification token' }, { status: 400 });
    }

    if (verificationEntry.expires < new Date()) {
      return NextResponse.json({ message: 'Verification token expired' }, { status: 400 });
    }

    // Update user to set emailVerified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Optionally delete token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
