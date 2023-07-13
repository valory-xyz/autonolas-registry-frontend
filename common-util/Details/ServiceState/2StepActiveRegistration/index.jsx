import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, Typography } from 'antd/lib';
import { convertToEth, isL1OnlyNetwork } from 'common-util/functions';
import {
  getBonds,
  getTokenBondRequest,
  getNumberOfAgentAddress,
} from '../utils';
import ActiveRegistrationTable from '../ActiveRegistrationTable';

const { Text } = Typography;

const STEP = 2;

const ActiveRegistration = ({
  serviceId,
  dataSource,
  setDataSource,
  handleStep2RegisterAgents,
  getOtherBtnProps,
  handleTerminate,
  getButton,
  isOwner,
  isEthToken,
}) => {
  const chainId = useSelector((state) => state?.setup?.chainId);

  const [totalBonds, setTotalBond] = useState(null);
  const [ethTokenBonds, setEthTokenBonds] = useState([]);
  const [isValidAgentAddress, setIsValidAgentAddress] = useState(false);

  useEffect(() => {
    // react will throw an warning if we use setState after the component is unmounted,
    // hence need to check if the component is actually mounted
    let isMounted = true;
    (async () => {
      if (serviceId) {
        try {
          const response = await getBonds(serviceId, dataSource);
          if (isMounted) {
            setTotalBond(response.totalBonds);
          }
        } catch (error) {
          window.console.log('Error while fetching bonds');
          console.error(error);
        }
      }

      if (serviceId && !isEthToken && isL1OnlyNetwork(chainId)) {
        const response = await getTokenBondRequest(serviceId, dataSource);
        setEthTokenBonds(response);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [serviceId, dataSource]);

  const btnProps = getOtherBtnProps(STEP);

  const totalBondEthToken = convertToEth((totalBonds || 0).toString()) || '--';

  let totalTokenBonds = 0;
  ethTokenBonds.forEach((bond, index) => {
    const addressCount = getNumberOfAgentAddress(
      dataSource[index].agentAddresses,
    );
    totalTokenBonds += addressCount * bond;
  });

  return (
    <div className="step-2-active-registration">
      <ActiveRegistrationTable
        data={dataSource}
        setDataSource={setDataSource}
        bordered
        isDisabled={btnProps.disabled}
        setIsValidAgentAddress={setIsValidAgentAddress}
      />
      <Text type="secondary">
        {`Adding instances will cause a bond of ${totalBondEthToken} ETH`}
        {!isEthToken && (
          <>{` and ${convertToEth((totalTokenBonds || 0).toString())} token`}</>
        )}
      </Text>

      {/* "Register agents" can be clicked by anyone */}
      <Button
        onClick={handleStep2RegisterAgents}
        {...btnProps}
        disabled={btnProps.disabled || !isValidAgentAddress}
      >
        Register Agents
      </Button>
      <Divider />
      {getButton(
        <Button
          onClick={handleTerminate}
          {...getOtherBtnProps(2, { isDisabled: !isOwner })}
        >
          Terminate
        </Button>,
        { step: 2 },
      )}
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
  getOtherBtnProps: PropTypes.func.isRequired,
  handleTerminate: PropTypes.func.isRequired,
  getButton: PropTypes.func.isRequired,
  isOwner: PropTypes.bool.isRequired,
  isEthToken: PropTypes.bool.isRequired,
};

ActiveRegistration.defaultProps = {
  serviceId: null,
};

export default ActiveRegistration;
