import dynamic from 'next/dynamic';

const MintComponent = dynamic(() => import('components/ListComponents/mint'), {
  ssr: false,
});

export default MintComponent;
