import dynamic from 'next/dynamic';

const Login = dynamic(() => import('./Login'), { ssr: false });

const Home = () => (
  <>
    <Login />
  </>
);

export default Home;
