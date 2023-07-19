import PropTypes from 'prop-types';
import {
  Button, Form, Input, Space, Radio,
} from 'antd/lib';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { addressValidator } from 'common-util/functions';

export const FormList = ({ inputOneLabel, inputTwoLabel, buttonText }) => (
  <Form.List
    name="units"
    initialValue={[{ operatorAddress: undefined, status: undefined }]}
    rules={[
      {
        validator: async (_, units) => {
          if (!units || units?.length === 0) {
            return Promise.reject(new Error('At least 1 Operator is required'));
          }
          return Promise.resolve();
        },
      },
    ]}
  >
    {(fields, { add, remove }, { errors }) => (
      <>
        {fields.map((field) => (
          <Space key={field.key} align="baseline">
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues.units !== curValues.units}
            >
              {() => (
                <Form.Item
                  {...field}
                  label={inputOneLabel}
                  name={[field.name, 'operatorAddress']}
                  rules={[
                    { required: true, message: `Please add ${inputOneLabel}` },
                    addressValidator,
                  ]}
                >
                  <Input className="mr-32" placeholder="Address" />
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item
              {...field}
              label={inputTwoLabel}
              name={[field.name, 'status']}
              rules={[
                { required: true, message: `Please add ${inputTwoLabel}` },
              ]}
            >
              <Radio.Group>
                <Radio value="true">True</Radio>
                <Radio value="false">False</Radio>
              </Radio.Group>
            </Form.Item>

            {fields.length > 1 && (
              <MinusCircleOutlined onClick={() => remove(field.name)} />
            )}
          </Space>
        ))}

        <Form.ErrorList errors={errors} />

        <Form.Item wrapperCol={{ span: 6 }}>
          <Button onClick={() => add()} block icon={<PlusOutlined />}>
            {buttonText}
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

FormList.propTypes = {
  inputOneLabel: PropTypes.string.isRequired,
  inputTwoLabel: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};
