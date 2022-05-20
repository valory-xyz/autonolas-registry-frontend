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

/**
 * @returns WhiteButton component
 */
const greyBtnStyle = {
  color: COLOR.GREY_1,
  borderColor: COLOR.GREY_1,
  backgroundColor: COLOR.BLACK,
};

export const GreyButton = ({ children, ...rest }) => (
  <Button {...rest} style={greyBtnStyle}>
    {children}
  </Button>
);

GreyButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

GreyButton.defaultProps = {
  children: null,
};
