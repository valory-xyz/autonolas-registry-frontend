import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd';
import { notifyError, Loader } from '@autonolas/frontend-library';

import { NAV_TYPES } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
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

const Details = ({
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
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [hashes, setHashes] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailsOwner, setDetailsOwner] = useState('');
  const [tokenUri, setTokenUri] = useState(null);

  const { account, chainId } = useHelpers();

  // metadata details
  const [metadata, setMetadata] = useState(null);
  const [metadataState, setMetadataState] = useState(
    HASH_DETAILS_STATE.IS_LOADING,
  );

  const isOwner = account && account.toLowerCase() === detailsOwner.toLowerCase();

  const getUpdatedHashes = useCallback(async () => {
    try {
      const hashesResponse = await getHashes();
      setHashes(hashesResponse);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} hashes`);
    }
  }, [chainId]);

  const updateDetails = useCallback(async () => {
    try {
      const details = await getDetails();
      setInfo(details);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} details`);
    }
  }, [chainId]);

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
      } catch (e) {
        console.error(e);
        notifyError(`Error fetching ${type} details`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [account, chainId, id]);

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
          console.error(e);
          notifyError('Error fetching metadata from IPFS');
        }
      }
    })();
  }, [tokenUri]);

  if (isLoading) {
    return <Loader timeoutMessage="Details couldn’t be loaded" />;
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

        {/* Update button to be show only if the connected account is the owner */}
        <div className="right-content">
          {isOwner && type !== NAV_TYPES.SERVICE && (
            <Button
              disabled={!handleUpdate}
              type="primary"
              ghost
              onClick={onUpdate}
            >
              Update
            </Button>
          )}
        </div>
      </Header>

      <Row>
        <Col md={12} xs={24}>
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

        <Col md={12} xs={24}>
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

      {isModalVisible && (
        <IpfsHashGenerationModal
          visible={isModalVisible}
          type={type}
          onUpdateHash={onUpdateHash}
          handleCancel={onCancel}
        />
      )}
    </>
  );
};

Details.propTypes = {
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
  handleUpdate: null,
  getHashes: () => {},
  getTokenUri: () => {},
  getOwner: () => {},
  onUpdateHash: () => {},
  onDependencyClick: () => {},
};

export default Details;
