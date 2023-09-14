import { COLOR } from '@autonolas/frontend-library';

// TODO: remove
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
      headerBg: COLOR.WHITE,
      bodyBg: COLOR.WHITE,
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
