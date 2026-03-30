import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

let initialized = false;

export async function initGoogleAuth() {
  if (initialized) return;
  
  if (!Capacitor.isNativePlatform()) {
    // On web, initialize with clientId
    GoogleAuth.initialize({
      clientId: '895146984736-se9con0r5b6qatgtk1mfqcs6qq755m97.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }
  
  initialized = true;
}

export async function nativeGoogleSignIn() {
  await initGoogleAuth();
  
  const result = await GoogleAuth.signIn();
  
  const idToken = result.authentication?.idToken;
  
  if (!idToken) {
    throw new Error('No idToken returned from Google Sign-In');
  }
  
  return {
    idToken,
    displayName: result.name || result.givenName || null,
    email: result.email || null,
    givenName: result.givenName || null,
    familyName: result.familyName || null,
    imageUrl: result.imageUrl || null,
  };
}
