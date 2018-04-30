/*
eslint

no-shadow: 0,
*/

import React from 'react';
import { ButtonToolbar, Button } from 'reactstrap';
import { Checkbox } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addTransfer, compileTransfers, clearTransfers, toggleSSL } from '../actions/UserActions';

const ActionButtons = ({
  addTransfer, compileTransfers, clearTransfers, toggleSSL, ssl,
}) => (
  <ButtonToolbar>
    <Button color="info" onClick={addTransfer}>Add Transfer</Button>
    <Button
      color="warning"
      className="pull-right"
      onClick={() => {
        clearTransfers();
        compileTransfers();
      }}
    >Clear
    </Button>
    <Checkbox
      className="pull-right"
      inline
      onChange={() => {
        toggleSSL();
        compileTransfers();
      }}
      checked={ssl}
    >Toggle SSL
    </Checkbox>
  </ButtonToolbar>
);

ActionButtons.propTypes = {
  addTransfer: PropTypes.func.isRequired,
  compileTransfers: PropTypes.func.isRequired,
  clearTransfers: PropTypes.func.isRequired,
  toggleSSL: PropTypes.func.isRequired,
  ssl: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
  ssl: state.compiler.ssl,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addTransfer,
  compileTransfers,
  clearTransfers,
  toggleSSL,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
