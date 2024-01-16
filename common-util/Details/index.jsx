import {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd';
import { get } from 'lodash';
import { notifyError, Loader, NA } from '@autonolas/frontend-library';

import { GATEWAY_URL, NAV_TYPES } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
import { IpfsHashGenerationModal } from '../List/IpfsHashGenerationModal';
import { NftImage } from './NFTImage';
import { ServiceState } from './ServiceState';
import { HASH_DETAILS_STATE } from './constants';
import { DetailsSubInfo } from './DetailsSubInfo';
import { Header, DetailsTitle } from './styles';

const { Text } = Typography;

const pattern = /https:\/\/localhost\/(agent|component|service)\/+/g;
const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

const Details = ({
  id,
  type,
  getDetails,
  getTokenUri,
  handleUpdate,
  getOwner,
  onUpdateHash,
  onDependencyClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ownerAddress, setDetailsOwner] = useState(NA);
  const [tokenUri, setTokenUri] = useState(null);
  const { isSvm } = useHelpers();

  const { account, chainId } = useHelpers();

  // metadata details (from IPFS)
  const [metadata, setMetadata] = useState(null);
  const [metadataLoadState, setMetadataState] = useState(
    HASH_DETAILS_STATE.IS_LOADING,
  );

  const isOwner = account && account.toLowerCase() === ownerAddress.toLowerCase();

  const updateDetails = useCallback(async () => {
    try {
      const details = await getDetails();
      setInfo(details);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} details`);
    }
  }, [chainId, type]);

  // fetch details, owner and tokenUri
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
      } catch (e) {
        console.error(e);
        notifyError(`Error fetching ${type} details`);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [account, chainId, id, type]);

  // fetch metadata from IPFS
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

  // NFT details 👇
  const hashUrl = useMemo(() => getAutonolasTokenUri(tokenUri), [tokenUri]);

  const nftImageUrl = useMemo(() => {
    const image = get(metadata, 'image');
    if (!image) return null;
    return image.replace('ipfs://', GATEWAY_URL);
  }, [metadata]);

  const codeHref = useMemo(() => {
    const codeUri = get(metadata, 'code_uri');
    if (!codeUri) return null;
    return codeUri.replace('ipfs://', GATEWAY_URL);
  }, [metadata]);

  if (isLoading) {
    return <Loader timeoutMessage="Details couldn’t be loaded" />;
  }

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
              onClick={() => handleUpdate?.()}
            >
              Update
            </Button>
          )}
        </div>
      </Header>

      <Row>
        <Col md={12} xs={24}>
          <DetailsSubInfo
            id={id}
            isOwner={isOwner}
            type={type}
            tokenUri={tokenUri}
            // metadata details 👇
            metadataLoadState={metadataLoadState}
            hashUrl={hashUrl}
            codeHref={codeHref}
            nftImageUrl={nftImageUrl}
            description={get(metadata, 'description') || NA}
            version={get(metadata, 'attributes[0].value') || NA}
            // other details 👇
            ownerAddress={ownerAddress || NA}
            componentAndAgentDependencies={get(info, 'dependencies')}
            serviceThreshold={get(info, 'threshold') || NA}
            serviceCurrentState={get(info, 'state') || NA}
            onUpdateHash={onUpdateHash}
            setIsModalVisible={setIsModalVisible}
            onDependencyClick={onDependencyClick}
          />
        </Col>

        <Col md={12} xs={24}>
          {type === NAV_TYPES.SERVICE ? (
            <>
              {/* TODO: isSvm to be removed once read-omly is completed */}
              {!isSvm && (
                <ServiceState
                  isOwner={isOwner}
                  id={id}
                  account={account}
                  details={info}
                  updateDetails={updateDetails}
                />
              )}
            </>
          ) : (
            // NftImage for "service" is shown in DetailsSubInfo component
            // in the left column
            <NftImage imageUrl={nftImageUrl} isSmallSize={NAV_TYPES.SERVICE} />
          )}
        </Col>
      </Row>

      {isModalVisible && (
        <IpfsHashGenerationModal
          visible={isModalVisible}
          type={type}
          onUpdateHash={onUpdateHash}
          handleCancel={() => setIsModalVisible(false)}
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
  getTokenUri: PropTypes.func,
  getOwner: PropTypes.func,
  handleUpdate: PropTypes.func,
  onUpdateHash: PropTypes.func,
  onDependencyClick: PropTypes.func,
};

Details.defaultProps = {
  handleUpdate: null,
  getTokenUri: () => {},
  getOwner: () => {},
  onUpdateHash: () => {},
  onDependencyClick: () => {},
};

export default Details;
