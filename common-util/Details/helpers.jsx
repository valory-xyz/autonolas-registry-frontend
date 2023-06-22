/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button, Typography, Alert, Switch,
} from 'antd/lib';
import { ArrowUpRight, Circle } from 'react-feather';
import get from 'lodash/get';
import {
  DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
  GATEWAY_URL,
  NA,
  NAV_TYPES,
} from 'util/constants';
import { isL1OnlyNetwork } from 'common-util/functions';
import { NftImage } from './NFTImage';
import { SetOperatorStatus, OperatorWhitelist } from './ServiceDetailsHelper';
import {
  getTokenDetailsRequest,
  setOperatorsCheckRequest,
  checkIfServiceRequiresWhiltelisting,
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
  const chainId = useSelector((state) => state?.setup?.chainId);

  const account = useSelector((state) => state?.setup?.account);
  const [tokenAddress, setTokenAddress] = useState(null);

  // switch state
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [switchValue, setSwitchValue] = useState(isWhiteListed);
  useEffect(() => {
    setSwitchValue(isWhiteListed);
  }, [isWhiteListed]);

  // get token address for service on load
  useEffect(() => {
    const getData = async () => {
      if (type === NAV_TYPES.SERVICE) {
        const response = await getTokenDetailsRequest(id);
        setTokenAddress(response.token);
      }
    };

    if (id && isL1OnlyNetwork(chainId)) getData();
  }, [id]);

  const updateHashBtn = isOwner ? (
    <>
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
        <ArrowUpRight size={16} />
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
        <ArrowUpRight size={16} />
      </Link>
    </>
  ) : null;

  // get operator whitelist
  const setOpWhitelist = async () => {
    if (isL1OnlyNetwork(chainId)) {
      const whiteListRes = await checkIfServiceRequiresWhiltelisting(id);
      setIsWhiteListed(whiteListRes);
    }
  };

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

    console.log({
      chainId,
      tokenAddress,
      isNotEq: tokenAddress !== DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS,
    });

    // show token address only if it is not ETH
    if (
      isL1OnlyNetwork(chainId)
      && tokenAddress !== DEFAULT_SERVICE_CREATION_ETH_TOKEN_ZEROS
    ) {
      serviceDetailsList.push({
        title: 'Token Address',
        value: tokenAddress || NA,
      });
    }

    // operator whitelisting is only available for service
    serviceDetailsList.push({
      title: (
        <>
          Operator Whitelisting&nbsp;
          <Switch
            disabled={!isOwner}
            checked={switchValue}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
            onChange={async (checked) => {
              setSwitchValue(checked);
              if (!checked) {
                await setOperatorsCheckRequest({
                  account,
                  serviceId: id,
                  isChecked: false,
                });
                await setOpWhitelist();
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
        value: <SetOperatorStatus id={id} />,
      });
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
