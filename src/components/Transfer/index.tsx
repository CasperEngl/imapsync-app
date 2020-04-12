import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  Row, Col, ButtonToolbar, Button,
} from 'reactstrap'

import UserInputs from '../UserInputs'

import { removeTransfer, duplicateTransfer } from '../../actions/transfer'
import { compileTransfers } from '../../actions/compiler'

interface Transfer {
  locked: boolean;
}

interface State {
  transfer: Transfer;
}

interface Props extends Transfer {
  removeTransfer(number: number): void;
  duplicateTransfer(number: number): void;
  compileTransfers(): void;
  number: number;
}

function Transfer({
  number,
  locked,
  removeTransfer,
  duplicateTransfer,
  compileTransfers,
}: Props) {
  function remove() {
    removeTransfer(number)
    compileTransfers()
  }

  function duplicate() {
    duplicateTransfer(number)
    compileTransfers()
  }

  return (
    <>
      <h2>
        Transfer
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
      <ButtonToolbar className="mb-3">
        <Button
          color="danger"
          disabled={locked}
          onClick={remove}
        >
          Remove
        </Button>
        <Button
          color="link"
          disabled={locked}
          onClick={duplicate}
        >
          Duplicate
        </Button>
      </ButtonToolbar>
    </>
  )
}

const mapStateToProps = (state: State) => ({
  locked: state.transfer.locked,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  {
    removeTransfer,
    duplicateTransfer,
    compileTransfers,
  },
  dispatch,
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Transfer)
