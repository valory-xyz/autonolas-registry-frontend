import { useState } from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd';
import { get } from 'lodash';
import { Loader, NA } from '@autonolas/frontend-library';

import { NAV_TYPES } from 'util/constants';
import { useMetadata } from 'common-util/hooks/useMetadata';
import { IpfsHashGenerationModal } from '../List/IpfsHashGenerationModal';
import { useDetails } from './useDetails';
import { NftImage } from './NFTImage';
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
  renderServiceState,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    isLoading, isOwner, info, ownerAddress, tokenUri, updateDetails,
  } = useDetails({
    id,
    type,
    getDetails,
    getOwner,
    getTokenUri,
  });
  const { nftImageUrl } = useMetadata(tokenUri);

  // Update button to be show only if the connected account is the owner
  // and only for agent and component
  const canShowUpdateBtn = isOwner && type !== NAV_TYPES.SERVICE;

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

        <div className="right-content">
          {canShowUpdateBtn && (
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
              {renderServiceState
                ? renderServiceState({ isOwner, details: info, updateDetails })
                : null}
            </>
          ) : (
            // NftImage for "service" is shown in `DetailsSubInfo` component
            // in the left column & for "agent" and "component" is shown here
            <NftImage imageUrl={nftImageUrl} />
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
  renderServiceState: PropTypes.func,
};

Details.defaultProps = {
  handleUpdate: null,
  getTokenUri: () => {},
  getOwner: () => {},
  onUpdateHash: () => {},
  onDependencyClick: () => {},
  renderServiceState: null,
};

export default Details;
