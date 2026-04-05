import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

// RevenueCat API keys (publishable - safe in client code)
const REVENUECAT_IOS_KEY = 'appl_rDJWtfWfVugefZjBugxiJIISOcR';
const REVENUECAT_ANDROID_KEY = 'goog_TdisBiQciqEnylaoXGDwMAKebIl';
const PRODUCT_ID = 'BIBLIATOONKIDS2';

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
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    console.log('RevenueCat: Initialized successfully');
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
        (pkg) => pkg.product?.identifier === PRODUCT_ID
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
 * Claim orphan subscriber records created by webhook for anonymous RevenueCat purchases.
 */
const claimOrphanSubscriber = async (
  userId: string,
  email: string,
  status: { isActive: boolean; expiresAt?: string }
): Promise<boolean> => {
  try {
    const { data: orphans } = await supabase
      .from('subscribers')
      .select('id, transaction_id')
      .is('user_id', null)
      .eq('product_source', 'revenuecat')
      .eq('subscription_status', 'active')
      .limit(5);

    if (!orphans?.length) {
      console.log('RevenueCat: No orphan records found');
      return false;
    }

    const orphan = orphans[0];
    const { error } = await supabase
      .from('subscribers')
      .update({
        user_id: userId,
        email,
        subscription_status: status.isActive ? ('active' as const) : ('expired' as const),
        subscription_expires_at: status.expiresAt ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orphan.id);

    if (error) {
      console.error('RevenueCat: Failed to claim orphan', error);
      return false;
    }

    console.log(`RevenueCat: Claimed orphan record ${orphan.id} (txn: ${orphan.transaction_id}) for user ${userId}`);
    return true;
  } catch (error) {
    console.error('RevenueCat: claimOrphanSubscriber error', error);
    return false;
  }
};

/**
 * Sync RevenueCat subscription status to Supabase subscribers table.
 */
export const syncSubscriptionAfterLogin = async (userId: string, email: string): Promise<void> => {
  if (!isRevenueCatSupported()) return;

  try {
    let status: { isActive: boolean; expiresAt?: string } = { isActive: false };
    for (let attempt = 1; attempt <= 3; attempt++) {
      status = await checkSubscriptionStatus();
      console.log(`RevenueCat: sync attempt ${attempt}`, { userId, isActive: status.isActive });
      if (status.isActive) break;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (!status.isActive) {
      const restoreResult = await restorePurchases();
      if (restoreResult.isActive) {
        status = { isActive: true, expiresAt: restoreResult.expiresAt };
      } else {
        return;
      }
    }

    await claimOrphanSubscriber(userId, email, status);

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
