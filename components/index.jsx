import dynamic from 'next/dynamic';

const Login = dynamic(() => import('./Login'));

const Home = () => (
  <>
    <Login />
  </>
);

export default Home;
