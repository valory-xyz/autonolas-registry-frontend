import { Col, Row, Typography } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { isL1Network } from '@autonolas/frontend-library';

import { URL } from 'util/constants';
import { useScreen } from 'common-util/hooks/useScreen';
import { useHelpers } from 'common-util/hooks';
import { ContentRow } from './styles';

const { Title, Text } = Typography;

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

export const AutonolasServicesArchitected = () => {
  const { chainId } = useHelpers();
  const { isMobile } = useScreen();

  return (
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
            <Image
              src={`/images/homepage/${type}.svg`}
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
  );
};
