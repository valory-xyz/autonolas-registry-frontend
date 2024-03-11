import { useEffect, useState } from 'react';
import { Button, Typography, Alert } from 'antd';
import PropTypes from 'prop-types';
import { NA } from '@autonolas/frontend-library';

import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
  NAV_TYPES,
  HASH_DETAILS_STATE,
} from 'util/constants';
import { typePropType } from 'common-util/propTypes';
import { Circle } from '../svg/Circle';
import { useHelpers } from '../hooks';
import { useMetadata } from '../hooks/useMetadata';
import { NftImage } from './NFTImage';
import { getTokenDetailsRequest } from './utils';
import { useOperatorWhitelistComponent } from './ServiceDetails/useOperatorWhitelistComponent';
import {
  SubTitle,
  Info,
  SectionContainer,
  EachSection,
  ServiceStatusContainer,
  ArrowLink,
} from './styles';

const { Link, Text } = Typography;

/**
 * Displays "service" status (active/inactive)
 */
const ServiceStatus = ({ serviceState }) => (
  <ServiceStatusContainer
    className={serviceState ? 'active' : 'inactive'}
    data-testid="service-status"
  >
    <Circle size={8} />
    <Text>{serviceState ? 'Active' : 'Inactive'}</Text>
  </ServiceStatusContainer>
);
ServiceStatus.propTypes = { serviceState: PropTypes.bool };
ServiceStatus.defaultProps = { serviceState: false };

const MetadataUnpinnedMessage = () => (
  <Alert
    message="Metadata is unpinned from IPFS server"
    type="warning"
    showIcon
  />
);

/**
 * Displays view hash and view code buttons redirecting to
 * links respectively
 */
const ViewHashAndCode = ({
  type, metadataLoadState, hashUrl, codeHref,
}) => {
  if (HASH_DETAILS_STATE.LOADED !== metadataLoadState) return null;

  return (
    <>
      {type === NAV_TYPES.SERVICE && <>&nbsp;•&nbsp;</>}
      <Link target="_blank" data-testid="view-hash-link" href={hashUrl}>
        View Hash&nbsp;
        <ArrowLink />
      </Link>
      &nbsp;•&nbsp;
      <Link target="_blank" data-testid="view-code-link" href={codeHref}>
        View Code&nbsp;
        <ArrowLink />
      </Link>
    </>
  );
};
ViewHashAndCode.propTypes = {
  type: typePropType,
  metadataLoadState: PropTypes.string,
  hashUrl: PropTypes.string,
  codeHref: PropTypes.string,
};
ViewHashAndCode.defaultProps = {
  type: null,
  metadataLoadState: '',
  hashUrl: '',
  codeHref: '',
};

/**
 * Agent | Component | Service - details component
 */
