import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { systemConfig } from '@/features/i18n/system.config';
import { getServerSideTranslations } from '@/lib/i18n';

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { locale = 'en' } = context;

  const inlinedTranslation = await getServerSideTranslations(locale, systemConfig.i18nNamespaces);

  return {
    props: {
      locale: locale,
      ...inlinedTranslation,
    },
  };
};

export default function Home(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* Add your content here */}
    </div>
  );
}