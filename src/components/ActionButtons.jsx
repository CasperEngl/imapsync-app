/*
eslint

no-shadow: 0,
*/

import React from 'react';
import { ButtonToolbar, ButtonGroup, Button, FormGroup, Label, Input } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { addTransfer, compileTransfers, clearTransfers, toggleSSL } from '../actions/UserActions';

const StyledFormGroup = styled(FormGroup)`
  display: flex;
  align-items: center;
  margin-left: .5rem;
`;

const ActionButtons = ({
  addTransfer, compileTransfers, clearTransfers, toggleSSL, ssl,
}) => (
  <ButtonToolbar>
    <ButtonGroup>
      <Button color="primary" onClick={addTransfer}>Add Transfer</Button>
      <Button
        color="warning"
        onClick={() => {
        clearTransfers();
        compileTransfers();
      }}
      >Clear
      </Button>
    </ButtonGroup>
    <StyledFormGroup check>
      <Label>
        <Input
          type="checkbox"
          onChange={() => {
            toggleSSL();
            compileTransfers();
          }}
          checked={ssl}
        />Toggle SSL
      </Label>
    </StyledFormGroup>
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
