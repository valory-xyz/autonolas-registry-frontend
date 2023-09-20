/* eslint-disable react/prop-types */
import { memo, useEffect, useState } from 'react';
import {
  Button, Typography, Alert, Switch,
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { NA } from '@autonolas/frontend-library';

import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
  GATEWAY_URL,
  NAV_TYPES,
} from 'util/constants';
import { Circle } from 'common-util/svg/Circle';
import { useHelpers } from 'common-util/hooks';
import { NftImage } from './NFTImage';
import { SetOperatorStatus, OperatorWhitelist } from './ServiceDetailsHelper';
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
  ServiceStatus,
} from './styles';

const { Link, Text } = Typography;

const pattern = /https:\/\/localhost\/(agent|component|service)\/+/g;

export const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

export const HASH_DETAILS_STATE = {
  IS_LOADING: 'IS_LOADING',
  LOADED: 'LOADED',
  FAILED: 'FAILED',
};

const ArrowLink = memo(() => (
  <ArrowRightOutlined
    style={{
      width: 14,
      transform: 'rotate(320deg)',
      position: 'relative',
      top: '-4px',
    }}
  />
));

export const DetailsInfo = ({
  id,
  isOwner,
  type,
  tokenUri,
  info,
  metadata,
  metadataState,
  detailsOwner,
  onUpdateHash,
  setIsModalVisible,
  onDependencyClick,
}) => {
  const { account, isL1Network, isL1OnlyNetwork } = useHelpers();
  const [tokenAddress, setTokenAddress] = useState(null);

  // switch state
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [switchValue, setSwitchValue] = useState(isWhiteListed);
  useEffect(() => {
    setSwitchValue(isWhiteListed);
  }, [isWhiteListed]);
  const [isWhiteListingLoading, setIsWhiteListingLoading] = useState(false);

  // get operator whitelist
  const setOpWhitelist = async () => {
    try {
      const whiteListRes = await checkIfServiceRequiresWhitelisting(id);
      setIsWhiteListed(whiteListRes);
    } catch (error) {
      console.error(error);
    }
  };

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

    if (id && isL1OnlyNetwork) getData();

    return () => {
      isMounted = false;
    };
  }, [id, isL1OnlyNetwork]);

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

  const viewHashAndCode = HASH_DETAILS_STATE.LOADED === metadataState ? (
    <>
      {type === NAV_TYPES.SERVICE && <>&nbsp;•&nbsp;</>}
      <Link
        target="_blank"
        data-testid="view-hash-link"
        href={getAutonolasTokenUri(tokenUri)}
      >
        View Hash&nbsp;
        <ArrowLink />
      </Link>
        &nbsp;•&nbsp;
      <Link
        target="_blank"
        data-testid="view-code-link"
        href={(get(metadata, 'code_uri') || '').replace(
          'ipfs://',
          GATEWAY_URL,
        )}
      >
        View Code&nbsp;
        <ArrowLink />
      </Link>
    </>
  ) : null;

  const getCommonDetails = () => {
    const commonDetails = [];

    if (HASH_DETAILS_STATE.LOADED === metadataState) {
      commonDetails.push(
        {
          title: 'Description',
          dataTestId: 'description',
          value: get(metadata, 'description') || NA,
        },
        {
          title: 'Version',
          dataTestId: 'version',
          value: get(metadata, 'attributes[0].value') || NA,
        },
      );
    }

    // If metadata failed, that means it has been unpinned from IPFS
    // and show an alert indicating the user
    if (HASH_DETAILS_STATE.FAILED === metadataState) {
      commonDetails.push({
        dataTestId: 'metadata-failed-to-load',
        value: (
          <Alert
            message="Metadata is unpinned from IPFS server"
            type="warning"
            showIcon
          />
        ),
      });
    }

    commonDetails.push({
      title: 'Owner Address',
      dataTestId: 'owner-address',
      value: detailsOwner || NA,
    });

    return commonDetails;
  };

  const getComponentAndAgentValues = () => {
    const dependencies = get(info, 'dependencies') || [];
    return [
      {
        dataTestId: 'hashes-list',
        value: (
          <>
            {viewHashAndCode}
            {updateHashBtn}
          </>
        ),
      },
      ...getCommonDetails(),
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
    ];
  };

  const getServiceValues = () => {
    const serviceState = ['2', '3', '4'].includes(get(info, 'state'));

    const serviceDetailsList = [
      {
        dataTestId: 'hashes-list',
        value: (
          <>
            <ServiceStatus
              className={serviceState ? 'active' : 'inactive'}
              data-testid="service-status"
            >
              <Circle size={8} />
              <Text>{serviceState ? 'Active' : 'Inactive'}</Text>
            </ServiceStatus>
            {viewHashAndCode}
          </>
        ),
      },
    ];

    // show NFT image only if metadata is available
    if (HASH_DETAILS_STATE.LOADED === metadataState) {
      serviceDetailsList.push({
        dataTestId: 'service-nft-image',
        value: <NftImage metadata={metadata} type={type} />,
      });
    }

    serviceDetailsList.push(...getCommonDetails(), {
      title: 'Threshold',
      value: get(info, 'threshold', null) || NA,
    });

    // show token address only if it is not ETH
    if (
      isL1Network
      && tokenAddress !== DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
    ) {
      serviceDetailsList.push({
        title: 'Token Address',
        value: tokenAddress || NA,
      });
    }

    // operator whitelisting is only available for service & L1 networks
    if (isL1OnlyNetwork) {
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
