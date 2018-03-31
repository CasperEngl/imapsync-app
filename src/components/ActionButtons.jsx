import React from 'react';
import { ButtonToolbar, Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addTransfer, compileTransfers, clearTransfers } from '../actions/UserActions';

const ActionButtons = ({ addTransfer, compile, clearTransfers }) => (
  <ButtonToolbar>
    <Button color="info" onClick={() => addTransfer(1)}>Add Transfer</Button>
    <Button color="success" onClick={compile}>Compile</Button>
    <Button color="warning" className="pull-right" onClick={clearTransfers}>Clear</Button>
  </ButtonToolbar>
);

ActionButtons.propTypes = {
  addTransfer: PropTypes.func.isRequired,
  compile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addTransfer,
  compileTransfers,
  clearTransfers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
