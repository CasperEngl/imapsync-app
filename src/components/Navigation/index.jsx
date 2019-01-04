/*
eslint

react/jsx-no-target-blank: 0,
*/

import React from 'react';
import { Navbar, NavbarBrand, Container } from 'reactstrap';

const Navigation = () => (
  <Navbar
    color="wkt"
    fixed="top"
    dark
    style={{
      WebkitAppRegion: 'drag',
      position: 'fixed',
    }}
    className="py-0"
  >
    <Container>
      <NavbarBrand className="mx-auto">
          Web-Koncept
      </NavbarBrand>
    </Container>
  </Navbar>
);

export default Navigation;
