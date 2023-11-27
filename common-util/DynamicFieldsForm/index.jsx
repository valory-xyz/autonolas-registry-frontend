import PropTypes from 'prop-types';
import { Button, Form, Typography } from 'antd';

import { useHelpers } from 'common-util/hooks';
import { RegistryForm } from 'common-util/TransactionHelpers/RegistryForm';
import { FormList } from './FormList';
import { DynamicFormContainer } from './styles';

const { Text } = Typography;

export const DynamicFieldsForm = ({
  inputOneLabel,
  inputTwoLabel,
  buttonText,
  isLoading,
  submitButtonText,
  onSubmit,
}) => {
  const { account } = useHelpers();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (onSubmit) {
      await onSubmit({
        operatorAddress: values.units.map((unit) => unit.operatorAddress),
        status: values.units.map((unit) => unit.status),
      });
    }
  };

  return (
    <DynamicFormContainer>
      <RegistryForm
        form={form}
        name="dynamic_form_complex"
        onFinish={onFinish}
        autoComplete="off"
      >
        <FormList
          inputOneLabel={inputOneLabel}
          inputTwoLabel={inputTwoLabel}
          buttonText={buttonText}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={!account}
          >
            {submitButtonText}
          </Button>

          {!account && (
            <Text className="ml-8" type="secondary">
              {`To ${(submitButtonText || '').toLowerCase()}, connect a wallet`}
            </Text>
          )}
        </Form.Item>
      </RegistryForm>
    </DynamicFormContainer>
  );
};

DynamicFieldsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  inputOneLabel: PropTypes.string,
  inputTwoLabel: PropTypes.string,
  buttonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  isLoading: PropTypes.bool,
};

DynamicFieldsForm.defaultProps = {
  inputOneLabel: 'Address',
  inputTwoLabel: 'Status',
  buttonText: 'Add row',
  submitButtonText: 'Submit',
  isLoading: false,
};
