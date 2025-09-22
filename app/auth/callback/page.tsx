'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (session?.user && !isRedirecting) {
        setIsRedirecting(true);
        
        try {
          // Check user status to determine redirect
          const response = await fetch(`/api/v1/users/${session.user.id}/status`);
          const userStatus = await response.json();

          // Redirect based on user role and status
          if (session.user.role === 'admin') {
            router.push('/admin');
          } else if (userStatus.isNewUser) {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking user status:', error);
          // Fallback to dashboard if there's an error
          router.push('/dashboard');
        }
      }
    };

    handleRedirect();
  }, [session, status, router, isRedirecting]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Setting up your account...
        </h2>
        <p className="text-gray-600">
          Please wait while we redirect you to the right place.
        </p>
      </div>
    </div>
  );
}