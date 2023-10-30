import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Menu } from 'antd';

import { useHelpers } from 'common-util/hooks';

const items = [
  { label: 'Components', key: 'components' },
  { label: 'Agents', key: 'agents' },
];

const serviceItem = [{ label: 'Services', key: 'services' }];

const NavigationMenu = () => {
  const { isL1Network, chainName } = useHelpers();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState([]);
  const { pathname } = router;

  // to set default menu on first render
  useEffect(() => {
    if (pathname) {
      const name = pathname.split('/')[1];
      setSelectedMenu(name || null);
    }
  }, [pathname]);

  const handleMenuItemClick = ({ key }) => {
    router.push(`/${chainName}/${key}`);
    setSelectedMenu(key);
  };

  return (
    <Menu
      theme="light"
      mode="horizontal"
      selectedKeys={[selectedMenu]}
      items={isL1Network ? [...items, ...serviceItem] : serviceItem}
      onClick={handleMenuItemClick}
    />
  );
};

export default NavigationMenu;
