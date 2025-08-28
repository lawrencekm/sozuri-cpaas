'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

type AuthMode = 'signin' | 'signup';

interface UnifiedAuthFormProps {
  defaultMode?: AuthMode;
  redirectTo?: string;
}

export default function UnifiedAuthForm({ defaultMode = 'signin', redirectTo }: UnifiedAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');


  useEffect(() => {
    // Check for OAuth errors
    const error = searchParams?.get('error');
    if (error) {
      setError(
        error === 'OAuthAccountNotLinked'
          ? 'This email is already registered with a different provider.'
          : 'An error occurred during authentication.'
      );
    }
  }, [searchParams]);

  const checkUserStatus = async (userId: string) => {
    try {
      // Check if user has any projects or data
      const response = await fetch(`/api/users/${userId}/status`);
      const data = await response.json();
      
      return {
        hasProjects: data.projectCount > 0,
        hasData: data.hasData || false,
        isNewUser: data.projectCount === 0 && !data.hasData
      };
    } catch (error) {
      console.error('Error checking user status:', error);
      return { hasProjects: false, hasData: false, isNewUser: true };
    }
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation for signup
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signup') {
        // Register new user first
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, company }),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          throw new Error(registerData.message || 'Registration failed');
        }

        toast.success('Account created successfully!');
      }

      // Sign in with NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Get session to check user details
      const session = await getSession();
      if (session?.user) {
        const userStatus = await checkUserStatus(session.user.id);
        
        // Redirect based on user status and role
        if (session.user.role === 'admin') {
          router.push('/admin');
        } else if (userStatus.isNewUser) {
          router.push('/onboarding');
        } else {
          router.push(redirectTo || '/dashboard');
        }
      }

    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await signIn(provider, { 
        callbackUrl: redirectTo || '/auth/callback'
      });
    } catch (error) {
      setError('OAuth authentication failed');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    // Clear form when switching modes
    if (mode === 'signin') {
      setName('');
      setConfirmPassword('');
      setCompany('');
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 overflow-hidden bg-transparent">
      {/* Left image panel (no overlay/branding) */}
      <div className="relative hidden lg:block h-full">
        <Image
          src={mode === 'signin' ? '/login.png' : '/sign%20up.png'}
          alt={mode === 'signin' ? 'Login' : 'Sign up'}
          fill
          className="absolute inset-0 object-cover"
          priority
        />
      </div>

      {/* Right form panel (scrollable only) */}
      <div className="h-full overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-6 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-foreground">
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === 'signin' ? (
                  <>
                    Don’t have an account?{' '}
                    <button onClick={toggleMode} className="font-medium text-primary hover:underline">
                      Create one
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button onClick={toggleMode} className="font-medium text-primary hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            <Card className="shadow-none border-muted">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">{mode === 'signin' ? 'Welcome back' : 'Get started free'}</CardTitle>
                <CardDescription>
                  {mode === 'signin'
                    ? 'Enter your credentials to access your account'
                    : 'Create your account to get started'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleCredentialsAuth} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={mode === 'signup' ? 'Create a password (min 8 characters)' : 'Enter your password'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}

                  {mode === 'signin' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                          Remember me
                        </label>
                      </div>
                      <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.205 20 14.43 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </Button>
                </div>

                {mode === 'signin' && (
                  <div className="text-center">
                    <Link href="/admin-access" className="text-sm text-muted-foreground hover:text-foreground">
                      Admin Access
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}