import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

let initialized = false;

const WEB_CLIENT_ID = '895146984736-se9con0r5b6qatgtk1mfqcs6qq755m97.apps.googleusercontent.com';

export async function initGoogleAuth() {
  if (initialized) return;

  await SocialLogin.initialize({
    google: {
      webClientId: WEB_CLIENT_ID,
    },
  });

  initialized = true;
}

export async function nativeGoogleSignIn() {
  await initGoogleAuth();

  const result = await SocialLogin.login({
    provider: 'google',
    options: {
      scopes: ['profile', 'email'],
    },
  });

  const profile = result?.result?.profile;
  const idToken = result?.result?.idToken;

  if (!idToken) {
    throw new Error('No idToken returned from Google Sign-In');
  }

  return {
    idToken,
    displayName: profile?.name || profile?.givenName || null,
    email: profile?.email || null,
    givenName: profile?.givenName || null,
    familyName: profile?.familyName || null,
    imageUrl: profile?.imageUrl || null,
  };
}
