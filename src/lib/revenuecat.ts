import { Capacitor } from '@capacitor/core';

// RevenueCat API key (publishable - safe in client code)
const REVENUECAT_API_KEY = 'appl_rDJWtfWfVugefZjBugxiJIISOcR';
const PRODUCT_ID = 'BIBLIATOONKIDS2';

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
 * Get current platform: 'ios', 'android', or 'web'
 */
export const getPlatform = (): string => {
  try {
    return Capacitor.getPlatform();
  } catch {
    return 'web';
  }
};

/**
 * Check if RevenueCat is supported (iOS only for now)
 */
const isRevenueCatSupported = (): boolean => {
  return isNativePlatform() && getPlatform() === 'ios';
};

/**
 * Initialize RevenueCat SDK - only works on iOS
 */
export const initRevenueCat = async (): Promise<void> => {
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

/**
 * Identify user in RevenueCat with their Supabase user ID
 */
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

/**
 * Purchase the monthly subscription
 * Returns true if purchase was successful
 */
export const purchaseMonthly = async (): Promise<{
  success: boolean;
  expiresAt?: string;
  error?: string;
}> => {
  if (!isRevenueCatSupported()) {
    const platform = getPlatform();
    if (platform === 'android') {
      return {
        success: false,
        error: 'Assinaturas via Google Play estarão disponíveis em breve!',
      };
    }
    return {
      success: false,
      error: 'Assinaturas só estão disponíveis no app nativo (iOS).',
    };
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    console.log('RevenueCat: SDK imported successfully');

    // Get available packages
    const offerings = await Purchases.getOfferings();
    console.log('RevenueCat: Offerings received', JSON.stringify({
      hasCurrentOffering: !!offerings?.current,
      currentId: offerings?.current?.identifier,
      packagesCount: offerings?.current?.availablePackages?.length ?? 0,
      productIds: offerings?.current?.availablePackages?.map(p => p.product?.identifier) ?? [],
    }));

    if (!offerings?.current?.availablePackages?.length) {
      console.error('RevenueCat: No packages available. Full offerings:', JSON.stringify(offerings));
      return {
        success: false,
        error: `Nenhum plano disponível. Offering: ${offerings?.current?.identifier ?? 'null'}, Pacotes: ${offerings?.current?.availablePackages?.length ?? 0}`,
      };
    }

    // Try to find the monthly package, or use the first available
    const monthlyPackage =
      offerings.current.availablePackages.find(
        (pkg) => pkg.product?.identifier === PRODUCT_ID
      ) || offerings.current.availablePackages[0];

    console.log('RevenueCat: Selected package', JSON.stringify({
      productId: monthlyPackage.product?.identifier,
      packageType: monthlyPackage.packageType,
      price: monthlyPackage.product?.priceString,
    }));

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
    console.error('RevenueCat: Purchase failed', JSON.stringify({
      code: error?.code,
      message: error?.message,
      underlyingErrorMessage: error?.underlyingErrorMessage,
      full: JSON.stringify(error),
    }));
    return {
      success: false,
      error: `Erro [${error?.code ?? '?'}]: ${error?.message ?? error?.underlyingErrorMessage ?? 'Erro desconhecido'}`,
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
  if (!isRevenueCatSupported()) {
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
