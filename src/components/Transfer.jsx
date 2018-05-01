/*
eslint

no-shadow: 0,
*/

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, ButtonToolbar, ButtonGroup, Button } from 'reactstrap';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { removeTransfer, duplicateTransfer } from '../actions/UserActions';

import UserInputs from './UserInputs';

class Transfer extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    removeTransfer: PropTypes.func.isRequired,
    duplicateTransfer: PropTypes.func.isRequired,
  }

  render() {
    const { number, removeTransfer, duplicateTransfer } = this.props;

    const StyledButtonGroup = styled(ButtonGroup)`
      margin: 0;
    `;

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
            <StyledButtonGroup>
              <Button color="danger" onClick={() => removeTransfer(number)}>Remove</Button>
              <Button color="default" onClick={() => duplicateTransfer(number)}>Duplicate</Button>
            </StyledButtonGroup>
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
  duplicateTransfer,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transfer);
