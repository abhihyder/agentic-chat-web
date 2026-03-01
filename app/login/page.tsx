'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Separate component that uses useSearchParams
function LoginContent() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if we have OAuth callback params
  const hasOAuthParams = searchParams.get('token') && searchParams.get('user');

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      alert(`Login failed: ${error}`);
      return;
    }

    if (token && userParam && !isProcessing && !isAuthenticated) {
      setIsProcessing(true);
      try {
        // Try to decode in case it's URL-encoded
        let userJson = userParam;
        try {
          userJson = decodeURIComponent(userParam);
        } catch {
          // Already decoded or not encoded
        }
        
        console.log('User param received:', userJson);
        const user = JSON.parse(userJson);
        login(user, token);
        router.replace('/');
      } catch (err) {
        console.error('Failed to parse user data:', err);
        console.error('Raw user param:', userParam);
        alert('Login failed: Invalid response data');
        setIsProcessing(false);
      }
    }
  }, [searchParams, login, router, isProcessing, isAuthenticated]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, router]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google/login`;
  };

  // Show loading spinner while processing OAuth callback or checking auth
  if (loading || isProcessing || hasOAuthParams) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin">
          <Sparkles size={48} className="text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        <div className="bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)] p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">ChatGPT Clone</h1>
            <p className="text-[var(--foreground-muted)] text-sm">
              AI-powered conversational assistant
            </p>
          </div>

          {/* Login Content */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Welcome</h2>
              <p className="text-[var(--foreground-muted)] text-sm">
                Sign in to access your personalized AI assistant
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[var(--input-bg)] hover:bg-[var(--hover-bg)] border border-[var(--border)] rounded-xl transition-colors font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Features */}
            <div className="pt-4 border-t border-[var(--border)]">
              <h3 className="text-sm font-semibold mb-3 text-[var(--foreground-muted)]">Features</h3>
              <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
                <li className="flex items-center gap-2">
                  <span>🎯</span> Intelligent conversations
                </li>
                <li className="flex items-center gap-2">
                  <span>📝</span> Research, writing, and code assistance
                </li>
                <li className="flex items-center gap-2">
                  <span>💡</span> Context-aware responses
                </li>
                <li className="flex items-center gap-2">
                  <span>🔒</span> Secure and private
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--foreground-muted)]">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="animate-spin">
        <Sparkles size={48} className="text-emerald-600" />
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
