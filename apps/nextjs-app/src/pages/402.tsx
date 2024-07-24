import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { PaymentRequiredPage } from '@/features/system/pages';
import { useEffect, useState } from 'react';
import { getServerSideProps as getServerSideTranslations } from '@/lib/i18n';
import type { GetServerSidePropsContext } from 'next';

export default function Custom402({ initialTranslations }: { initialTranslations: any }) {
  const { i18n } = useTranslation(systemConfig.i18nNamespaces);
  const [translations, setTranslations] = useState(initialTranslations);

  useEffect(() => {
    const loadTranslations = async () => {
      if (typeof window !== 'undefined') {
        const { getClientSideTranslations } = await import('@/lib/i18n');
        const clientTranslations = await getClientSideTranslations(i18n.language, systemConfig.i18nNamespaces);
        setTranslations(clientTranslations);
      }
    };
    loadTranslations();
  }, [i18n.language]);

  return <PaymentRequiredPage {...translations} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale = 'en' } = context;
  const initialTranslations = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);

  return {
    props: {
      initialTranslations,
    },
  };
}
