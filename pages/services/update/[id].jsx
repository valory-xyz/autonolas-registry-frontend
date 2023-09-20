import dynamic from 'next/dynamic';

const UpdateService = dynamic(() => import('components/ListServices/service'), {
  ssr: false,
});

export default UpdateService;
