import dynamic from 'next/dynamic';

const ServiceDetails = dynamic(
  () => import('components/ListServices/details'),
  {
    ssr: false,
  },
);

export default ServiceDetails;
