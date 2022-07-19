import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Alert,
} from 'antd';
import {
  NAV_TYPES,
  SERVICE_STATE,
  SERVICE_STATE_INFO,
  NA,
} from 'util/constants';
import Loader from 'common-util/components/Loader';
import { RegisterMessage, getIpfsHashFromBytes32 } from '../List/ListCommon';
import IpfsHashGenerationModal from '../List/IpfsHashGenerationModal';
import { ServiceState } from './ServiceState';
import { getTable } from './helpers';
import {
  Header,
  DetailsTitle,
  InfoSubHeader,
  Info,
  SectionContainer,
  EachSection,
} from './styles';

const gt = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

const Details = ({
  account,
  id,
  type,
  getDetails,
  getHashes,
  handleUpdate,
  getOwner,
  onUpdateHash,
  onDependencyClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [hashes, setHashes] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailsOwner, setDetailsOwner] = useState('');
  const status = get(info, 'state');
  const isOwner = account.toLowerCase() === detailsOwner.toLowerCase();

  const getUpdatedHashes = async () => {
    try {
      const hashesResponse = await getHashes();
      setHashes(hashesResponse);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(async () => {
    setIsLoading(true);
    setInfo([]);

    try {
      const temp = await getDetails();
      setInfo(temp);

      const ownerAccount = await getOwner();
      setDetailsOwner(ownerAccount || '');

      await getUpdatedHashes();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [account, id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!account) {
    return (
      <>
        <Header>
          <DetailsTitle level={2}>{`${capitalize(type)}`}</DetailsTitle>
        </Header>
        <RegisterMessage />
      </>
    );
  }

  const onUpdate = () => {
    if (handleUpdate) handleUpdate();
  };

  const onCancel = async () => {
    await getUpdatedHashes();
    setIsModalVisible(false);
  };

  const generateDetails = () => {
    const getComponentAndAgentValues = () => {
      const dependencies = get(info, 'dependencies') || [];
      const hash = get(hashes, 'unitHashes') || [];

      return [
        { title: 'Owner Address', value: detailsOwner || NA },
        {
          title: 'Developer Address',
          value: get(info, 'developer', null) || NA,
        },
        {
          title: 'Hash',
          dataTestId: 'hashes-list',
          value: (
            <>
              {hash.length === 0 ? (
                NA
              ) : (
                <>
                  {hash.map((e, index) => (
                    <li key={`${type}-hashes-${index}`}>
                      {getIpfsHashFromBytes32(e)}
                    </li>
                  ))}
                </>
              )}
            </>
          ),
        },
        {
          title: 'Component Dependencies',
          dataTestId: 'details-dependency',
          value:
            dependencies.length === 0 ? (
              <>NA</>
            ) : (
              dependencies.map((e) => (
                <li key={`${type}-dependency-${e}`}>
                  <Button type="link" onClick={() => onDependencyClick(e)}>
                    {e}
                  </Button>
                </li>
              ))
            ),
        },
      ];
    };

    const getServiceValues = () => {
      const hash = get(hashes, 'configHashes') || [];

      return [
        { title: 'Name', value: get(info, 'name', null) || NA },
        { title: 'Owner Address', value: detailsOwner || NA },
        {
          title: 'Developer Address',
          value: get(info, 'developer', null) || NA,
        },
        {
          title: 'Hash',
          dataTestId: 'hashes-list',
          value: (
            <>
              {hash.map((e, index) => (
                <li key={`${type}-hashes-${index}`}>
                  {getIpfsHashFromBytes32(e.hash)}
                </li>
              ))}
            </>
          ),
        },
        {
          title: 'Active',
          value: get(info, 'active', null) ? 'TRUE' : 'FALSE',
        },
        {
          type: 'table',
          dataTestId: 'agent-id-table',
          value: getTable(info, { onDependencyClick }),
        },
        { title: 'Threshold', value: get(info, 'threshold', null) || NA },
      ];
    };

    const details = type === NAV_TYPES.SERVICE
      ? getServiceValues()
      : getComponentAndAgentValues();

    return (
      <SectionContainer>
        {details.map(({ title, value, dataTestId }, index) => (
          <EachSection key={`${type}-details-${index}`}>
            <InfoSubHeader>{title}</InfoSubHeader>
            <Info data-testid={dataTestId || ''}>{value}</Info>
          </EachSection>
        ))}
      </SectionContainer>
    );
  };

  return (
    <>
      <Header>
        <DetailsTitle level={2}>{`${capitalize(type)} ID ${id}`}</DetailsTitle>
        <div className="right-content">
          {/* Update button to be show only if the connected account is the owner */}
          {isOwner && (
            <>
              <Button
                disabled={!handleUpdate}
                type="primary"
                ghost
                onClick={onUpdate}
              >
                Update
              </Button>

              {onUpdateHash && (
                <Button
                  type="primary"
                  ghost
                  onClick={() => setIsModalVisible(true)}
                >
                  Update Hash
                </Button>
              )}
            </>
          )}
        </div>
      </Header>

      <Row gutter={gt}>
        <Col className="gutter-row" span={12}>
          <InfoSubHeader>Description</InfoSubHeader>
          <div>{get(info, 'description', null) || NA}</div>

          {status && (
            <>
              <br />
              <InfoSubHeader>Status</InfoSubHeader>
              <div className="mb-12">{SERVICE_STATE[status]}</div>
              <Alert
                message={SERVICE_STATE_INFO[status]}
                type="info"
                showIcon
              />
            </>
          )}

          {type === NAV_TYPES.SERVICE && (
            <ServiceState isOwner={isOwner} status={status} />
          )}
        </Col>

        <Col className="gutter-row" span={12}>
          {generateDetails()}
        </Col>
      </Row>

      <IpfsHashGenerationModal
        visible={isModalVisible}
        type={type}
        onUpdateHash={onUpdateHash}
        handleCancel={onCancel}
      />
    </>
  );
};

Details.propTypes = {
  account: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  getDetails: PropTypes.func.isRequired,
  getHashes: PropTypes.func,
  getOwner: PropTypes.func,
  handleUpdate: PropTypes.func,
  onUpdateHash: PropTypes.func,
  onDependencyClick: PropTypes.func,
};

Details.defaultProps = {
  account: null,
  handleUpdate: null,
  getHashes: () => {},
  getOwner: () => {},
  onUpdateHash: () => {},
  onDependencyClick: () => {},
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(Details);
