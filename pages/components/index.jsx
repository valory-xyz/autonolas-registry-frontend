import dynamic from 'next/dynamic';

const ListComponents = dynamic(() => import('components/ListComponents'), {
  ssr: false,
});

export default ListComponents;
