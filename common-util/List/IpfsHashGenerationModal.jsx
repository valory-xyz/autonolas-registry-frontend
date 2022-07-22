import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  Form, Input, Typography, Alert, Button,
} from 'antd/lib';
// import Hash from 'ipfs-only-hash';
import { CustomModal, YourHashContainer } from './styles';

const { Paragraph } = Typography;

export const FORM_NAME = 'ipfs_creation_form';

function makeid(length) {
  let result = '';
  const characters = 'abcdef0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const getHash = async () => {
  // const hash = await Hash.of(JSON.stringify(info), {
  //   cidVersion: 1,
  //   format: 'dag-pb',
  //   hashAlg: 'sha2-256',
  // });
  // console.log({ hash });
  const hash = `0x${makeid(64)}`;
  return hash;
};

const IpfsModal = ({
  visible, type, onUpdateHash, handleCancel,
}) => {
  const [ipfsValue, setIpfsValue] = useState(null);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const hash = await getHash(values);
    setIpfsValue(hash);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const onCancel = () => {
    setIpfsValue(null);
    handleCancel();
  };

  const copyHashAndClose = () => {
    navigator.clipboard.writeText(ipfsValue);
    handleCancel();
  };

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      const hash = await getHash(values);
      setIpfsValue(hash);
      onUpdateHash(hash);
    });
  };

  return (
    <CustomModal
      visible={visible}
      centered
      title="Generate IPFS Hash to Code"
      okText="Copy Hash & Close"
      cancelText="Cancel"
      destroyOnClose
      width={620}
      onCancel={handleCancel}
      footer={[
        <Fragment key="footer-1">
          <Button type="default" htmlType="submit" onClick={onCancel}>
            Cancel
          </Button>

          {onUpdateHash ? (
            <Button type="primary" onClick={handleUpdate}>
              Update Hash
            </Button>
          ) : (
            <Button type="primary" onClick={copyHashAndClose}>
              Copy Hash & Close
            </Button>
          )}
        </Fragment>,
      ]}
    >
      <Form
        form={form}
        name={FORM_NAME}
        layout="vertical"
        autoComplete="off"
        preserve={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: `Please input the name of the ${type}` },
          ]}
        >
          <Input />
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
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Version"
          name="version"
          rules={[{ required: true, message: 'Please input the version' }]}
        >
          <Input placeholder="1" style={{ width: 100 }} />
        </Form.Item>

        <Form.Item
          name="uri"
          label="URI Pointer to Code"
          rules={[{ required: true, message: 'Please input the URI Pointer' }]}
          extra="Should point to package, e.g. https://gateway.autonolas.tech/ipfs/{package_hash}"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" ghost>
            Generate Hash
          </Button>
        </Form.Item>
      </Form>

      <YourHashContainer>
        <p>Your hash:</p>
        <Alert
          message={<Paragraph>{ipfsValue || '--'}</Paragraph>}
          type="info"
          className="inherit-alert-info"
        />
      </YourHashContainer>
    </CustomModal>
  );
};

IpfsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  type: PropTypes.string,
  onUpdateHash: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
};

IpfsModal.defaultProps = {
  type: '',
  onUpdateHash: null,
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(IpfsModal);
