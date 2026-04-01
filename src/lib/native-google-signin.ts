import { SocialLogin } from '@capgo/capacitor-social-login';

let initialized = false;

const WEB_CLIENT_ID = '135684784512-nt1jcoscltu5lh758l3evc2lrl7amdug.apps.googleusercontent.com';

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

  const response = await SocialLogin.login({
    provider: 'google',
    options: {
      scopes: ['profile', 'email'],
    },
  });

  // The response is typed as GoogleLoginResponse
  // result contains accessToken, idToken, and profile
  const res = response.result as any;
  const idToken = res?.idToken;
  const profile = res?.profile;

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
