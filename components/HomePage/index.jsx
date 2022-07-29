import { URL } from 'util/constants';
import { MyLink } from 'common-util/List/ListCommon';
import { Col, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { Container, HeaderRow, ContentRow } from './styles';

const IMG_PATH = 'images/homepage/';

const LIST = [
  {
    type: 'services',
    title: 'Service owners register and manage complete agent services',
    desc: 'They manage how the service is set up. Service owners define the business model of their services, and charge DAOs to use them.',
    link: URL.SERVICES,
    imageUrl: 'illustrations-1.png',
  },
  {
    type: 'agents',
    title: 'Services are made of agents',
    desc: 'Services are run by multiple  software agents, each with an independent operator. Developers can author full agents, and these can be composed by service owners.',
    link: URL.AGENTS,
    imageUrl: 'illustrations-2.png',
  },
  {
    type: 'components',
    title: 'Each agent is made of components',
    desc: 'Components are smaller blocks of code which can be reused by agent developers.',
    link: URL.COMPONENTS,
    imageUrl: 'illustrations-3.png',
  },
];

const HomePage = () => (
  <Container>
    <HeaderRow className="row-1">
      <Row>
        <Col span={14} offset={2}>
          <Title className="hero-title">Register and manage your services, agents and components</Title>
          <Text className="lead">
            The easiest way to interact with the Autonolas on-chain registry.
          </Text>
        </Col>
        <Col span={8}>
          <div
            className="header-image"
            style={{
              backgroundImage: `url(${IMG_PATH}illustrations-heading.png)`,
            }}
          />
        </Col>
      </Row>
    </HeaderRow>

    <ContentRow className="row-2">
      <Title level={3} className="title">How are Autonolas services architected? </Title>

      {LIST.map(({
        title, desc, link, imageUrl, type,
      }) => (
        <Row className="each-service" key={`each-service-${type}`} align="middle">
          <Col className="column column-1">
            <img src={`/${IMG_PATH}${imageUrl}`} className="each-service-image" alt="" />
          </Col>

          <Col className="column column-2">
            <Title level={5}>{title}</Title>
            <Text className="description">{desc}</Text>
            <br />
            <MyLink href={link}>{`View all ${type}`}</MyLink>
          </Col>
        </Row>
      ))}
    </ContentRow>

    <br />
    <br />
  </Container>
);

export default HomePage;
