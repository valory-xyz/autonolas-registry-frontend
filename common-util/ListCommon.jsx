import PropTypes from 'prop-types';
import { Alert } from 'antd';
import { EmptyMessage } from 'components/styles';

// ----------- functions -----------
/**
 *
 * @param {String}
 * @returns {Array}
 */
export const getMappedArrayFromString = (str) => (str ? str.split(',').map((e) => e.trim()) : str);

// ----------- components -----------
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
    <EmptyMessage>
      <p>{`No ${currentType.text}s registered.`}</p>
    </EmptyMessage>
  );
};

ListEmptyMessage.propTypes = {
  type: PropTypes.string,
};

ListEmptyMessage.defaultProps = {
  type: null,
};

// PrintJson
export const PrintJson = ({ value }) => (
  <pre>{JSON.stringify(value || {}, null, 2)}</pre>
);
PrintJson.propTypes = {
  value: PropTypes.shape({}).isRequired,
};

// AlertInfo
export const AlertInfo = ({ type, information }) => {
  if (!information) return null;
  return (
    <Alert
      message={`${type || 'Registered'} successfully!`}
      description={(
        <div data-testid="alert-info-container">
          <PrintJson value={information} />
        </div>
      )}
      type="info"
      showIcon
    />
  );
};
AlertInfo.propTypes = {
  information: PropTypes.shape({}),
  type: PropTypes.string,
};
AlertInfo.defaultProps = {
  information: null,
  type: null,
};

// AlertError
export const AlertError = ({ error }) => {
  if (!error) return null;
  return (
    <Alert
      message="Error on Register!"
      description={(
        <div data-testid="alert-error-container">
          <pre>{error.stack}</pre>
        </div>
      )}
      type="error"
      showIcon
    />
  );
};
AlertError.propTypes = {
  error: PropTypes.shape({
    stack: PropTypes.string,
  }),
};
AlertError.defaultProps = {
  error: null,
};
