import { useTranslation } from 'next-i18next';
import { systemConfig } from '@/features/i18n/system.config';
import { NotFoundPage } from '@/features/system/pages';
import { getServerSideTranslations } from '@/lib/i18n';
import type { GetServerSideProps } from 'next';

export default function Custom404({ translations }: { translations: any }) {
  const { t } = useTranslation(systemConfig.i18nNamespaces);

  return <NotFoundPage {...translations} />;
}

export const getServerSideProps: GetServerSideProps = async ({ locale = 'en' }) => {
  const translations = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);

  return {
    props: {
      translations,
    },
  };
};
