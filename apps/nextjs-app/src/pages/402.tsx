import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { PaymentRequiredPage } from '@/features/system/pages';
import { useEffect } from 'react';
import { getServerSideTranslations } from '@/lib/i18n';
import type { GetServerSidePropsContext } from 'next';

export default function Custom402() {
  const { i18n, t } = useTranslation(systemConfig.i18nNamespaces);

  useEffect(() => {
    const loadTranslations = async () => {
      if (typeof window !== 'undefined') {
        const { getClientSideTranslations } = await import('@/lib/i18n');
        await getClientSideTranslations(i18n.language, systemConfig.i18nNamespaces);
        // Här behöver vi inte sätta översättningarna manuellt eftersom next-i18next kommer att hantera det
      }
    };
    loadTranslations();
  }, [i18n.language]);

  return <PaymentRequiredPage />;
}

export { getServerSideProps };
