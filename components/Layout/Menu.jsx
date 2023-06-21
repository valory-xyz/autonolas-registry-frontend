/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd/lib';
import { useRouter } from 'next/router';
import { isL1Network } from 'common-util/functions';

const NavigationMenu = () => {
  const chainId = useSelector((state) => state?.setup?.chainId);
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
    router.push(`/${key}`);
    setSelectedMenu(key);
  };

  const items = [
    {
      label: 'Components',
      key: 'components',
    },
    {
      label: 'Agents',
      key: 'agents',
    },
  ];

  const serviceItem = [
    {
      label: 'Services',
      key: 'services',
    },
  ];

  return (
    <Menu
      theme="light"
      mode="horizontal"
      selectedKeys={[selectedMenu]}
      items={isL1Network(chainId) ? [...items, ...serviceItem] : serviceItem}
      onClick={handleMenuItemClick}
    />
  );
};

export default NavigationMenu;
