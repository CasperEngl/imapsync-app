import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  ButtonToolbar,
  Button,
} from 'reactstrap';

import UserInputs from '../UserInputs';

import { removeTransfer, duplicateTransfer } from '../../actions/transfer';
import { compileTransfers } from '../../actions/compiler';

interface Props {
  removeTransfer(number: number): void;
  duplicateTransfer(number: number): void;
  compileTransfers(): void;
  number: number;
}

function Transfer(props: Props) {
  const {
    number,
    removeTransfer,
    duplicateTransfer,
    compileTransfers,
  } = props;

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  removeTransfer,
  duplicateTransfer,
  compileTransfers,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(Transfer);
