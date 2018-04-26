import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Jumbotron, FormGroup, Input, Label } from 'reactstrap';

const Hero = ({ command }) => (
  <Jumbotron>
    <Container>
      <h1>IMAP SYNC</h1>
      <FormGroup>
        <Label>Script</Label>
        <Input type="text" placeholder="Script will appear here" value={command} readOnly />
      </FormGroup>
    </Container>
  </Jumbotron>
);

Hero.propTypes = {
  command: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  command: state.compiler.command,
});

export default connect(mapStateToProps)(Hero);
