import React from 'react';
import { Container, Jumbotron, FormGroup, Input, Label } from 'reactstrap';

const Hero = () => (
  <Jumbotron>
    <Container>
      <h1>IMAP SYNC</h1>
      <FormGroup>
        <Label>Script</Label>
        <Input type="text" placeholder="Script will appear here" value="/Applications/imapsync/imapsync_bin_Darwin --host1 HOST1 --user1 USER1 --password1 PASSWORD1 --ssl1 --host2 HOST2 --user2 USER2 --password2 PASSWORD2 --ssl2" readOnly />
      </FormGroup>
    </Container>
  </Jumbotron>
);

export default Hero;
