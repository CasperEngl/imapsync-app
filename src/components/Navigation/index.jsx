/*
eslint

react/jsx-no-target-blank: 0,
*/

import React from 'react';
import { Navbar, NavbarBrand, Container } from 'reactstrap';

const Navigation = () => (
  <Navbar
    color="wkt"
    dark
    style={{
      WebkitAppRegion: 'drag',
    }}
  >
    <Container>
      <NavbarBrand className="mx-auto">
          Web-Koncept
      </NavbarBrand>
    </Container>
  </Navbar>
);

export default Navigation;
