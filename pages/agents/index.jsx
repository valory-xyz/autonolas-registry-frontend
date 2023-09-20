import dynamic from 'next/dynamic';

const ListAgents = dynamic(() => import('components/ListAgents'), {
  ssr: false,
});

export default ListAgents;
