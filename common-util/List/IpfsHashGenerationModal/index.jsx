import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import {
  Form, Input, Button, Select,
} from 'antd';
import { HASH_PREFIXES } from 'util/constants';
import { getIpfsHashHelper } from './helpers';
import { CustomModal } from '../styles';

export const FORM_NAME = 'ipfs_creation_form';

export const getBase16Validator = (value, hashType = HASH_PREFIXES.type1) => {
  if (isNil(value) || value === '') {
    return Promise.resolve();
  }

  if (hashType === HASH_PREFIXES.type1) {
    // only 64 characters long valid Hash
    if (value.length === 64 && /[0-9a-f]/gm.test(value)) {
      return Promise.resolve();
    }
  }

  if (hashType === HASH_PREFIXES.type2) {
    if (value.length === 52 && /[0-9a-z]/gm.test(value)) {
      return Promise.resolve();
    }
  }

  return Promise.reject(new Error('Please input a valid hash'));
};

const IpfsModal = ({
  visible, type, onUpdateHash, handleCancel, callback,
}) => {
  const [form] = Form.useForm();
  const [isHashLoading, setIsHashLoading] = useState(false);
  const [hashType, setHashType] = useState(HASH_PREFIXES.type1);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo); /* eslint-disable-line no-console */
  };

  const onModalClose = () => {
    handleCancel();
  };

  const getNewHash = async (values) => {
    try {
      setIsHashLoading(true); // loading on!

      const hash = await getIpfsHashHelper(values, hashType);
      if (callback) callback(hash);
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
    if (callback) callback(hash);
  };

  const handleUpdate = () => {
    form.validateFields().then(async (values) => {
      const hash = await getNewHash(values);
      onUpdateHash(hash);
      if (callback) callback(hash);
    });
  };

  const handleOk = () => {
    form.submit();
  };

  return (
    <CustomModal
      open={visible}
      centered
      title="Generate IPFS Hash of Metadata File"
      okText="Copy Hash & Close"
      cancelText="Cancel"
      destroyOnClose
      width={620}
      onCancel={handleCancel}
      footer={[
        <Fragment key="footer-1">
          <Button type="default" onClick={onModalClose}>
            Cancel
          </Button>

          <Button
            form="myForm"
            htmlType="submit"
            type="primary"
            loading={isHashLoading}
            onClick={onUpdateHash ? handleUpdate : handleOk}
          >
            {onUpdateHash
              ? 'Save File & Update Hash'
              : 'Save File & Generate Hash'}
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
          name="code_uri"
          label="Package hash"
          extra="Hash should point to the package"
          rules={[
            {
              required: true,
              message: 'Please input the Package hash',
            },
            () => ({
              validator(_, value) {
                return getBase16Validator(value, hashType);
              },
            }),
          ]}
        >
          <Input
            addonBefore={(
              <Select
                defaultValue={hashType}
                className="select-before"
                onChange={(e) => setHashType(e)}
              >
                <Select.Option value={HASH_PREFIXES.type1}>
                  {HASH_PREFIXES.type1}
                </Select.Option>
                <Select.Option value={HASH_PREFIXES.type2}>
                  {HASH_PREFIXES.type2}
                </Select.Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="NFT Image URL"
          name="image"
          extra="Represents your NFT on marketplaces such as OpenSea"
        >
          <Input />
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
