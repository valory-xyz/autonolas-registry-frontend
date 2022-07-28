import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Form, Input, Button } from 'antd/lib';
// import Hash from 'ipfs-only-hash';
import { HASH_PREFIX } from 'util/constants';
import { CustomModal } from '../styles';
import { getIpfsHash } from './helpers';

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
  // const updatedInfo = {
  //   ...info,
  //   uri: `https://gateway.autonolas.tech/ipfs/${HASH_PREFIX}${info.uri}`,
  // };
  // const currentHash = await Hash.of(JSON.stringify(updatedInfo), {
  //   cidVersion: 1,
  //   format: 'dag-pb',
  //   hashAlg: 'sha2-256',
  // });
  const hash = `0x${makeid(64)}`;
  return hash;
};

const IpfsModal = ({
  visible, type, onUpdateHash, handleCancel, callback,
}) => {
  const [form] = Form.useForm();
  const [isHashLoading, setIsHashLoading] = useState(false);
  const [typedUri, setTypedUri] = useState('');

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const onModalClose = () => {
    handleCancel();
  };

  const getNewHash = async (values) => {
    try {
      setIsHashLoading(true); // loading on!
      const hash = await getHash(values);
      onModalClose();

      return hash;
    } catch (error) {
      window.console.log(error);
    } finally {
      setIsHashLoading(false); // off the loader and close the `Modal`
    }

    return null;
  };

  const onFinish = async (values) => {
    const hash = await getNewHash(values);

    if (callback) {
      callback(hash);
      getIpfsHash(values);
    }
  };

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      const hash = await getNewHash(values);
      onUpdateHash(hash);

      if (callback) {
        callback(hash);
      }
    });
  };

  const handleOk = () => {
    form.submit();
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
      onModalClose={handleCancel}
      footer={[
        <Fragment key="footer-1">
          <Button type="default" htmlType="submit" onClick={onModalClose}>
            Cancel
          </Button>

          <Button
            form="myForm"
            key="submit"
            htmlType="submit"
            type="primary"
            loading={isHashLoading}
            onClick={onUpdateHash ? handleUpdate : handleOk}
          >
            {onUpdateHash ? 'Update Hash' : 'Generate Hash'}
          </Button>
        </Fragment>,
      ]}
    >
      <Form
        form={form}
        name={FORM_NAME}
        layout="vertical"
        autoComplete="off"
        preserve={false}
        id="myForm"
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
          extra={`Should point to package, e.g. https://gateway.autonolas.tech/ipfs/${HASH_PREFIX}${typedUri}`}
          rules={[
            {
              required: true, message: 'Please input the URI Pointer',
            },
            // () => ({
            //   validator(_, value) {
            //     console.log({ value });
            //     if (value.length === 64) return Promise.resolve();
            //     return Promise.reject(
            //       new Error(
            //         'Please input a valid hash',
            //       ),
            //     );
            //   },
            // }),
          ]}
        >
          <Input
            addonBefore={HASH_PREFIX}
            onChange={(e) => setTypedUri(e.target.value || '')}
          />
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

IpfsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  type: PropTypes.string,
  onUpdateHash: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  callback: PropTypes.func,
};

IpfsModal.defaultProps = {
  type: '',
  onUpdateHash: null,
  callback: null,
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(IpfsModal);
