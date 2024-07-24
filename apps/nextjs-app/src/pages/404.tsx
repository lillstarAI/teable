import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { systemConfig } from '@/features/i18n/system.config';
import { NotFoundPage } from '@/features/system/pages';
import { getServerSideTranslations } from '@/lib/i18n';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { locale = 'en' } = context;

  const inlinedTranslation = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);

  return {
    props: {
      locale: locale,
      ...inlinedTranslation,
    },
  };
};
export default function Custom404(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  return <NotFoundPage />;
}
