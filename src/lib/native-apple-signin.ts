import { Capacitor, registerPlugin } from '@capacitor/core';

interface NativeAppleSignInPlugin {
  authorize(): Promise<{
    identityToken: string;
    authorizationCode: string;
    givenName: string | null;
    familyName: string | null;
    email: string | null;
  }>;
}

const NativeAppleSignIn = registerPlugin<NativeAppleSignInPlugin>('NativeAppleSignIn');

export async function nativeAppleSignIn() {
  if (!Capacitor.isNativePlatform()) {
    throw new Error('Native Apple Sign In is only available on native platforms');
  }
  
  const available = Capacitor.isPluginAvailable('NativeAppleSignIn');
  console.log('NativeAppleSignIn plugin available:', available);
  
  if (!available) {
    throw new Error('NativeAppleSignIn plugin not available. Please update the native app binary.');
  }
  
  return NativeAppleSignIn.authorize();
}
