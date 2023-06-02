import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Typography } from 'antd/lib';
import { convertToEth } from 'common-util/functions';
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
  const [totalBonds, setTotalBond] = useState(null);
  const [ethTokenBonds, setEthTokenBonds] = useState([]);

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

      if (serviceId && !isEthToken) {
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
      />
      <Text type="secondary">
        {`Adding instances will cause a bond of ${totalBondEthToken} ETH`}
        {!isEthToken && (
          <>{` and ${convertToEth((totalTokenBonds || 0).toString())} token`}</>
        )}
      </Text>

      {/* "Register agents" can be clicked by anyone */}
      <Button onClick={handleStep2RegisterAgents} {...btnProps}>
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

//
/**
 * service creation - add a button below ETH token "Prefill Eth Token" &
 * on click should prefill the token address starting with 0xEee....
 *
 * Deployed step (4th step) - no data is shown, fix it
 *
 */
