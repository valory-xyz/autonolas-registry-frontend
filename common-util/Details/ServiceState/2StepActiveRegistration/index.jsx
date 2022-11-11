import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Typography } from 'antd/lib';
import { convertToEth } from 'common-util/functions';
import { getBonds } from '../utils';
import ActiveRegistrationTable from '../ActiveRegistrationTable';

const { Text } = Typography;

const STEP = 2;

const ActiveRegistration = ({
  serviceId,
  dataSource,
  setDataSource,
  handleStep2RegisterAgents,
  handleTerminate,
  getOtherBtnProps,
}) => {
  const [totalBond, setTotalBond] = useState(null);

  useEffect(() => {
    // react will throw an warning if we use setState after the component is unmounted,
    // hence need to check if the component is actually mounted
    let isMounted = true;
    (async () => {
      if (serviceId) {
        const response = await getBonds(serviceId);
        if (isMounted) {
          setTotalBond(convertToEth((response?.totalBonds || 0).toString()));
        }
      }
    })();

    return () => {
      isMounted = false;
    };
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

      <Button onClick={handleStep2RegisterAgents} {...getOtherBtnProps(STEP)}>
        Register Agents
      </Button>
      <Divider />
      <Button onClick={handleTerminate} {...getOtherBtnProps(STEP)}>
        Terminate
      </Button>
    </div>
  );
};

ActiveRegistration.propTypes = {
  serviceId: PropTypes.string,
  dataSource: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ).isRequired,
  setDataSource: PropTypes.func.isRequired,
  handleStep2RegisterAgents: PropTypes.func.isRequired,
  handleTerminate: PropTypes.func.isRequired,
  getOtherBtnProps: PropTypes.func.isRequired,
};

ActiveRegistration.defaultProps = {
  serviceId: null,
};

export default ActiveRegistration;
