import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Button, Alert, Steps, Space, Divider, Table, Radio,
} from 'antd';
import { NAV_TYPES, SERVICE_STATE, SERVICE_STATE_INFO } from 'util/constants';
import Loader from 'common-util/components/Loader';
import Text from 'antd/lib/typography/Text';
import { RegisterMessage, getIpfsHashFromBytes32 } from '../List/ListCommon';
import IpfsHashGenerationModal from '../List/IpfsHashGenerationModal';
import { getTable } from './helpers';
import {
  Header,
  DetailsTitle,
  InfoSubHeader,
  Info,
  SectionContainer,
  EachSection,
} from './styles';

const { Step } = Steps;

const NA = 'NA';
const gt = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

const PreRegistrationContent = (
  <Space>
    <Button>Update</Button>
    <Button>Activate Registration</Button>
  </Space>
);

const getActiveRegistrationContent = () => {
  const dataSource = [
    {
      key: '1',
      agentId: '1',
      availableSlots: 3,
      totalSlots: 10,
      agentAddresses: 'n/a',
    },
    {
      key: '2',
      agentId: '4',
      availableSlots: 0,
      totalSlots: 10,
      agentAddresses: 'n/a',
    },
  ];

  const columns = [
    {
      title: 'Agent ID',
      dataIndex: 'agentId',
      key: 'agentId',
    },
    {
      title: 'Available Slots',
      dataIndex: 'availableSlots',
      key: 'availableSlots',
    },
    {
      title: 'Total Slots',
      dataIndex: 'totalSlots',
      key: 'totalSlots',
    },
    {
      title: 'Agent Addresses',
      dataIndex: 'agentAddresses',
      key: 'agentAddresses',
    },
  ];

  return (
    <Space direction="vertical">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <Button>Register Agents</Button>
      <Divider />
      <Button>Terminate</Button>
    </Space>
  );
};

const getFinishedRegistrationContent = () => {
  const multisigAddresses = [
    '0x7651239879182341321', '0x7651239879182341322', '0x7651239879182341323',
  ];

  return (
    <>
      <Space direction="vertical" size={1}>
        <Text>Choose multi-sig implementation:</Text>
        <Radio.Group>
          <Space direction="vertical">
            {
              multisigAddresses.map(
                (multisigAddress) => <Radio value={multisigAddress}>{multisigAddress}</Radio>,
              )
            }
          </Space>
        </Radio.Group>
        <Button>Deploy</Button>
        <Divider />
        <Button>Terminate</Button>
      </Space>
    </>
  );
};

const DeployedContent = (
  <Button>Terminate</Button>
);

const TerminatedBondedContent = (
  <Button>Unbond</Button>
);

const SERVICE_STATES = [
  {
    title: 'Pre-Registration',
    content: PreRegistrationContent,
  },
  {
    title: 'Active Registration',
    content: getActiveRegistrationContent(),
  },
  {
    title: 'Finished Registration',
    content: getFinishedRegistrationContent(),
  },
  {
    title: 'Deployed',
    content: DeployedContent,
  },
  {
    title: 'Terminated Bonded',
    content: TerminatedBondedContent,
  },
];

