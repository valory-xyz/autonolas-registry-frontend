import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Row, Col, Skeleton } from 'antd';
import { NAV_TYPES } from 'util/constants';
import { InfoSubHeader, Info } from './styles';
// import { ListEmptyMessage, PrintJson } from 'common-util/List/ListCommon';

const gt = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

const Details = ({ account, type, getDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({});

  useEffect(async () => {
    if (account) {
      setIsLoading(true);
      setInfo([]);

      try {
        const temp = await getDetails();
        setInfo(temp);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  }, [account]);

  if (isLoading) {
    return <Skeleton active />;
  }

  // console.log(info);
  return (
    <>
      <Row gutter={gt}>
        <Col className="gutter-row" span={12}>
          <InfoSubHeader>Description</InfoSubHeader>
          <div>{get(info, 'description', null)}</div>
        </Col>
        <Col className="gutter-row" span={12}>
          {type === NAV_TYPES.SERVICE ? (
            <>
              <InfoSubHeader>Name</InfoSubHeader>
              <div>{get(info, 'name', null)}</div>
              <br />

              <InfoSubHeader>Owner Address</InfoSubHeader>
              <div>{get(info, 'owner', null)}</div>
              <br />

              <InfoSubHeader>Developer Address</InfoSubHeader>
              <div>{get(info, 'developer', null) || 'NA'}</div>
              <br />

              <InfoSubHeader>Active</InfoSubHeader>
              <div>{get(info, 'active', null) ? 'TRUE' : 'FALSE'}</div>
              <br />

              <InfoSubHeader>Agent IDs</InfoSubHeader>
              <Info>
                {(get(info, 'agentIds') || []).map((e) => (
                  <li>{e}</li>
                ))}
              </Info>
              <br />

              <InfoSubHeader>agentNumSlots</InfoSubHeader>
              <Info>
                {(get(info, 'agentNumSlots') || []).map((e) => (
                  <li>{e}</li>
                ))}
              </Info>
              <br />

              <InfoSubHeader>Threshold</InfoSubHeader>
              <div>{get(info, 'threshold', null)}</div>
              <br />
            </>
          ) : (
            <>
              <InfoSubHeader>Owner Address</InfoSubHeader>
              <div>{get(info, 'owner', null)}</div>
              <br />

              <InfoSubHeader>Developer Address</InfoSubHeader>
              <div>{get(info, 'developer', null)}</div>
              <br />

              <InfoSubHeader>Hash</InfoSubHeader>
              <div>{get(info, 'agentHash', null)}</div>
              <br />

              <InfoSubHeader>Component Dependencies</InfoSubHeader>
              <Info>
                {(get(info, 'dependencies') || []).map((e) => (
                  <li key={`${type}-dependency-${e}`}>{e}</li>
                ))}
              </Info>
              <br />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

Details.propTypes = {
  account: PropTypes.string,
  type: PropTypes.string.isRequired,
  getDetails: PropTypes.func.isRequired,
};

Details.defaultProps = {
  account: null,
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(Details);
