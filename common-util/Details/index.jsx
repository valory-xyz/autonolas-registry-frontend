import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import { Row, Col, Button } from 'antd/lib';
import { NAV_TYPES, NA, GATEWAY_URL } from 'util/constants';
import Loader from 'common-util/components/Loader';
import IpfsHashGenerationModal from '../List/IpfsHashGenerationModal';
import { ServiceState } from './ServiceState';
import {
  ServiceMiniTable,
  getAutonolasTokenUri,
  getHashDetails,
} from './helpers';
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
  getTokenUri,
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
  const [tokenUri, setTokenUri] = useState(null);
  const [nftUrl, setNftUrl] = useState(null);

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

  const updateDetails = useCallback(async () => {
    try {
      const temp = await getDetails();
      setInfo(temp);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(async () => {
    setIsLoading(true);
    setInfo([]);

    try {
      const temp = await getDetails();
      setInfo(temp);

      const ownerAccount = await getOwner();
      setDetailsOwner(ownerAccount || '');

      const tempTokenUri = await getTokenUri();
      setTokenUri(tempTokenUri);

      await getUpdatedHashes();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [account, id]);

  useEffect(async () => {
    if (tokenUri) {
      try {
        const ipfsUrl = getAutonolasTokenUri(tokenUri);
        const response = await fetch(ipfsUrl);
        const { image } = await response.json();
        const imageURL = image.replace('ipfs://', GATEWAY_URL);
        setNftUrl(imageURL);
      } catch (e) {
        console.error(e);
      }
    }
  }, [tokenUri]);

  if (isLoading) {
    return <Loader />;
  }

  const onUpdate = () => {
    if (handleUpdate) handleUpdate();
  };

  const onCancel = async () => {
    await getUpdatedHashes();
    setIsModalVisible(false);
  };

  const generateDetails = () => {
    const hash = get(hashes, 'unitHashes') || [];
    const updateHashBtn = isOwner ? (
      <>
        {onUpdateHash && (
          <Button type="primary" ghost onClick={() => setIsModalVisible(true)}>
            Update Hash
          </Button>
        )}
      </>
    ) : null;

    const nftSection = {
      title: 'Image',
      dataTestId: 'nft-image',
      value: <img src={nftUrl} alt="NFT" width={500} height={500} />,
    };

    const getComponentAndAgentValues = () => {
      const dependencies = get(info, 'dependencies') || [];

      return [
        {
          title: 'Owner Address',
          dataTestId: 'owner-address',
          value: detailsOwner || NA,
        },
        {
          title: 'Hash',
          dataTestId: 'hashes-list',
          value: (
            <>
              {getHashDetails(type, hash, tokenUri)}
              {updateHashBtn}
            </>
          ),
        },
        {
          title: 'Component Dependencies',
          dataTestId: 'details-dependency',
          value:
            dependencies.length === 0 ? (
              <>None</>
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
        nftSection,
      ];
    };

    const getServiceValues = () => {
      const serviceState = ['2', '3', '4'].includes(get(info, 'state'));
      const agentIds = get(info, 'agentIds');

      return [
        {
          title: 'Owner Address',
          dataTestId: 'owner-address',
          value: detailsOwner || NA,
        },
        {
          title: 'Hash',
          dataTestId: 'hashes-list',
          value: (
            <>
              {getHashDetails(type, hash, tokenUri)}
              {updateHashBtn}
            </>
          ),
        },
        {
          title: 'Active',
          value: serviceState ? 'TRUE' : 'FALSE',
        },
        {
          type: 'table',
          dataTestId: 'agent-id-table',
          value: (
            <ServiceMiniTable
              id={id}
              agentIds={agentIds}
              onDependencyClick={onDependencyClick}
            />
          ),
        },
        { title: 'Threshold', value: get(info, 'threshold', null) || NA },
        nftSection,
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
          {isOwner && type !== NAV_TYPES.SERVICE && (
            <>
              <Button
                disabled={!handleUpdate}
                type="primary"
                ghost
                onClick={onUpdate}
              >
                Update
              </Button>
            </>
          )}
        </div>
      </Header>

      <Row gutter={gt}>
        <Col className="gutter-row" span={12}>
          {type === NAV_TYPES.SERVICE && (
            <ServiceState
              isOwner={isOwner}
              id={id}
              account={account}
              details={info}
              updateDetails={updateDetails}
            />
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
  getTokenUri: PropTypes.func,
  getOwner: PropTypes.func,
  handleUpdate: PropTypes.func,
  onUpdateHash: PropTypes.func,
  onDependencyClick: PropTypes.func,
};

Details.defaultProps = {
  account: '',
  handleUpdate: null,
  getHashes: () => {},
  getTokenUri: () => {},
  getOwner: () => {},
  onUpdateHash: () => {},
  onDependencyClick: () => {},
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || '';
  return { account: account || '' };
};

export default connect(mapStateToProps, {})(Details);
