import dynamic from 'next/dynamic';

const ListServices = dynamic(() => import('components/ListServices'), {
  ssr: false,
});

export default ListServices;
