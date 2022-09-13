/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Typography } from 'antd/lib';
import get from 'lodash/get';
import { ArrowUpRight, Circle } from 'react-feather';
import { GATEWAY_URL, NA, NAV_TYPES } from 'util/constants';
import { convertToEth } from '../functions';
import { getServiceTableDataSource } from './ServiceState/utils';
import {
  SubTitle,
  Info,
  SectionContainer,
  EachSection,
  ServiceStatus,
} from './styles';

const { Link, Text } = Typography;

export const COLUMNS = [
  {
    title: 'Agent ID',
    dataIndex: 'agentId',
    key: 'agentId',
  },
  {
    title: 'Slots',
    dataIndex: 'agentNumSlots',
    key: 'agentNumSlots',
  },
  {
    title: 'Security Bond',
    dataIndex: 'bonds',
    key: 'bonds',
  },
];

/**
 * helper function to generate table
 */
export const ServiceMiniTable = ({ id, agentIds, onDependencyClick }) => {
  const [source, setSource] = useState([]);

  useEffect(async () => {
    if (id && (agentIds || []).length !== 0) {
      const temp = await getServiceTableDataSource(id, agentIds || []);
      setSource(temp);
    }
  }, [id, agentIds]);

  const data = source.map(({ agentId, bond, availableSlots }, index) => ({
    id: `table-row-${index}`,
    agentId: (
      <Button type="link" onClick={() => onDependencyClick(agentId)}>
        {agentId}
      </Button>
    ),
    agentNumSlots: availableSlots,
    bonds: convertToEth(bond),
  }));

  return (
    <Table
      dataSource={data}
      columns={COLUMNS}
      pagination={false}
      rowKey={(record) => record.id}
    />
  );
};

ServiceMiniTable.propTypes = {
  id: PropTypes.string.isRequired,
  agentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDependencyClick: PropTypes.func.isRequired,
};

const pattern = /https:\/\/localhost\/(agent|component|service)\/+/g;

export const getAutonolasTokenUri = (tokenUri) => (tokenUri || '').replace(pattern, GATEWAY_URL);

export const DetailsInfo = ({
  isOwner,
  type,
  id,
  tokenUri,
  info,
  hashDetails,
  detailsOwner,
  onUpdateHash,
  setIsModalVisible,
  onDependencyClick,
}) => {
  const updateHashBtn = isOwner ? (
    <>
      {onUpdateHash && (
        <Button type="primary" ghost onClick={() => setIsModalVisible(true)}>
          Update Hash
        </Button>
      )}
    </>
  ) : null;

  const viewHashAndCode = (
    <>
      <Link href={getAutonolasTokenUri(tokenUri)} target="_blank">
        View Hash&nbsp;
        <ArrowUpRight size={16} />
      </Link>
      &nbsp;•&nbsp;
      <Link
        target="_blank"
        href={(get(hashDetails, 'code_uri') || '').replace(
          'ipfs://',
          GATEWAY_URL,
        )}
      >
        View Code&nbsp;
        <ArrowUpRight size={16} />
      </Link>
    </>
  );

  const commonDetails = [
    {
      title: 'Description',
      dataTestId: 'description',
      value: get(hashDetails, 'description') || NA,
    },
    {
      title: 'Version',
      dataTestId: 'version',
      value: get(hashDetails, 'attributes[0].value') || NA,
    },
    {
      title: 'Owner Address',
      dataTestId: 'owner-address',
      value: detailsOwner || NA,
    },
  ];

  const getComponentAndAgentValues = () => {
    const dependencies = get(info, 'dependencies') || [];
    return [
      {
        title: 'Hash',
        dataTestId: 'hashes-list',
        value: (
          <>
            {viewHashAndCode}
            {updateHashBtn}
          </>
        ),
      },
      ...commonDetails,
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
    const agentIds = get(info, 'agentIds');

    return [
      {
        title: 'Hash',
        dataTestId: 'hashes-list',
        value: (
          <>
            {serviceState ? (
              <ServiceStatus className="active">
                <Circle size={8} />
                <Text>Active</Text>
              </ServiceStatus>
            ) : (
              <ServiceStatus className="inactive">
                <Circle size={8} />
                <Text>Inactive</Text>
              </ServiceStatus>
            )}
            &nbsp;•&nbsp;
            {viewHashAndCode}

            {updateHashBtn && (
              <>
                <br />
                {updateHashBtn}
              </>
            )}
          </>
        ),
      },
      ...commonDetails,
      {
        type: 'table',
        dataTestId: 'agent-id-table',
        value: (
          <ServiceMiniTable
            id={id}
            agentIds={agentIds}
            onDependencyClick={onDependencyClick}
          />
        ),
      },
      { title: 'Threshold', value: get(info, 'threshold', null) || NA },
    ];
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
