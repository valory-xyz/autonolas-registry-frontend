import dynamic from 'next/dynamic';

const AgentDetails = dynamic(() => import('components/ListAgents/details'), {
  ssr: false,
});

export default AgentDetails;
