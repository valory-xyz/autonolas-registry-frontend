import dynamic from 'next/dynamic';

const MintService = dynamic(() => import('components/ListServices/mint'), {
  ssr: false,
});

export default MintService;
