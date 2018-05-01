import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Jumbotron, FormGroup, Input, Label, Button } from 'reactstrap';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyGroup = styled.div`
  display: flex;

  > * {
    border-radius: 0;

    &:first-child {
      border-top-left-radius: .25rem;
      border-bottom-left-radius: .25rem;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:last-child {
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-top-right-radius: .25rem;
      border-bottom-right-radius: .25rem;
    }
  }
`;

const Hero = ({ command }) => (
  <Jumbotron>
    <Container>
      <h1>IMAP SYNC</h1>
      <FormGroup>
        <Label>Script</Label>
        <CopyGroup>
          <Input type="text" placeholder="Script will appear here" value={command} readOnly />
          <CopyToClipboard text={command}>
            <Button color="success">Copy</Button>
          </CopyToClipboard>
        </CopyGroup>
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
