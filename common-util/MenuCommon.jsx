import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { EmptyMessage } from 'components/styles';

export const MenuEmptyMessage = ({ type }) => {
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

MenuEmptyMessage.propTypes = {
  type: PropTypes.string,
};

MenuEmptyMessage.defaultProps = {
  type: null,
};

export const ABC = null;
