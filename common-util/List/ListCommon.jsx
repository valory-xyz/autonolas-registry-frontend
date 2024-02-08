import PropTypes from 'prop-types';
import Link from 'next/link';
import { Alert, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import { EmptyMessage, RegisterFooter } from 'components/styles';
import { useHelpers } from 'common-util/hooks';

// ----------- functions -----------
/**
 *
 * @param {String}
 * @returns {Array}
 */
export const convertStringToArray = (str) => (str ? str.split(',').map((e) => e.trim()) : str);

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
  const { isL1Network, isSvm } = useHelpers();
  const dependencyHelperText = `Must be in ascending order – newest ${
    type === 'service' ? 'agents' : 'components'
  } last, oldest first. ${commaMessage}`;

  return (
    <div className="label-helper-text">
      {type === 'service' ? (
        <>
          {!isL1Network && (
            <>
              (Make sure your agent ID is already registered in the Agent
              Registry on&nbsp;
              {isSvm ? 'Solana' : 'Ethereum'}
              )
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

export const ListEmptyMessage = ({ message = '', type }) => {
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
      <p>{message || `No ${currentType.text}s registered`}</p>
    </EmptyMessage>
  );
};
ListEmptyMessage.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
};
ListEmptyMessage.defaultProps = { type: null, message: '' };

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
