import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Get the current user's session on the server
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

/**
 * Require authentication for a page
 * Redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  return user;
}

/**
 * Require admin role for a page
 * Redirects to dashboard if not an admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  
  return user;
}

/**
 * Get the current user's session in a server component
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user's session in a server action
 */
export async function getSessionAction() {
  return await getServerSession(authOptions);
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: string) {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: string[]) {
  const user = await getCurrentUser();
  return user?.role && roles.includes(user.role);
}

/**
 * Get the current user's ID
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id || null;
}

/**
 * Get the current user's role
 */
export async function getCurrentUserRole() {
  const user = await getCurrentUser();
  return user?.role || null;
}
