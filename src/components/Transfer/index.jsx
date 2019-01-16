import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
} from 'reactstrap';

import UserInputs from '../UserInputs';

import { removeTransfer, duplicateTransfer, compileTransfers } from '../../actions/UserActions';

class Transfer extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    removeTransfer: PropTypes.func.isRequired,
    duplicateTransfer: PropTypes.func.isRequired,
    compileTransfers: PropTypes.func.isRequired,
  }

  render() {
    const {
      number,
      removeTransfer,
      duplicateTransfer,
      compileTransfers,
    } = this.props;

    return (
      <Fragment>
        <h2>
          Transfer
          {' '}
          {number}
        </h2>
        <Row>
          <Col xs="12" md="6">
            <UserInputs number={number} user={1} />
          </Col>
          <Col xs="12" md="6">
            <UserInputs number={number} user={2} />
          </Col>
        </Row>
        <ButtonToolbar>
          <Button
            color="danger"
            onClick={async () => {
              await removeTransfer(number);
              compileTransfers();
            }}
          >
            Remove
          </Button>
          <Button
            color="link"
            onClick={async () => {
              await duplicateTransfer(number);
              compileTransfers();
            }}
          >
            Duplicate
          </Button>
        </ButtonToolbar>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  removeTransfer,
  duplicateTransfer,
  compileTransfers,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Transfer);
