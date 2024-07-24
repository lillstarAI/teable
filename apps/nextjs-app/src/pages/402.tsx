import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { PaymentRequiredPage } from '@/features/system/pages';
import { useEffect, useState } from 'react';
import { getServerSideTranslations } from '@/lib/i18n';

export default function Custom402() {
  const [translations, setTranslations] = useState({});
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadTranslations = async () => {
      const locale = i18n.language || 'en';
      const inlinedTranslation = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);
      setTranslations(inlinedTranslation);
    };

    loadTranslations();
  }, [i18n.language]);

  return <PaymentRequiredPage {...translations} />;
}

// This is needed to tell Next.js that this page should be statically generated
export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const inlinedTranslation = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);
  return {
    props: {
      locale: locale,
      ...inlinedTranslation,
    },
  };
};
