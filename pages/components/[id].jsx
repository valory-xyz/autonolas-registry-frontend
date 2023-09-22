import dynamic from 'next/dynamic';

const ComponentDetails = dynamic(
  () => import('components/ListComponents/details'),
  {
    ssr: false,
  },
);

export default ComponentDetails;
