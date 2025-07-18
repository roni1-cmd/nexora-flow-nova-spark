
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tpcwxrubgrwqehjqwwjq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwY3d4cnViZ3J3cWVoanF3d2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTM3MjIsImV4cCI6MjA2Nzk4OTcyMn0.nB4-_MiUez8hU4TfO3U_xwzMpM0wd4_QFacEjciBd18";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'nexora-app'
    }
  }
});

// Function to set Firebase user context for RLS
export const setFirebaseUserContext = async (firebaseUserId: string) => {
  try {
    // Create a temporary JWT token with the Firebase user ID
    // This is a simplified approach - in production you'd want proper JWT signing
    const mockJwt = btoa(JSON.stringify({
      sub: firebaseUserId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    
    // Store the user ID for use in RLS policies
    localStorage.setItem('firebase_uid', firebaseUserId);
    
    console.log('Firebase user context set for:', firebaseUserId);
  } catch (error) {
    console.log('Could not set Firebase user context:', error);
  }
};