export const DetailsSubInfo = ({
  id,
  isOwner,
  type,
  tokenUri,

  // other details 👇
  ownerAddress,
  componentAndAgentDependencies,
  serviceThreshold,
  serviceCurrentState,

  openUpdateHashModal,
  handleHashUpdate,
  navigateToDependency,
}) => {
  const { isSvm, doesNetworkHaveValidServiceManagerToken } = useHelpers();
  const [tokenAddress, setTokenAddress] = useState(null);
  const {
    hashUrl,
    metadataLoadState,
    codeHref,
    nftImageUrl,
    description,
    version,
  } = useMetadata(tokenUri);

  // get operator whitelist component
  const {
    operatorWhitelistTitle,
    operatorWhitelistValue,
    operatorStatusValue,
  } = useOperatorWhitelistComponent(id);

  // get token address for service
  useEffect(() => {
    const fetchData = async () => {
      if (type === NAV_TYPES.SERVICE) {
        try {
          const response = await getTokenDetailsRequest(id);
          setTokenAddress(response.token);
        } catch (error) {
          console.error(error);
        }
      }
    };

    // token details is only available for L1 networks
    if (id && doesNetworkHaveValidServiceManagerToken && !isSvm) {
      fetchData();
    }
  }, [id, type, isSvm, doesNetworkHaveValidServiceManagerToken]);

  const viewHashAndCodeButtons = (
    <ViewHashAndCode
      type={type}
      metadataLoadState={metadataLoadState}
      hashUrl={hashUrl}
      codeHref={codeHref}
    />
  );

  /**
   * contains common details for agent, component & service
   * ie, description, version, metadata unpinned alert, owner address
   */
  const getCommonDetails = () => {
    const commonDetails = [];

    if (HASH_DETAILS_STATE.LOADED === metadataLoadState) {
      commonDetails.push(
        { title: 'Description', dataTestId: 'description', value: description },
        { title: 'Version', dataTestId: 'version', value: version },
      );
    }

    // If metadata failed, that means it has been unpinned from IPFS
    // and show an alert indicating the user
    if (HASH_DETAILS_STATE.FAILED === metadataLoadState) {
      commonDetails.push({
        dataTestId: 'metadata-failed-to-load',
        value: <MetadataUnpinnedMessage />,
      });
    }

    commonDetails.push({
      title: 'Owner Address',
      dataTestId: 'owner-address',
      value: ownerAddress,
    });

    return commonDetails;
  };

  const getComponentAndAgentValues = () => {
    const updateHashButton = isOwner ? (
      <>
        &nbsp;•&nbsp;
        {handleHashUpdate && (
          <Button type="primary" ghost onClick={openUpdateHashModal}>
            Update Hash
          </Button>
        )}
      </>
    ) : null;

    const getDependencyList = () => {
      if ((componentAndAgentDependencies || []).length === 0) return 'None';
      return componentAndAgentDependencies.map((e) => (
        <li key={`${type}-dependency-${e}`}>
          <Button type="link" onClick={() => navigateToDependency(e)}>
            {e}
          </Button>
        </li>
      ));
    };

    return [
      {
        dataTestId: 'hashes-list',
        value: (
          <>
            {viewHashAndCodeButtons}
            {updateHashButton}
          </>
        ),
      },
      ...getCommonDetails(),
      {
        title: 'Component Dependencies',
        dataTestId: 'details-dependency',
        value: getDependencyList(),
      },
    ];
  };

  /**
   * contains details for service
   * ie, service status, NFT Image, threshold, token address, operator whitelisting
   */
  const getServiceValues = () => {
    const serviceState = ['2', '3', '4'].includes(serviceCurrentState);
    const serviceDetailsList = [
      {
        dataTestId: 'hashes-list',
        value: (
          <>
            <ServiceStatus serviceState={serviceState} />
            {viewHashAndCodeButtons}
          </>
        ),
      },
    ];

    // show NFT image only if metadata is available,
    // also, NFT is not available for SVM
    if (HASH_DETAILS_STATE.LOADED === metadataLoadState && !isSvm) {
      serviceDetailsList.push({
        dataTestId: 'service-nft-image',
        value: <NftImage imageUrl={nftImageUrl} isSmallSize />,
      });
    }

    serviceDetailsList.push(...getCommonDetails(), {
      title: 'Threshold',
      value: serviceThreshold,
    });

    // token address is only available for L1 networks
    if (
      doesNetworkHaveValidServiceManagerToken
      && tokenAddress !== DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
      && !isSvm
    ) {
      serviceDetailsList.push({
        title: 'Token Address',
        value: tokenAddress || NA,
      });
    }

    // operator whitelisting is only available for L1 networks
    if (doesNetworkHaveValidServiceManagerToken && !isSvm) {
      serviceDetailsList.push({
        title: operatorWhitelistTitle,
        value: operatorWhitelistValue,
      });

      if (isOwner) {
        serviceDetailsList.push({
          title: 'Set operators statuses',
          value: operatorStatusValue,
        });
      }
    }

    return serviceDetailsList;
  };

  const details = type === NAV_TYPES.SERVICE
    ? getServiceValues()
    : getComponentAndAgentValues();

  return (
    <SectionContainer>
      {details.map(({ title, value, dataTestId }, index) => (
        <EachSection key={`${type}-details-${index}`}>
          {title && <SubTitle strong>{title}</SubTitle>}
          <Info data-testid={dataTestId || ''}>{value}</Info>
        </EachSection>
      ))}
    </SectionContainer>
  );
};

DetailsSubInfo.propTypes = {
  id: PropTypes.string,
  isOwner: PropTypes.bool,
  type: typePropType,
  tokenUri: PropTypes.string,
  ownerAddress: PropTypes.string,
  componentAndAgentDependencies: PropTypes.arrayOf(PropTypes.string),
  serviceThreshold: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  serviceCurrentState: PropTypes.string,
  handleHashUpdate: PropTypes.func,
  openUpdateHashModal: PropTypes.func,
  navigateToDependency: PropTypes.func,
};

DetailsSubInfo.defaultProps = {
  id: '',
  isOwner: false,
  type: null,
  tokenUri: '',
  ownerAddress: '',
  componentAndAgentDependencies: [],
  serviceThreshold: '',
  serviceCurrentState: '',
  handleHashUpdate: null,
  openUpdateHashModal: null,
  navigateToDependency: null,
};
