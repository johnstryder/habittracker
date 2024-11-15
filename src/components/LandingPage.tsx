import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export default function LandingPage() {
  const [authMethods, setAuthMethods] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (pb.authStore.isValid) {
      navigate('/dashboard');
      return;
    }

    loadAuthMethods();
  }, [navigate]);

  async function loadAuthMethods() {
    try {
      const methods = await pb.collection('users').listAuthMethods();
      setAuthMethods(methods);
    } catch (error) {
      console.error('Failed to load auth methods:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleProviderClick(provider: any) {
    // Store provider data for verification in redirect
    localStorage.setItem('provider', JSON.stringify(provider));
    // Redirect to provider's auth page
    window.location.href = provider.authUrl + `${window.location.origin}/auth/callback`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">HabitTracker</h1>
            {!loading && (
              <button 
                onClick={() => {
                  const googleProvider = authMethods?.authProviders?.find(
                    (p: any) => p.name === 'google'
                  );
                  if (googleProvider) {
                    handleProviderClick(googleProvider);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in with Google
              </button>
            )}
          </div>
        </nav>

        <main className="mt-16 sm:mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">
                  Coming soon
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Track your habits</span>
                  <span className="block text-sky-600">Transform your life</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Build better habits, break bad ones, and achieve your goals with our comprehensive habit tracking platform. Journal your journey and visualize your progress.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {loading ? (
                    <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md"></div>
                  ) : (
                    <button
                      onClick={() => {
                        const googleProvider = authMethods?.authProviders?.find(
                          (p: any) => p.name === 'google'
                        );
                        if (googleProvider) {
                          handleProviderClick(googleProvider);
                        }
                      }}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="/api/placeholder/800/600"
                    alt="App screenshot"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}