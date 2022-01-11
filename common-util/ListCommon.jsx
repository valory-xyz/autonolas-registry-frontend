import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button, Alert } from 'antd';
import { EmptyMessage } from 'components/styles';

// ----------- functions -----------
/**
 *
 * @param {String}
 * @returns {Array}
 */
export const getMappedArrayFromString = (str) => str.split(',').map((e) => e.trim());

// ----------- components -----------
export const ListEmptyMessage = ({ type }) => {
  const router = useRouter();

  const getValues = () => {
    switch (type) {
      case 'component':
        return {
          text: 'component',
          route: '/components/1',
        };
      case 'service':
        return {
          text: 'service',
          route: '/services/1',
        };
      case 'operator':
        return {
          text: 'operator',
          route: '/operators/1',
        };
      case 'agent':
        return {
          text: 'agent',
          route: '/agents/1',
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
      <p>{`No ${currentType.text}s registered,`}</p>
      <p>
        <Button type="link" onClick={() => router.push(currentType.route)}>
          Click here
        </Button>
        &nbsp;
        {`to see dummy ${currentType.text}.`}
      </p>
    </EmptyMessage>
  );
};

ListEmptyMessage.propTypes = {
  type: PropTypes.string,
};

ListEmptyMessage.defaultProps = {
  type: null,
};

// AlertInfo
export const AlertInfo = ({ type, information }) => {
  if (!information) return null;
  return (
    <Alert
      message={`${type || 'Registered'} successfully!`}
      description={(
        <div>
          <pre>{JSON.stringify(information, null, 2)}</pre>
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
        <div>
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

//
export const PrintJson = ({ value }) => <pre>{JSON.stringify(value || {}, null, 2)}</pre>;
PrintJson.propTypes = {
  value: PropTypes.shape({}).isRequired,
};
