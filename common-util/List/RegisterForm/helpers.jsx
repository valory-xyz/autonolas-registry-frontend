import PropTypes from 'prop-types';
import { Form, Input, Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { GATEWAY_URL, HASH_PREFIX } from 'util/constants';
import { getBase16Validator } from '../IpfsHashGenerationModal';

export const FormItemHash = ({ listType, hashValue }) => (
  <Form.Item
    label="Hash of Metadata File"
    name="hash"
    rules={[
      {
        required: true,
        message: `Please input the IPFS hash of the ${listType}`,
      },
      () => ({
        validator(_, value) {
          return getBase16Validator(value);
        },
      }),
    ]}
  >
    <Input
      disabled
      addonBefore={HASH_PREFIX}
      addonAfter={(
        <Tooltip
          title={
            hashValue
              ? 'Click to open the generated hash'
              : 'Please generate hash'
          }
        >
          <LinkOutlined
            style={hashValue ? {} : { cursor: 'not-allowed' }}
            onClick={() => {
              if (hashValue) {
                window.open(
                  `${GATEWAY_URL}${HASH_PREFIX}${hashValue}`,
                  '_blank',
                );
              }
            }}
          />
        </Tooltip>
      )}
    />
  </Form.Item>
);

FormItemHash.propTypes = {
  listType: PropTypes.string,
  hashValue: PropTypes.string,
};

FormItemHash.defaultProps = {
  listType: '',
  hashValue: null,
};

export const getX = () => {};
