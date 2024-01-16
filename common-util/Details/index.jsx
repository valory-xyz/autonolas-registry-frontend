import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd';
import { get } from 'lodash';
import { notifyError, Loader } from '@autonolas/frontend-library';

import { GATEWAY_URL, NAV_TYPES } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
import { IpfsHashGenerationModal } from '../List/IpfsHashGenerationModal';
import { NftImage } from './NFTImage';
import { ServiceState } from './ServiceState';
import { HASH_DETAILS_STATE } from './constants';
import { getAutonolasTokenUri, DetailsInfo } from './helpers';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailsOwner, setDetailsOwner] = useState('');
  const [tokenUri, setTokenUri] = useState(null);
  const { isSvm } = useHelpers();

  const { account, chainId } = useHelpers();

  // metadata details (from IPFS)
  const [metadata, setMetadata] = useState(null);
  const [metadataState, setMetadataState] = useState(
    HASH_DETAILS_STATE.IS_LOADING,
  );

  const isOwner = account && account.toLowerCase() === detailsOwner.toLowerCase();

  const updateDetails = useCallback(async () => {
    try {
      const details = await getDetails();
      setInfo(details);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} details`);
    }
  }, [chainId, type]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setInfo([]);

      try {
        const temp = await getDetails();
        setInfo(temp);
        // console.log({ details: temp });

        const ownerAccount = await getOwner();
        setDetailsOwner(ownerAccount || '');
        // console.log({ ownerAccount });

        const tempTokenUri = await getTokenUri();
        setTokenUri(tempTokenUri);
        // console.log({ tempTokenUri });
      } catch (e) {
        console.error(e);
        notifyError(`Error fetching ${type} details`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [account, chainId, id]);

  useEffect(() => {
    const getMetadata = async () => {
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
    };

    if (tokenUri) getMetadata();
  }, [tokenUri]);

  const onUpdate = () => {
    if (handleUpdate) handleUpdate();
  };

  const onCancel = async () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return <Loader timeoutMessage="Details couldn’t be loaded" />;
  }

  const nftImageUrl = (get(metadata, 'image') || '').replace(
    'ipfs://',
    GATEWAY_URL,
  );

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
            info={info}
            metadata={metadata}
            nftImageUrl={nftImageUrl}
            metadataState={metadataState}
            detailsOwner={detailsOwner}
            onUpdateHash={onUpdateHash}
            setIsModalVisible={setIsModalVisible}
            onDependencyClick={onDependencyClick}
          />
        </Col>

        <Col md={12} xs={24}>
          {type !== NAV_TYPES.SERVICE && (
            <NftImage imageUrl={nftImageUrl} isSmallSize={NAV_TYPES.SERVICE} />
          )}

          {/* TODO: isSvm to be removed once read-omly is completed */}
          {type === NAV_TYPES.SERVICE && !isSvm && (
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
