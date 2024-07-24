import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { PaymentRequiredPage } from '@/features/system/pages'; // or ForbiddenPage or NotFoundPage
import { useEffect, useState } from 'react';
import { getClientSideTranslations } from '@/lib/i18n';

export default function Custom402() { // or Custom403 or Custom403
  const { i18n } = useTranslation(systemConfig.i18nNamespaces);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      const clientTranslations = await getClientSideTranslations(i18n.language, systemConfig.i18nNamespaces);
      setTranslations(clientTranslations);
    };
    loadTranslations();
  }, [i18n.language]);

  return <PaymentRequiredPage {...translations} />; // or ForbiddenPage or NotFoundPage
}
