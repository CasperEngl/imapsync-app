import React from 'react';
import { ButtonToolbar, Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addTransfer, clearTransfers } from '../actions/UserActions';

const ActionButtons = ({ addTransfer, compileTransfers, clearTransfers }) => (
  <ButtonToolbar>
    <Button color="info" onClick={() => addTransfer(1)}>Add Transfer</Button>
    <Button color="warning" className="pull-right" onClick={clearTransfers}>Clear</Button>
  </ButtonToolbar>
);

ActionButtons.propTypes = {
  addTransfer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  transfers: state.transfer.transfers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addTransfer,
  clearTransfers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
