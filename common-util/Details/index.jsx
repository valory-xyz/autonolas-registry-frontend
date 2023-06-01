import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd/lib';
import { NAV_TYPES } from 'util/constants';
import Loader from 'common-util/components/Loader';
import IpfsHashGenerationModal from '../List/IpfsHashGenerationModal';
import { NftImage } from './NFTImage';
import { ServiceState } from './ServiceState';
import {
  getAutonolasTokenUri,
  DetailsInfo,
  HASH_DETAILS_STATE,
} from './helpers';
import { Header, DetailsTitle } from './styles';

const { Text } = Typography;
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

  // metadata details
  const [metadata, setMetadata] = useState(null);
  const [metadataState, setMetadataState] = useState(
    HASH_DETAILS_STATE.IS_LOADING,
  );

  const isOwner = account.toLowerCase() === detailsOwner.toLowerCase();

  const getUpdatedHashes = async () => {
    try {
      const hashesResponse = await getHashes();
      setHashes(hashesResponse);
    } catch (e) {
      console.error(e);
      throw e;
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

  useEffect(() => {
    (async () => {
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

        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [account, id]);

  useEffect(() => {
    (async () => {
      if (tokenUri) {
        setMetadataState(HASH_DETAILS_STATE.IS_LOADING);
        try {
          const ipfsUrl = getAutonolasTokenUri(tokenUri);
          const response = await fetch(ipfsUrl);
          const json = await response.json();
          setMetadata(json);
          setMetadataState(HASH_DETAILS_STATE.LOADED);
        } catch (e) {
          setMetadataState(HASH_DETAILS_STATE.FAILED);
          window.console.log('Error fetching metadata from IPFS');
          console.error(e);
        }
      }
    })();
  }, [tokenUri]);

  if (isLoading) {
    return <Loader message="Details couldn’t be loaded" />;
  }

  const onUpdate = () => {
    if (handleUpdate) handleUpdate();
  };

  const onCancel = async () => {
    await getUpdatedHashes();
    setIsModalVisible(false);
  };

  return (
    <>
      <Header>
        <div>
          <Text strong>{`${capitalize(type)} Name`}</Text>
          <DetailsTitle level={2}>
            {`${capitalize(type)} ID ${id}`}
          </DetailsTitle>
        </div>
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
          <DetailsInfo
            id={id}
            isOwner={isOwner}
            type={type}
            tokenUri={tokenUri}
            hashes={hashes}
            info={info}
            metadata={metadata}
            metadataState={metadataState}
            detailsOwner={detailsOwner}
            onUpdateHash={onUpdateHash}
            setIsModalVisible={setIsModalVisible}
            onDependencyClick={onDependencyClick}
          />
        </Col>

        <Col className="gutter-row" span={12}>
          {type !== NAV_TYPES.SERVICE && (
            <NftImage metadata={metadata} type={type} />
          )}

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
  type: PropTypes.oneOf([
    NAV_TYPES.AGENT,
    NAV_TYPES.COMPONENT,
    NAV_TYPES.SERVICE,
  ]).isRequired,
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
