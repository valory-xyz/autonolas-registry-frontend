import {
  Button, Col, Row, Typography,
} from 'antd';
import Link from 'next/link';
import Image from 'next/image';

import { useScreen } from 'common-util/hooks/useScreen';
import { useHelpers } from 'common-util/hooks';
import { AutonolasServicesArchitected } from './AutonolasServicesArchitected';
import { Container, HeaderRow } from './styles';

const { Title, Text } = Typography;

const HomePage = () => {
  const { isL1Network, links } = useHelpers();
  const { isMobile } = useScreen();

  return (
    <Container>
      <HeaderRow className="row-1">
        <Row>
          <Col span={14} offset={2}>
            <Title className="hero-title">
              {` Mint and manage your services${
                isL1Network ? ', agents and components' : ''
              }.`}
            </Title>
            <Text className="lead">
              The easiest way to interact with the Autonolas on-chain registry.
            </Text>
            <Link
              href={isL1Network ? links.COMPONENTS : links.SERVICES}
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
