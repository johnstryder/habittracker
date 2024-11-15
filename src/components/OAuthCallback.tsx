import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the stored provider data
        const providerRaw = localStorage.getItem('provider');
        if (!providerRaw) {
          throw new Error('No provider data found');
        }

        const provider = JSON.parse(providerRaw);
        
        // Get current URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          throw new Error('No code or state found in URL parameters');
        }

        // Verify state matches
        if (provider.state !== state) {
          throw new Error('State parameters do not match');
        }

        // Exchange the code for a token
        await pb.collection('users').authWithOAuth2Code(
          provider.name,
          code,
          provider.codeVerifier,
          `${window.location.origin}/auth/callback`,
          {
            emailVisibility: false,
          }
        );

        // Clear the stored provider data
        localStorage.removeItem('provider');

        // Redirect to dashboard on success
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-sky-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}