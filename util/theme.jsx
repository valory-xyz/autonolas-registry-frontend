export const COLOR = {
  PRIMARY: '#7A00F4',
  GREY_1: '#C4C4C4',
  GREY_2: '#9A9A9A',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  BORDER_GREY: '#E3E3E3',
  TABLE_BLACK: '#1B1B1B',
  PURPLE: '#7A00F4',
  RED_1: '#EA3324',
  GREEN: '#52C41A',
};

export const BOX_SHADOW = {};

export const FONT_SIZE = {
  30: '30px',
  28: '28px',
  26: '26px',
  24: '24px',
  22: '22px',
  20: '20px',
  18: '18px',
  16: '16px',
};

export const BREAK_POINT = {
  xxs: '375px',
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

export const TRANSITION = {
  all: 'all 0.3s',
};

export const OTHERS = {
  borderRadius: '5px',
};

export const MEDIA_QUERY = {
  mobileS: `@media only screen and (max-width: ${BREAK_POINT.xxs})`,
  mobileM: `@media only screen and (max-width: ${BREAK_POINT.xs})`,
  mobileL: `@media only screen and (max-width: ${BREAK_POINT.sm})`,
  tablet: `@media only screen and (max-width: ${BREAK_POINT.md})`,
  tabletL: `@media only screen and (max-width: ${BREAK_POINT.lg})`,
  laptop: `@media only screen and (max-width: ${BREAK_POINT.xl})`,
  desktop: `@media only screen and (max-width: ${BREAK_POINT.xxl})`,
};
