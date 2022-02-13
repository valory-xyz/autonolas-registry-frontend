import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  Form, Input, Typography, Alert,
} from 'antd/lib';
// import { DependencyLabel } from './ListCommon';
import Hash from 'ipfs-only-hash';
import { CustomModal, ComplexLabel } from './styles';

const { Paragraph } = Typography;

export const FORM_NAME = 'ipfs_creation_form';

const IpfsModal = ({
  visible, account, type, handleCancel,
}) => {
  const [ipfsValue, setIpfsValue] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (account) {
      console.log(values); /* eslint-disable-line no-console */
      const hash = await Hash.of(JSON.stringify(values));
      setIpfsValue(hash);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const onCancel = () => {
    handleCancel();
    setIpfsValue(null);
  };

  return (
    <CustomModal
      visible={visible}
      centered
      title="Create IPFS Hash"
      okText="Create"
      cancelText="Cancel"
      width={580}
      onOk={() => form.validateFields().then(onFinish).catch(onFinishFailed)}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        name={FORM_NAME}
        layout="vertical"
        autoComplete="off"
        preserve={false}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: `Please input the name of the ${type}`,
            },
          ]}
        >
          <Input placeholder="abc..." />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: `Please input the description of the ${type}`,
            },
          ]}
        >
          <Input placeholder="abc..." />
        </Form.Item>

        <Form.Item
          label="Version"
          name="version"
          rules={[
            {
              required: true,
              message: 'Please input the version',
            },
          ]}
        >
          <Input placeholder="1" />
        </Form.Item>

        <Form.Item
          name="uri"
          label={(
            <ComplexLabel>
              URI
              <div className="label-helper-text">
                A URI pointing to a resource with mime type image/* representing
                the asset to which this NFT represents
              </div>
            </ComplexLabel>
          )}
          rules={[
            {
              required: true,
              message: 'Please input the URI',
            },
          ]}
        >
          <Input placeholder="code..." />
        </Form.Item>
      </Form>

      {ipfsValue && (
        <Alert
          message={<Paragraph copyable>{ipfsValue}</Paragraph>}
          type="info"
        />
      )}
    </CustomModal>
  );
};

IpfsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  account: PropTypes.string,
  type: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
};

IpfsModal.defaultProps = {
  account: null,
  type: '',
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(IpfsModal);
