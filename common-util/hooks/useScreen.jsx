import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export const useScreen = () => {
  const screens = useBreakpoint();
  const isMobile = (screens.sm || screens.xs)
    && !screens.md
    && !screens.lg
    && !screens.xl
    && !screens.xxl;

  const isTablet = (screens.md || screens.lg)
    && !screens.xs
    && !screens.sm
    && !screens.xl
    && !screens.xxl;

  return { isMobile, isTablet, ...screens };
};
