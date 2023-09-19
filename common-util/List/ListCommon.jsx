import PropTypes from 'prop-types';
import Link from 'next/link';
import { Alert, Button } from 'antd';
import bs58 from 'bs58';
import { ExportOutlined } from '@ant-design/icons';
import { isL1Network } from 'common-util/functions';
import { EmptyMessage, RegisterFooter } from 'components/styles';
import { useHelpers } from 'common-util/hooks';

// constants
export const DEPENDENCY_IN_ASC = 'Agent IDs must be input in the order they were created (oldest first & newest last)';

// ----------- functions -----------
/**
 *
 * @param {String}
 * @returns {Array}
 */
export const convertStringToArray = (str) => (str ? str.split(',').map((e) => e.trim()) : str);

// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"
export const getIpfsHashFromBytes32 = (bytes32Hex) => {
  if (!bytes32Hex) return null;

  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = `1220${bytes32Hex.slice(2)}`;
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes);
  return hashStr;
};

// ----------- components -----------
export const MyLink = ({ children, href, ...linkProps }) => (
  <Link {...linkProps} href={href}>
    {children}
  </Link>
);
MyLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export const commaMessage = 'Each comma must be followed by a space ("1, 2" not "1,2").';

export const DependencyLabel = ({ type }) => {
  const { chainId } = useHelpers();
  const dependencyHelperText = `Must be in ascending order – newest ${
    type === 'service' ? 'agents' : 'components'
  } last, oldest first. ${commaMessage}`;

  return (
    <div className="label-helper-text">
      {type === 'service' ? (
        <>
          {!isL1Network(chainId) && (
            <>
              (Make sure your agent ID is already registered in the Agent
              Registry on ethereum)
              <br />
            </>
          )}
          Comma-separated list of agent IDs which this service requires. Find
          IDs on&nbsp;
          <MyLink href="/agents">
            Agents
            <ExportOutlined style={{ width: 14 }} />
          </MyLink>
          &nbsp;page.&nbsp;
          {dependencyHelperText}
        </>
      ) : (
        <>
          {`Comma-separated list of component IDs which this ${type} requires. Find IDs on`}
          &nbsp;
          <MyLink href="/components">
            Components
            <ExportOutlined style={{ width: 14 }} />
          </MyLink>
          &nbsp;page.&nbsp;
          {dependencyHelperText}
        </>
      )}
    </div>
  );
};
DependencyLabel.propTypes = {
  type: PropTypes.string,
};
DependencyLabel.defaultProps = { type: 'component' };

export const RegisterMessage = ({ handleCancel }) => (
  <RegisterFooter>
    <p>To mint, connect to wallet</p>
    {handleCancel && (
      <Button type="default" onClick={handleCancel}>
        Cancel
      </Button>
    )}
  </RegisterFooter>
);
RegisterMessage.propTypes = { handleCancel: PropTypes.func };
RegisterMessage.defaultProps = { handleCancel: null };

export const ListEmptyMessage = ({ type }) => {
  const getValues = () => {
    switch (type) {
      case 'component':
        return {
          text: 'component',
        };
      case 'service':
        return {
          text: 'service',
        };
      case 'operator':
        return {
          text: 'operator',
        };
      case 'agent':
        return {
          text: 'agent',
        };
      default:
        return null;
    }
  };

  const currentType = getValues();

  if (!currentType) {
    return <EmptyMessage>Please check type!</EmptyMessage>;
  }

  return (
    <EmptyMessage data-testid="not-registered-message">
      <div className="empty-message-logo" />
      <p>{`No ${currentType.text}s registered`}</p>
    </EmptyMessage>
  );
};
ListEmptyMessage.propTypes = { type: PropTypes.string };
ListEmptyMessage.defaultProps = { type: null };

// PrintJson
export const PrintJson = ({ value }) => (
  <pre>{JSON.stringify(value || {}, null, 2)}</pre>
);
PrintJson.propTypes = { value: PropTypes.shape({}).isRequired };

// AlertSuccess
export const AlertSuccess = ({ type, information }) => {
  if (!information) return null;
  return (
    <Alert
      message={type ? `${type} minted` : 'Minted successfully'}
      type="success"
      data-testid="alert-info-container"
      showIcon
    />
  );
};
AlertSuccess.propTypes = {
  information: PropTypes.shape({}),
  type: PropTypes.string,
};
AlertSuccess.defaultProps = {
  information: null,
  type: null,
};

// AlertError
export const AlertError = ({ error }) => {
  if (!error) return null;
  return (
    <Alert
      message={error.message}
      data-testid="alert-error-container"
      type="error"
      showIcon
    />
  );
};
AlertError.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
};
AlertError.defaultProps = { error: null };
