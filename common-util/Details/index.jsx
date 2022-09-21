import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Typography,
} from 'antd/lib';
import { NAV_TYPES, GATEWAY_URL } from 'util/constants';
import Loader from 'common-util/components/Loader';
import IpfsHashGenerationModal from '../List/IpfsHashGenerationModal';
import { ServiceState } from './ServiceState';
import { getAutonolasTokenUri, DetailsInfo } from './helpers';
import { Header, DetailsTitle, NftImageContainer } from './styles';

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
  const [hashDetails, setHashDetails] = useState(null);

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
        const json = await response.json();
        setHashDetails(json);
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

  return (
    <>
      <Header>
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
          <Text strong>
            {`${capitalize(type)} Name`}
          </Text>
          <DetailsTitle level={2}>
            {`${capitalize(type)} ID ${id}`}
          </DetailsTitle>

          <DetailsInfo
            isOwner={isOwner}
            type={type}
            id={id}
            tokenUri={tokenUri}
            hashes={hashes}
            info={info}
            hashDetails={hashDetails}
            detailsOwner={detailsOwner}
            onUpdateHash={onUpdateHash}
            setIsModalVisible={setIsModalVisible}
            onDependencyClick={onDependencyClick}
          />
        </Col>

        <Col className="gutter-row" span={12}>
          <NftImageContainer
            src={(get(hashDetails, 'image') || '').replace(
              'ipfs://',
              GATEWAY_URL,
            )}
            alt="NFT"
            width={type === NAV_TYPES.SERVICE ? 300 : 600}
            height={type === NAV_TYPES.SERVICE ? 300 : 600}
          />

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
