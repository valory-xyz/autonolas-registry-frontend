import { Tabs, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import ListCards from 'common-util/List/ListCards';
import { getEveryComponents, getComponents } from './utils';

const { TabPane } = Tabs;
const { Title } = Typography;

const MenuComponents = () => {
  const router = useRouter();

  return (
    <>
      <Title level={2}>Components</Title>
      <Tabs
        type="card"
        defaultActiveKey="all"
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
          <ListCards type="component" getList={getEveryComponents} />
        </TabPane>
        <TabPane tab="My Components" key="my_components">
          <ListCards type="component" getList={getComponents} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default MenuComponents;
