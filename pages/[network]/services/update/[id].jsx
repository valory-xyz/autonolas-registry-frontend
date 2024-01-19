import dynamic from 'next/dynamic';

const UpdateService = dynamic(() => import('components/ListServices/update'), {
  ssr: false,
});

export default UpdateService;
