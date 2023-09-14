import { useSelector } from 'react-redux';
import {
  Button, Col, Row, Typography,
} from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { isL1Network } from '@autonolas/frontend-library';

import { URL } from 'util/constants';
import { useScreen } from 'common-util/hooks/useScreen';
import { AutonolasServicesArchitected } from './AutonolasServicesArchitected';
import { Container, HeaderRow } from './styles';

const { Title, Text } = Typography;

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
            <Image
              src="/images/homepage/autonomous-agent-service-architecture.svg"
              width={isMobile ? 120 : 344}
              height={isMobile ? 120 : 344}
              fetchPriority="high"
              alt="Autonomous Agent Service Architecture"
            />
          </Col>
        </Row>
      </HeaderRow>

      <AutonolasServicesArchitected />
    </Container>
  );
};

export default HomePage;
