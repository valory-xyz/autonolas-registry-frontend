import { Button } from 'antd/lib';
import PropTypes from 'prop-types';
import { COLOR } from 'util/theme';

export const X = null;

/**
 * @returns WhiteButton component
 */
const whiteBtnStyle = {
  color: COLOR.BLACK,
  borderColor: COLOR.GREY_2,
  backgroundColor: COLOR.WHITE,
};
export const WhiteButton = ({ children, ...rest }) => (
  <Button {...rest} style={whiteBtnStyle}>
    {children}
  </Button>
);

WhiteButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

WhiteButton.defaultProps = {
  children: null,
};
