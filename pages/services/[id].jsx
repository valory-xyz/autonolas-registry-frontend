import dynamic from 'next/dynamic';

const Service = dynamic(() => import('components/ListServices/details'), {
  ssr: false,
});

export default Service;
