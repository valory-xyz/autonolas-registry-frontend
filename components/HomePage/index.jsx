import { useSelector } from 'react-redux';
import {
  Button, Col, Row, Typography,
} from 'antd';
import Link from 'next/link';
import { URL } from 'util/constants';
import { isL1Network } from 'common-util/functions';
import { AutonolasServicesArchitected } from './AutonolasServicesArchitected';
import { Container, HeaderRow } from './styles';

const { Title, Text } = Typography;

const IMG_PATH = 'images/homepage/';

const HomePage = () => {
  const chainId = useSelector((state) => state?.setup?.chainId);

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

      <AutonolasServicesArchitected />
    </Container>
  );
};

export default HomePage;
