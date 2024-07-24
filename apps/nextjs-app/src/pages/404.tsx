import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { NotFoundPage } from '@/features/system/pages';
import { useEffect, useState } from 'react';
import { getClientSideTranslations } from '@/lib/i18n'; // You'll need to create this function

export default function Custom404() {
  const { i18n } = useTranslation(systemConfig.i18nNamespaces);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      const clientTranslations = await getClientSideTranslations(i18n.language, systemConfig.i18nNamespaces);
      setTranslations(clientTranslations);
    };
    loadTranslations();
  }, [i18n.language]);

  return <NotFoundPage {...translations} />;
}
