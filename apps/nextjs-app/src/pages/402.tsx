import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { PaymentRequiredPage } from '@/features/system/pages';
import { useEffect, useState } from 'react';
import { getServerSideTranslations } from '@/lib/i18n';
import type { GetStaticProps } from 'next';

// Funktion för att hämta fallback-översättningar
const getFallbackTranslations = (locale: string) => {
  // Implementera detta med hårdkodade översättningar för byggtid
  return {
    // Exempel:
    // common: {
    //   title: locale === 'sv' ? 'Betalning krävs' : 'Payment Required',
    // },
  };
};

export default function Custom402({ initialTranslations }: { initialTranslations: any }) {
  const [translations, setTranslations] = useState(initialTranslations);
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadTranslations = async () => {
      if (process.env.NODE_ENV !== 'production') {
        const locale = i18n.language || 'en';
        const inlinedTranslation = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);
        setTranslations(inlinedTranslation);
      }
    };

    loadTranslations();
  }, [i18n.language]);

  return <PaymentRequiredPage {...translations} />;
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  let inlinedTranslation;

  if (process.env.NODE_ENV === 'production') {
    inlinedTranslation = getFallbackTranslations(locale);
  } else {
    inlinedTranslation = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);
  }

  return {
    props: {
      initialTranslations: inlinedTranslation,
    },
  };
};
