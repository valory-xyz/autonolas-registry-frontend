import { Space, Button, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;
const textStyle = { maxWidth: '100%' };

export const EllipsisMiddle = ({ suffixCount, children }) => {
  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Text style={textStyle} ellipsis={{ suffix }}>
      {start}
    </Text>
  );
};

EllipsisMiddle.propTypes = {
  suffixCount: PropTypes.number,
  children: PropTypes.string,
};

EllipsisMiddle.defaultProps = {
  suffixCount: 0,
  children: null,
};

export const getTableColumns = ({ handleView }) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 220,
    render: (text) => <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>,
  },
  {
    title: 'Developer',
    dataIndex: 'developer',
    key: 'developer',
    width: 200,
    render: (text) => <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>,
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    width: 200,
    render: (text) => <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>,
  },
  {
    title: 'Hash',
    dataIndex: 'hash',
    key: 'hash',
    width: 200,
    render: (text) => <EllipsisMiddle suffixCount={5}>{text}</EllipsisMiddle>,
  },
  {
    title: 'Dependency',
    dataIndex: 'dependency',
    key: 'dependency',
    render: (text) => (text ? text.join(', ') : '-'),
  },
  {
    width: 200,
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_text, record) => (
      <Space size="middle">
        <Button type="link" onClick={() => handleView(record.id)}>
          View
        </Button>
      </Space>
    ),
  },
];

export const getData = (data) => {
  const temp = [
    {
      id: '1',
      description: 'Desc 1',
      developer: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      owner: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      hash: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      dependency: [1, 2],
    },
    {
      id: '2',
      description: 'Desc 2',
      developer: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      owner: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      hash: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      dependency: [0],
    },
    {
      id: '3',
      description: 'Desc 2',
      developer: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      owner: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      hash: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      dependency: null,
    },
  ];

  const finalData = data.map((item, index) => {
    console.log(item, item.componentHash);
    return {
      id: `${index + 1}`,
      description: item.description || '-',
      developer: item.developer || '-',
      owner: item.owner || '-',
      hash: item.componentHash || '-',
      dependency: item.dependencies,
    };
  });

  return finalData;
};
