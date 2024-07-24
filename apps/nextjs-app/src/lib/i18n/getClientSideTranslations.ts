import { I18nActiveNamespaces } from './I18nNamespace.types';

export async function getClientSideTranslations(
  locale: string,
  namespaces: I18nActiveNamespaces
) {
  const translations = {};
  for (const namespace of namespaces) {
    const res = await fetch(`/locales/${locale}/${namespace}.json`);
    translations[namespace] = await res.json();
  }
  return translations;
}
