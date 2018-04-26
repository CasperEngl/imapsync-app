/*
eslint

no-shadow: 0,
*/

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, ButtonToolbar, Button } from 'reactstrap';
import PropTypes from 'prop-types';

import { removeTransfer } from '../actions/UserActions';

import UserInputs from './UserInputs';

class Transfer extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    removeTransfer: PropTypes.func.isRequired,
  }

  render() {
    const { number, removeTransfer } = this.props;

    return (
      <Fragment>
        <Col xs="12" md="6" className={`transfer-${number}`}>
          <h2>Transfer {number}</h2>
          <Row>
            <Col xs="12" md="6">
              <UserInputs number={number} user={1} />
            </Col>
            <Col xs="12" md="6">
              <UserInputs number={number} user={2} />
            </Col>
          </Row>
          <ButtonToolbar>
            <Button color="danger" onClick={() => removeTransfer(number)}>Remove</Button>
          </ButtonToolbar>
        </Col>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  removeTransfer,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
