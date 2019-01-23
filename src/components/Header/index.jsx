/*
eslint

react/jsx-no-target-blank: 0,
*/

import React from 'react';
import { Navbar, NavbarBrand, Container } from 'reactstrap';

const Header = () => (
  <Navbar
    color="light"
    fixed="top"
    dark
    style={{
      WebkitAppRegion: 'drag',
    }}
    className="py-0"
  >
    <Container>
      <NavbarBrand className="mx-auto font-weight-bold">
        IMAPSYNC
      </NavbarBrand>
    </Container>
  </Navbar>
);

export default Header;
