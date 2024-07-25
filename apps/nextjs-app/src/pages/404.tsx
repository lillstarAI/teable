import type { GetStaticPropsContext } from 'next';
import { PaymentRequiredPage } from '@/features/system/pages';

export const getStaticProps = async ({ locale = 'en' }: GetStaticPropsContext) => {
  return {
    props: {
      locale,
    },
  };
};

export default function Custom404() {
  return <PaymentRequiredPage />;
}