const Details = ({
  account,
  id,
  type,
  getDetails,
  getStatus,
  getHashes,
  handleUpdate,
  getOwner,
  onUpdateHash,
  onDependencyClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [status, setStatus] = useState(null);
  const [hashes, setHashes] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailsOwner, setDetailsOwner] = useState(false);
  const ownerOfCurrentDetails = get(info, 'owner', null);

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

  useEffect(async () => {
    setIsLoading(true);
    setInfo([]);

    try {
      const temp = await getDetails();
      setInfo(temp);

      const ownerAccount = await getOwner();
      setDetailsOwner(ownerAccount);

      await getUpdatedHashes();

      if (getStatus) {
        const statusInfo = await getStatus();
        setStatus(statusInfo);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [account, id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!account) {
    return (
      <>
        <Header>
          <DetailsTitle level={2}>{`${capitalize(type)}`}</DetailsTitle>
        </Header>
        <RegisterMessage />
      </>
    );
  }

  const onUpdate = () => {
    if (handleUpdate) handleUpdate();
  };

  const onCancel = async () => {
    await getUpdatedHashes();
    setIsModalVisible(false);
  };

  const generateDetails = () => {
    const getComponentAndAgentValues = () => {
      const dependencies = get(info, 'dependencies') || [];
      const isAgent = type === NAV_TYPES.AGENT;
      const hash = get(hashes, `${isAgent ? 'agent' : 'component'}Hashes`) || [];

      return [
        { title: 'Owner Address', value: ownerOfCurrentDetails || NA },
        {
          title: 'Developer Address',
          value: get(info, 'developer', null) || NA,
        },
        {
          title: 'Hash',
          dataTestId: 'hashes-list',
          value: (
            <>
              {hash.map((e, index) => (
                <li key={`${type}-hashes-${index}`}>
                  {getIpfsHashFromBytes32(e.hash)}
                </li>
              ))}
            </>
          ),
        },
        {
          title: 'Component Dependencies',
          dataTestId: 'details-dependency',
          value:
            dependencies.length === 0 ? (
              <>NA</>
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
      const hash = get(hashes, 'configHashes') || [];

      return [
        { title: 'Name', value: get(info, 'name', null) || NA },
        { title: 'Owner Address', value: ownerOfCurrentDetails || NA },
        {
          title: 'Developer Address',
          value: get(info, 'developer', null) || NA,
        },
        {
          title: 'Hash',
          dataTestId: 'hashes-list',
          value: (
            <>
              {hash.map((e, index) => (
                <li key={`${type}-hashes-${index}`}>
                  {getIpfsHashFromBytes32(e.hash)}
                </li>
              ))}
            </>
          ),
        },
        {
          title: 'Active',
          value: get(info, 'active', null) ? 'TRUE' : 'FALSE',
        },
        {
          type: 'table',
          dataTestId: 'agent-id-table',
          value: getTable(info, { onDependencyClick }),
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
            <InfoSubHeader>{title}</InfoSubHeader>
            <Info data-testid={dataTestId || ''}>{value}</Info>
          </EachSection>
        ))}
      </SectionContainer>
    );
  };

  return (
    <>
      <Header>
        <DetailsTitle level={2}>{`${capitalize(type)} ID ${id}`}</DetailsTitle>
        <div className="right-content">
          <Button
            disabled={!handleUpdate}
            type="primary"
            ghost
            onClick={onUpdate}
          >
            Update
          </Button>

          {/* This button will be shown only if the agent belongs
          to the owner and has `onUpdateHash` function */}
          {onUpdateHash && detailsOwner === ownerOfCurrentDetails && (
            <Button
              type="primary"
              ghost
              onClick={() => setIsModalVisible(true)}
            >
              Update Hash
            </Button>
          )}
        </div>
      </Header>

      <Row gutter={gt}>
        <Col className="gutter-row" span={12}>
          <InfoSubHeader>Description</InfoSubHeader>
          <div>{get(info, 'description', null) || NA}</div>

          {/* {status && (
            <>
              <br />
              <InfoSubHeader>Status</InfoSubHeader>
              <div className="mb-12">{SERVICE_STATE[status]}</div>
              <Alert
                message={SERVICE_STATE_INFO[status]}
                type="info"
                showIcon
              />
            </>
          )} */}

          <Divider />

          <InfoSubHeader>State</InfoSubHeader>
          <Steps direction="vertical">
            {
              SERVICE_STATES.map(
                (state) => (
                  <Step title={state.title} description={state.content} />
                ),
              )
            }
          </Steps>

        </Col>
        <Col className="gutter-row" span={12}>
          {generateDetails()}
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
  getStatus: PropTypes.func,
  getHashes: PropTypes.func,
  getOwner: PropTypes.func,
  handleUpdate: PropTypes.func,
  onUpdateHash: PropTypes.func,
  onDependencyClick: PropTypes.func,
};

Details.defaultProps = {
  account: null,
  handleUpdate: null,
  getStatus: null,
  getHashes: () => {},
  getOwner: () => {},
  onUpdateHash: () => {},
  onDependencyClick: () => {},
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(Details);
