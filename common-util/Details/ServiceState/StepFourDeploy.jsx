import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { Space, Radio, Typography } from 'antd/lib';
import PropTypes from 'prop-types';
import { deployMultisigAddresses } from 'common-util/Contracts';

const StepFourDeploy = ({ setRadioValue, radioValue }) => {
  const chainId = useSelector((state) => get(state, 'setup.chainId'));

  return (
    <>
      <div>
        <Typography.Text>Choose multi-sig implementation:</Typography.Text>
      </div>

      <Radio.Group
        value={radioValue}
        onChange={(e) => setRadioValue(e.target.value)}
      >
        <Space direction="vertical" size={10}>
          {(deployMultisigAddresses[chainId] || []).map((multisigAddress) => (
            <Radio key={multisigAddress} value={multisigAddress}>
              {multisigAddress}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </>
  );
};

StepFourDeploy.propTypes = {
  setRadioValue: PropTypes.func.isRequired,
  radioValue: PropTypes.string.isRequired,
};

StepFourDeploy.defaultProps = {};

export default StepFourDeploy;
