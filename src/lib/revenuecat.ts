import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

// RevenueCat API keys (publishable - safe in client code)
const REVENUECAT_IOS_KEY = 'appl_rDJWtfWfVugefZjBugxiJIISOcR';
const REVENUECAT_ANDROID_KEY = 'goog_TdisBiQciqEnylaoXGDwMAKebIl';
const getProductId = (): string => {
  return getPlatform() === 'android' ? 'bibliatoonkids2' : 'BIBLIATOONKIDS2';
};

// App version marker for debugging Live Updates bundles
export const APP_BUNDLE_VERSION = '2026-10-16-v1';

export const isNativePlatform = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export const getPlatform = (): string => {
  try {
    return Capacitor.getPlatform();
  } catch {
    return 'web';
  }
};

const isRevenueCatSupported = (): boolean => {
  const platform = getPlatform();
  return isNativePlatform() && (platform === 'ios' || platform === 'android');
};

export const initRevenueCat = async (): Promise<void> => {
  console.log(`[BundleVersion] ${APP_BUNDLE_VERSION}`);
  if (!isRevenueCatSupported()) {
    console.log(`RevenueCat: Skipping init - platform: ${getPlatform()}`);
    return;
  }
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const apiKey = getPlatform() === 'android' ? REVENUECAT_ANDROID_KEY : REVENUECAT_IOS_KEY;
    await Purchases.configure({ apiKey });
    console.log(`RevenueCat: Initialized successfully (${getPlatform()}, key: ${apiKey.substring(0, 8)}...)`);
  } catch (error) {
    console.error('RevenueCat: Failed to initialize', error);
  }
};

export const identifyUser = async (userId: string): Promise<void> => {
  if (!isRevenueCatSupported()) return;
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.logIn({ appUserID: userId });
    console.log('RevenueCat: User identified', userId);
  } catch (error) {
    console.error('RevenueCat: Failed to identify user', error);
  }
};

export const logOutRevenueCat = async (): Promise<void> => {
  if (!isRevenueCatSupported()) return;
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.logOut();
    console.log('RevenueCat: Logged out (now anonymous)');
  } catch (error) {
    console.log('RevenueCat: logOut skipped (likely already anonymous)', error);
  }
};

export const getAppUserID = async (): Promise<string | null> => {
  if (!isRevenueCatSupported()) return null;
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { appUserID } = await Purchases.getAppUserID();
    return appUserID;
  } catch (error) {
    console.error('RevenueCat: Failed to get appUserID', error);
    return null;
  }
};

export const purchaseMonthly = async (): Promise<{
  success: boolean;
  expiresAt?: string;
  error?: string;
}> => {
  if (!isRevenueCatSupported()) {
    const platform = getPlatform();
    if (platform === 'android') {
      return { success: false, error: 'Assinaturas via Google Play estarão disponíveis em breve!' };
    }
    return { success: false, error: 'Assinaturas só estão disponíveis no app nativo (iOS).' };
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const offerings = await Purchases.getOfferings();

    if (!offerings?.current?.availablePackages?.length) {
      return {
        success: false,
        error: `Nenhum plano disponível. Offering: ${offerings?.current?.identifier ?? 'null'}`,
      };
    }

    const monthlyPackage =
      offerings.current.availablePackages.find(
        (pkg) => pkg.product?.identifier === getProductId()
      ) || offerings.current.availablePackages[0];

    const { customerInfo } = await Purchases.purchasePackage({ aPackage: monthlyPackage });

    const entitlements = customerInfo?.entitlements?.active;
    if (entitlements && Object.keys(entitlements).length > 0) {
      const firstEntitlement = Object.values(entitlements)[0];
      return { success: true, expiresAt: firstEntitlement.expirationDate ?? undefined };
    }
    return { success: true };
  } catch (error: any) {
    if (error?.code === 1 || error?.message?.includes('cancel')) {
      return { success: false, error: 'cancelled' };
    }
    console.error('RevenueCat: Purchase failed', error);
    return {
      success: false,
      error: `Erro [${error?.code ?? '?'}]: ${error?.message ?? 'Erro desconhecido'}`,
    };
  }
};

export const checkSubscriptionStatus = async (): Promise<{
  isActive: boolean;
  expiresAt?: string;
}> => {
  if (!isRevenueCatSupported()) return { isActive: false };
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { customerInfo } = await Purchases.getCustomerInfo();
    const entitlements = customerInfo?.entitlements?.active;
    if (entitlements && Object.keys(entitlements).length > 0) {
      const firstEntitlement = Object.values(entitlements)[0];
      return { isActive: true, expiresAt: firstEntitlement.expirationDate ?? undefined };
    }
    return { isActive: false };
  } catch (error) {
    console.error('RevenueCat: Failed to check status', error);
    return { isActive: false };
  }
};

export const restorePurchases = async (): Promise<{
  success: boolean;
  isActive: boolean;
  expiresAt?: string;
  error?: string;
}> => {
  if (!isRevenueCatSupported()) {
    return { success: false, isActive: false, error: 'Restauração só está disponível no app nativo (iOS).' };
  }
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { customerInfo } = await Purchases.restorePurchases();
    const entitlements = customerInfo?.entitlements?.active;
    if (entitlements && Object.keys(entitlements).length > 0) {
      const firstEntitlement = Object.values(entitlements)[0];
      return { success: true, isActive: true, expiresAt: firstEntitlement.expirationDate ?? undefined };
    }
    return { success: true, isActive: false };
  } catch (error: any) {
    console.error('RevenueCat: Failed to restore purchases', error);
    return { success: false, isActive: false, error: error?.message ?? 'Erro ao restaurar compras.' };
  }
};

/**
 * Sync RevenueCat subscription status to Supabase subscribers table.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const syncSubscriptionAfterLogin = async (_userId: string, _email: string): Promise<void> => {
  if (!isRevenueCatSupported()) return;
  try {
    // The server asks RevenueCat directly and is the only one allowed to write subscriptions.
    await supabase.functions.invoke('rc-sync', { body: { platform: getPlatform() } });
  } catch (error) {
    console.error('RevenueCat: rc-sync error', error);
  }
};
