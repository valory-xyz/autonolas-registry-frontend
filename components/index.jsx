import dynamic from 'next/dynamic';
import { GlobalStyle } from './styles';

const Login = dynamic(() => import('./Login'));

const Home = () => (
  <>
    <Login />
    <GlobalStyle />
  </>
);

export default Home;
