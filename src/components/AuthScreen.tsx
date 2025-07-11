
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthScreenProps {
  onSignIn: () => void;
}

const AuthScreen = ({ onSignIn }: AuthScreenProps) => {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSignIn();
    } catch (error: any) {
      console.error('Error during sign-in:', error);
      toast({
        title: "Error",
        description: "Failed to sign in: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex justify-center items-center p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
            alt="nexora" 
            className="w-8 h-8"
          />
          <div className="text-xl font-semibold text-white">nexora</div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-normal mb-2">Welcome back</h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm text-blue-400 font-medium">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-transparent text-white placeholder:text-white/50 focus:border-blue-400 focus:outline-none transition-colors"
                placeholder=""
              />
            </div>

            <button className="w-full py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
              Continue
            </button>

            <div className="text-center">
              <span className="text-white/70">Don't have an account? </span>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign up
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="mx-4 text-white/50 text-sm">OR</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 border border-white/20 rounded-2xl bg-transparent hover:bg-white/5 transition-colors text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex justify-center gap-6 text-sm text-white/50">
              <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="hover:text-purple-400 transition-colors">Terms of Use</a>
              <span>|</span>
              <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
