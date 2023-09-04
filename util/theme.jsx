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

export const TRANSITION = {
  all: 'all 0.3s',
};

export const OTHERS = {
  borderRadius: '5px',
};

/**
 * @type {import('antd').ThemeConfig}
 */
export const themeConfig = {
  token: {
    colorPrimary: COLOR.PRIMARY,
    fontSize: 18,
    borderRadius: 5,
    colorBgBase: COLOR.WHITE,
    colorTextPlaceholder: COLOR.GREY_2,
    colorLink: COLOR.PRIMARY,
    controlHeight: 42,
  },
  components: {
    Layout: {
      colorBgHeader: COLOR.WHITE,
      colorBgBody: COLOR.WHITE,
    },
    Tabs: {
      motionDurationMid: '0.1s',
      motionDurationSlow: '0.1s',
    },
    Pagination: {
      itemSize: 30,
    },
    Table: {
      padding: 12,
      fontWeightStrong: 500,
    },
  },
};
