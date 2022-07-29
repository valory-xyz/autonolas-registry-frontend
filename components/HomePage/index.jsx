import { URL } from 'util/constants';
import { MyLink } from 'common-util/List/ListCommon';
import { Container, HeaderRow, ContentRow } from './styles';

const IMG_PATH = 'images/homepage/';

const LIST = [
  {
    type: 'services',
    title: 'SERVICE OWNERS REGISTER AND MANAGE COMPLETE AGENT SERVICES',
    desc: 'They manage how the service is set up. Service owners define the business model of their services, and charge DAOs to use them.',
    link: URL.SERVICES,
    imageUrl: 'illustrations-1.png',
  },
  {
    type: 'agents',
    title: 'SERVICES ARE MADE OF AGENTS',
    desc: 'Services are run by multiple  software agents, each with an independent operator. Developers can author full agents, and these can be composed by service owners.',
    link: URL.AGENTS,
    imageUrl: 'illustrations-2.png',
  },
  {
    type: 'components',
    title: 'EACH AGENT IS MADE OF COMPONENTS',
    desc: 'Components are smaller blocks of code which can be reused by agent developers.',
    link: URL.COMPONENTS,
    imageUrl: 'illustrations-3.png',
    imageStyle: { width: 164, margin: 0 },
  },
];

const HomePage = () => (
  <Container>
    <HeaderRow className="row-1">
      <div className="column-1">
        <h1>Register and manage your services, agents and components</h1>
        <p className="desc">
          The easiest way to interact with the Autonolas on-chain registry.
        </p>
      </div>

      <div className="column-2">
        <div
          className="header-image"
          style={{
            backgroundImage: `url(${IMG_PATH}illustrations-heading.png)`,
          }}
        />
      </div>
    </HeaderRow>

    <ContentRow className="row-2">
      <h3 className="sub-title">How are Autonolas services architected? </h3>

      {LIST.map(({
        title, desc, link, imageUrl, type, imageStyle,
      }) => (
        <div className="each-service" key={`each-serivce-${type}`}>
          <div className="column column-1">
            <div
              className="each-service-image"
              style={{
                backgroundImage: `url(${IMG_PATH}${imageUrl})`,
                ...(imageStyle || {}),
              }}
            />
          </div>

          <div className="column column-2">
            <div className="title">{title}</div>
            <div className="desc">{desc}</div>
            <MyLink href={link}>{`View all ${type}`}</MyLink>
          </div>
        </div>
      ))}
    </ContentRow>

    <br />
    <br />
  </Container>
);

export default HomePage;
