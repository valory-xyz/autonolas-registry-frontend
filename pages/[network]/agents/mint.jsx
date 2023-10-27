import dynamic from 'next/dynamic';

const MintAgent = dynamic(() => import('components/ListAgents/mint'), {
  ssr: false,
});

export default MintAgent;
