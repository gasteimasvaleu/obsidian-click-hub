import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

// RevenueCat API keys (publishable - safe in client code)
const REVENUECAT_IOS_KEY = 'appl_rDJWtfWfVugefZjBugxiJIISOcR';
const REVENUECAT_ANDROID_KEY = 'goog_TdisBiQciqEnylaoXGDwMAKebIl';
const getProductId = (): string => {
  return getPlatform() === 'android' ? 'bibliatoonkids2' : 'BIBLIATOONKIDS2';
};

// App version marker for debugging Live Updates bundles
const APP_BUNDLE_VERSION = '2026-03-12-v3';

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
export const syncSubscriptionAfterLogin = async (userId: string, email: string): Promise<void> => {
  if (!isRevenueCatSupported()) return;

  try {
    // Only trust the subscription that already belongs to this identified app user.
    // No automatic restore here: restoring is an explicit user action (Paywall/Login).
    const status = await checkSubscriptionStatus();
    if (!status.isActive) return;

    const { data: existingByEmail } = await supabase
      .from('subscribers')
      .select('id, user_id')
      .eq('email', email)
      .maybeSingle();

    if (existingByEmail && !existingByEmail.user_id) {
      await supabase
        .from('subscribers')
        .update({
          user_id: userId,
          subscription_status: 'active' as const,
          subscription_expires_at: status.expiresAt ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingByEmail.id);
      return;
    }

    const { data: existingByUserId } = await supabase
      .from('subscribers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingByUserId) {
      await supabase
        .from('subscribers')
        .update({
          subscription_status: 'active' as const,
          subscription_expires_at: status.expiresAt ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingByUserId.id);
    } else {
      await supabase
        .from('subscribers')
        .insert({
          user_id: userId,
          email,
          subscription_status: 'active' as const,
          subscription_expires_at: status.expiresAt ?? null,
          product_source: 'revenuecat',
        });
    }
  } catch (error) {
    console.error('RevenueCat: syncSubscriptionAfterLogin error', error);
  }
};
