import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import { EmptyMessage } from '../styles';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuComponents = () => {
  const router = useRouter();

  const handleTab = (key) => {
    console.log(key);
  };

  return (
    <>
      <Title level={2}>Components</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
        onChange={handleTab}
        tabBarExtraContent={(
          <Button
            ghost
            type="primary"
            onClick={() => router.push('/components/register')}
          >
            Register
          </Button>
        )}
      >
        <TabPane tab="All" key="all">
          <EmptyMessage>No components registered</EmptyMessage>
        </TabPane>
        <TabPane tab="My Components" key="my_components">
          <EmptyMessage width="200px">To see your components, connect a wallet.</EmptyMessage>
        </TabPane>
      </Tabs>
    </>
  );
};

export default MenuComponents;
