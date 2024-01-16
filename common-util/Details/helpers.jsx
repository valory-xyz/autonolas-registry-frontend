/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react';
import {
  Button, Typography, Alert, Switch,
} from 'antd';
import { NA } from '@autonolas/frontend-library';

import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
  NAV_TYPES,
} from 'util/constants';
import { Circle } from 'common-util/svg/Circle';
import { useHelpers } from 'common-util/hooks';
import { HASH_DETAILS_STATE } from './constants';
import { NftImage } from './NFTImage';
import {
  SetOperatorStatus,
  OperatorWhitelist,
} from './ServiceDetails/ServiceDetailsHelper';
import {
  getTokenDetailsRequest,
  setOperatorsCheckRequest,
  checkIfServiceRequiresWhitelisting,
} from './ServiceState/utils';
import {
  SubTitle,
  Info,
  SectionContainer,
  EachSection,
  ServiceStatusContainer,
  ArrowLink,
} from './styles';

const { Link, Text } = Typography;

const ServiceStatus = ({ serviceState }) => (
  <ServiceStatusContainer
    className={serviceState ? 'active' : 'inactive'}
    data-testid="service-status"
  >
    <Circle size={8} />
    <Text>{serviceState ? 'Active' : 'Inactive'}</Text>
  </ServiceStatusContainer>
);

const MetadataUnpinnedMessage = () => (
  <Alert
    message="Metadata is unpinned from IPFS server"
    type="warning"
    showIcon
  />
);

/**
 * Agent/Component/Service details component
 */
export const DetailsInfo = ({
  id,
  isOwner,
  type,

  // metadata details 👇
  hashUrl,
  metadataLoadState,
  codeHref,
  nftImageUrl,
  description,
  version,

  // other details 👇
  ownerAddress,
  componentAndAgentDependencies,
  serviceThreshold,
  serviceCurrentState,

  onUpdateHash,
  setIsModalVisible,
  onDependencyClick,
}) => {
  const { account, doesNetworkHaveValidServiceManagerToken } = useHelpers();
  const [tokenAddress, setTokenAddress] = useState(null);

  // switch state
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [switchValue, setSwitchValue] = useState(isWhiteListed);
  useEffect(() => {
    setSwitchValue(isWhiteListed);
  }, [isWhiteListed]);
  const [isWhiteListingLoading, setIsWhiteListingLoading] = useState(false);

  // get operator whitelist
  const setOpWhitelist = useCallback(async () => {
    try {
      const whiteListRes = await checkIfServiceRequiresWhitelisting(id);
      setIsWhiteListed(whiteListRes);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  // get token address for service on load
  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      if (type === NAV_TYPES.SERVICE) {
        try {
          const response = await getTokenDetailsRequest(id);
          if (isMounted) {
            setTokenAddress(response.token);
          }

          await setOpWhitelist(id);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (id && doesNetworkHaveValidServiceManagerToken) {
      getData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, doesNetworkHaveValidServiceManagerToken]);

  const getViewHashAndCode = useCallback(() => {
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
  }, [metadataLoadState, type, hashUrl, codeHref]);

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
    const updateHashBtn = isOwner ? (
      <>
        &nbsp;•&nbsp;
        {onUpdateHash && (
          <Button type="primary" ghost onClick={() => setIsModalVisible(true)}>
            Update Hash
          </Button>
        )}
      </>
    ) : null;

    return [
      {
        dataTestId: 'hashes-list',
        value: (
          <>
            {getViewHashAndCode()}
            {updateHashBtn}
          </>
        ),
      },
      ...getCommonDetails(),
      {
        title: 'Component Dependencies',
        dataTestId: 'details-dependency',
        value:
          componentAndAgentDependencies?.length === 0 ? (
            <>None</>
          ) : (
            componentAndAgentDependencies.map((e) => (
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
    const serviceState = ['2', '3', '4'].includes(serviceCurrentState);
    const serviceDetailsList = [
      {
        dataTestId: 'hashes-list',
        value: (
          <>
            <ServiceStatus serviceState={serviceState} />
            {getViewHashAndCode()}
          </>
        ),
      },
    ];

    // show NFT image only if metadata is available
    if (HASH_DETAILS_STATE.LOADED === metadataLoadState) {
      serviceDetailsList.push({
        dataTestId: 'service-nft-image',
        value: (
          <NftImage imageUrl={nftImageUrl} isSmallSize={NAV_TYPES.SERVICE} />
        ),
      });
    }

    serviceDetailsList.push(...getCommonDetails(), {
      title: 'Threshold',
      value: serviceThreshold,
    });

    // show token address only if it is not ETH
    if (
      doesNetworkHaveValidServiceManagerToken
      && tokenAddress !== DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
    ) {
      serviceDetailsList.push({
        title: 'Token Address',
        value: tokenAddress || NA,
      });
    }

    // operator whitelisting is only available for service & L1 networks
    if (doesNetworkHaveValidServiceManagerToken) {
      serviceDetailsList.push({
        title: (
          <>
            Operator Whitelisting&nbsp;
            <Switch
              disabled={!isOwner}
              checked={switchValue}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
              loading={isWhiteListingLoading}
              onChange={async (checked) => {
                try {
                  setIsWhiteListingLoading(true);
                  await setOperatorsCheckRequest({
                    account,
                    serviceId: id,
                    isChecked: checked,
                  });
                  setSwitchValue(checked);
                  await setOpWhitelist();
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsWhiteListingLoading(false);
                }
              }}
            />
          </>
        ),
        value: (
          <OperatorWhitelist
            id={id}
            setOpWhitelist={setOpWhitelist}
            isWhiteListed={isWhiteListed}
          />
        ),
      });

      if (isOwner) {
        serviceDetailsList.push({
          title: 'Set operators statuses',
          value: <SetOperatorStatus id={id} setOpWhitelist={setOpWhitelist} />,
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
