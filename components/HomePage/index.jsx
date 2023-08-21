import { useSelector } from 'react-redux';
import {
  Button, Col, Row, Typography,
} from 'antd';
import Link from 'next/link';
import { URL } from 'util/constants';
import { isL1Network } from 'common-util/functions';
import { useScreen } from 'common-util/hooks/useScreen';
import { Container, HeaderRow, ContentRow } from './styles';

const { Title, Text } = Typography;

const IMG_PATH = 'images/homepage/';

const LIST = [
  {
    type: 'services',
    title: 'Service owners mint and manage complete agent services',
    desc: 'They manage how the service is set up. Service owners define the business model of their services, and charge DAOs to use them.',
    link: URL.SERVICES,
  },
  {
    type: 'agents',
    title: 'Services are made of agents',
    desc: 'Services are run by multiple  software agents, each with an independent operator. Developers can author full agents, and these can be composed by service owners.',
    link: URL.AGENTS,
  },
  {
    type: 'components',
    title: 'Each agent is made of components',
    desc: 'Components are smaller blocks of code which can be reused by agent developers.',
    link: URL.COMPONENTS,
  },
];

const HomePage = () => {
  const chainId = useSelector((state) => state?.setup?.chainId);
  const { isMobile } = useScreen();

  return (
    <Container>
      <HeaderRow className="row-1">
        <Row>
          <Col span={14} offset={2}>
            <Title className="hero-title">
              {` Mint and manage your services${
                isL1Network(chainId) ? ', agents and components' : ''
              }.`}
            </Title>
            <Text className="lead">
              The easiest way to interact with the Autonolas on-chain registry.
            </Text>
            <Link
              href={isL1Network(chainId) ? URL.COMPONENTS : URL.SERVICES}
              passHref
              legacyBehavior
            >
              <Button type="primary" size="large">
                Get started →
              </Button>
            </Link>
          </Col>
          <Col span={8}>
            <div
              className="header-image"
              style={{
                backgroundImage: `url(${IMG_PATH}autonomous-agent-service-architecture.svg)`,
              }}
            />
          </Col>
        </Row>
      </HeaderRow>

      <ContentRow className="row-2">
        <Title level={3} className="title">
          How are Autonolas services architected?
        </Title>

        {LIST.map(({
          title, desc, link, type,
        }) => (
          <Row
            className="each-service"
            key={`each-service-${type}`}
            align="middle"
          >
            <Col className="column column-1" md={12} xs={10}>
              <img
                src={`/${IMG_PATH}${type}.svg`}
                className="each-service-image"
                alt={desc}
                width={isMobile ? 120 : 150}
                height={isMobile ? 120 : 150}
              />
            </Col>

            <Col className="column column-2" md={12} xs={14}>
              <Title level={4}>{title}</Title>
              <Text className="description">{desc}</Text>
              <br />
              {type === 'services' ? (
                <Link href={link} legacyBehavior>{`View all ${type}`}</Link>
              ) : (
                <>
                  {isL1Network(chainId) ? (
                    <Link href={link} legacyBehavior>{`View all ${type}`}</Link>
                  ) : (
                    <Text disabled>
                      {`Switch network (to Ethereum or Goerli) to view ${type}`}
                    </Text>
                  )}
                </>
              )}
            </Col>
          </Row>
        ))}
      </ContentRow>
    </Container>
  );
};

export default HomePage;
