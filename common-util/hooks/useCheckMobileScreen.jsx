import { useState, useEffect } from 'react';

const useCheckMobileScreen = () => {
  const [width, setWidth] = useState(null);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (width === null) {
      setWidth(window.innerWidth);
    }
  }, [width]);

  return width <= 768 && width > 0;
};

export default useCheckMobileScreen;
