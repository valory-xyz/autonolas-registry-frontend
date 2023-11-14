import { COLOR } from '@autonolas/frontend-library';
import { Button, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { EXTRA_COLORS } from 'util/constants';

export const YellowButton = ({ children, ...props }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: EXTRA_COLORS.YELLOW_PRIMARY,
        colorBgBase: EXTRA_COLORS.YELLOW_SECONDARY,
        colorTextBase: EXTRA_COLORS.YELLOW_PRIMARY,
        defaultBorderColor: COLOR.ORANGE,
      },
    }}
  >
    <Button {...props}>{children}</Button>
  </ConfigProvider>
);

YellowButton.propTypes = {
  children: PropTypes.node.isRequired,
};
