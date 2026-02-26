import { Capacitor } from '@capacitor/core';

// RevenueCat API key (publishable - safe in client code)
const REVENUECAT_API_KEY = 'appl_rDJWtfWfVugefZjBugxiJIISOcR';
const PRODUCT_ID = 'com.bibliatoon.mensal';

/**
 * Check if we're running on a native platform (iOS/Android)
 */
export const isNativePlatform = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

/**
 * Initialize RevenueCat SDK - only works on native platforms
 */
export const initRevenueCat = async (): Promise<void> => {
  if (!isNativePlatform()) {
    console.log('RevenueCat: Skipping init - not on native platform');
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

/**
 * Identify user in RevenueCat with their Supabase user ID
 */
export const identifyUser = async (userId: string): Promise<void> => {
  if (!isNativePlatform()) return;

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.logIn({ appUserID: userId });
    console.log('RevenueCat: User identified', userId);
  } catch (error) {
    console.error('RevenueCat: Failed to identify user', error);
  }
};

/**
 * Purchase the monthly subscription
 * Returns true if purchase was successful
 */
export const purchaseMonthly = async (): Promise<{
  success: boolean;
  expiresAt?: string;
  error?: string;
}> => {
  if (!isNativePlatform()) {
    return {
      success: false,
      error: 'Assinaturas só estão disponíveis no app nativo (iOS).',
    };
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');

    // Get available packages
    const offerings = await Purchases.getOfferings();

    if (!offerings?.current?.availablePackages?.length) {
      return {
        success: false,
        error: 'Nenhum plano disponível no momento. Tente novamente mais tarde.',
      };
    }

    // Try to find the monthly package, or use the first available
    const monthlyPackage =
      offerings.current.availablePackages.find(
        (pkg) => pkg.product?.identifier === PRODUCT_ID
      ) || offerings.current.availablePackages[0];

    const { customerInfo } = await Purchases.purchasePackage({
      aPackage: monthlyPackage,
    });

    // Check if the user now has an active entitlement
    const entitlements = customerInfo?.entitlements?.active;
    if (entitlements && Object.keys(entitlements).length > 0) {
      const firstEntitlement = Object.values(entitlements)[0];
      return {
        success: true,
        expiresAt: firstEntitlement.expirationDate ?? undefined,
      };
    }

    return { success: true };
  } catch (error: any) {
    // User cancelled
    if (error?.code === 1 || error?.message?.includes('cancel')) {
      return { success: false, error: 'cancelled' };
    }
    console.error('RevenueCat: Purchase failed', error);
    return {
      success: false,
      error: 'Erro ao processar a compra. Tente novamente.',
    };
  }
};

/**
 * Check if the current user has an active subscription
 */
export const checkSubscriptionStatus = async (): Promise<{
  isActive: boolean;
  expiresAt?: string;
}> => {
  if (!isNativePlatform()) {
    return { isActive: false };
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { customerInfo } = await Purchases.getCustomerInfo();

    const entitlements = customerInfo?.entitlements?.active;
    if (entitlements && Object.keys(entitlements).length > 0) {
      const firstEntitlement = Object.values(entitlements)[0];
      return {
        isActive: true,
        expiresAt: firstEntitlement.expirationDate ?? undefined,
      };
    }

    return { isActive: false };
  } catch (error) {
    console.error('RevenueCat: Failed to check status', error);
    return { isActive: false };
  }
};
