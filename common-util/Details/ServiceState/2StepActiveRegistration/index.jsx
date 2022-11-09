import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Typography } from 'antd/lib';
import { convertToEth } from 'common-util/functions';
import { getBonds } from '../utils';
import ActiveRegistrationTable from '../ActiveRegistrationTable';

const { Text } = Typography;

const ActiveRegistration = ({
  serviceId,
  dataSource,
  setDataSource,
  handleStep2RegisterAgents,
  handleTerminate,
}) => {
  const [totalBond, setTotalBond] = useState(null);

  useEffect(() => {
    (async () => {
      if (serviceId) {
        const response = await getBonds(serviceId);
        setTotalBond(convertToEth(response?.totalBonds || 0));
      }
    })();
  }, [serviceId]);

  return (
    <div className="step-2-active-registration">
      <ActiveRegistrationTable
        data={dataSource}
        setDataSource={setDataSource}
        bordered
      />
      <Text type="secondary">
        Adding instances will cause a bond of&nbsp;
        {totalBond}
        &nbsp;ETH per agent instance
      </Text>
      <Button onClick={handleStep2RegisterAgents}>Register Agents</Button>
      <Divider />
      <Button onClick={handleTerminate}>Terminate</Button>
    </div>
  );
};

ActiveRegistration.propTypes = {
  serviceId: PropTypes.string,
  dataSource: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  ).isRequired,
  setDataSource: PropTypes.func.isRequired,
  handleStep2RegisterAgents: PropTypes.func.isRequired,
  handleTerminate: PropTypes.func.isRequired,
};

ActiveRegistration.defaultProps = {
  serviceId: null,
};

export default ActiveRegistration;
