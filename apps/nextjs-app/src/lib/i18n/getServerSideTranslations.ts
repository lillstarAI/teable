/**
 * Retrieve translations on server-side, wraps next-i18next.serverSideTranslations
 * to allow further customizations.
 */
import type { SSRConfig, UserConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { I18nNamespace } from '@/lib/i18n/I18nNamespace.types';

export const getServerSideTranslations = async (
  locale: string,
  namespacesRequired?: I18nNamespace[] | I18nNamespace | undefined,
  configOverride?: UserConfig | null,
  extraLocales?: string[] | false
): Promise<SSRConfig> => {
  try {
    // Ensure locale is a string
    const safeLocale = typeof locale === 'string' ? locale : 'en';

    // Ensure namespacesRequired is an array
    const safeNamespaces = Array.isArray(namespacesRequired) 
      ? namespacesRequired 
      : typeof namespacesRequired === 'string' 
        ? [namespacesRequired] 
        : [];

    const translations = await serverSideTranslations(
      safeLocale, 
      safeNamespaces as string[], 
      configOverride, 
      extraLocales
    );

    return translations;
  } catch (error) {
    console.error('Error in getServerSideTranslations:', error);
    // Return an empty config if there's an error
    return { _nextI18Next: { initialI18nStore: {}, initialLocale: locale, userConfig: null } };
  }
};

// Export as default and named export for flexibility
export default getServerSideTranslations;
