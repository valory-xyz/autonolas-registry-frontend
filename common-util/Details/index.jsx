import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd';
import { get } from 'lodash';
import { notifyError, Loader, NA } from '@autonolas/frontend-library';

import { NAV_TYPES } from 'util/constants';
import { useHelpers } from 'common-util/hooks';
import { useMetadata } from 'common-util/hooks/useMetadata';
import { IpfsHashGenerationModal } from '../List/IpfsHashGenerationModal';
import { NftImage } from './NFTImage';
import { ServiceState } from './ServiceState';
import { DetailsSubInfo } from './DetailsSubInfo';
import { Header, DetailsTitle } from './styles';

const { Text } = Typography;

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
  const { nftImageUrl } = useMetadata(tokenUri);

  // metadata details (from IPFS)

  const isOwner = account && account.toLowerCase() === ownerAddress.toLowerCase();

  const updateDetails = useCallback(async () => {
    try {
      const details = await getDetails();
      setInfo(details);
    } catch (e) {
      console.error(e);
      notifyError(`Error fetching ${type} details`);
    }
  }, [chainId, type]); /* eslint-disable-line react-hooks/exhaustive-deps */

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
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [account, chainId, id, type]);

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
                  id={id}
                  account={account}
                  isOwner={isOwner}
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
