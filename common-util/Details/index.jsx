import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import {
  Row, Col, Skeleton, Button,
} from 'antd';
import { NAV_TYPES } from 'util/constants';
import {
  Header, DetailsTitle, InfoSubHeader, Info,
} from './styles';
import { RegisterMessage } from '../List/ListCommon';

const NA = 'NA';
const gt = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
};

const Details = ({
  account, id, type, getDetails, handleUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({});

  useEffect(async () => {
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
  }, [account]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (!account) {
    return (
      <>
        <Header>
          <DetailsTitle level={2}>{`${capitalize(type)}`}</DetailsTitle>
        </Header>
        <RegisterMessage />
      </>
    );
  }

  const onUpdate = () => {
    if (handleUpdate) handleUpdate();
  };

  // console.log(info);
  return (
    <>
      <Header>
        <DetailsTitle level={2}>{`${capitalize(type)} ID ${id}`}</DetailsTitle>
        <Button disabled={!handleUpdate} type="primary" ghost onClick={onUpdate}>
          Update
        </Button>
      </Header>
      <Row gutter={gt}>
        <Col className="gutter-row" span={12}>
          <InfoSubHeader>Description</InfoSubHeader>
          <div>{get(info, 'description', null) || NA}</div>
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

              <InfoSubHeader>No. of slots to canonical agent Ids</InfoSubHeader>
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
              <div>{get(info, 'owner', null) || NA}</div>
              <br />

              <InfoSubHeader>Developer Address</InfoSubHeader>
              <div>{get(info, 'developer', null) || NA}</div>
              <br />

              <InfoSubHeader>Hash</InfoSubHeader>
              <Info>{get(info, 'agentHash', null) || NA}</Info>
              <br />

              <InfoSubHeader>Component Dependencies</InfoSubHeader>
              <Info data-testid="details-dependency">
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
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  getDetails: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func,
};

Details.defaultProps = {
  account: null,
  handleUpdate: null,
};

const mapStateToProps = (state) => {
  const account = get(state, 'setup.account') || null;
  return { account };
};

export default connect(mapStateToProps, {})(Details);
