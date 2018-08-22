/*
eslint

no-shadow: 0,
*/

import React, { Component, Fragment } from 'react';
import { ButtonToolbar, ButtonGroup, Button, FormGroup, Label, Input } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { addTransfer, compileTransfers, clearTransfers, toggleSSL, addExtraArgs } from '../actions/UserActions';

const StyledFormGroup = styled(FormGroup)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledLabel = styled(Label)`
  margin: 1rem 0 .25rem;
  display: block;
`;

class ActionBar extends Component {
  static propTypes = {
    addTransfer: PropTypes.func.isRequired,
    compileTransfers: PropTypes.func.isRequired,
    clearTransfers: PropTypes.func.isRequired,
    toggleSSL: PropTypes.func.isRequired,
    addExtraArgs: PropTypes.func.isRequired,
    ssl: PropTypes.bool.isRequired,
  }

  handleExtraArgs(event) {
    const { addExtraArgs, compileTransfers } = this.props;
    const { value } = event.target;

    addExtraArgs(value);
    compileTransfers();
  }

  render() {
    const {
      addTransfer,
      compileTransfers,
      clearTransfers,
      toggleSSL,
      ssl,
    } = this.props;

    return (
      <Fragment>
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
        </ButtonToolbar>
        <StyledFormGroup check>
          <StyledLabel>
            <Input
              type="checkbox"
              onChange={() => {
                        toggleSSL();
                        compileTransfers();
                      }}
              checked={ssl}
            />Toggle SSL
          </StyledLabel>
        </StyledFormGroup>
        <StyledFormGroup>
          <StyledLabel for="extra-args">Extra arguments <small>(for all transfers)</small></StyledLabel>
          <Input
            id="extra-args"
            type="text"
            onChange={event => this.handleExtraArgs(event)}
          />
        </StyledFormGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ssl: state.compiler.ssl,
  extraArgs: state.compiler.extraArgs,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addTransfer,
  compileTransfers,
  clearTransfers,
  toggleSSL,
  addExtraArgs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);