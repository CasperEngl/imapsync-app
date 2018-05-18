/*
eslint

react/jsx-no-target-blank: 0,
*/

import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Container, NavLink } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const Navigation = () => (
  <Navbar color="wkt" dark>
    <Container>
      <NavbarBrand href="https://web-koncept.dk/" target="_blank">Web-Koncept</NavbarBrand>
      <Nav navbar>
        <NavItem>
          <NavLink href="https://support.wkt.dk"><FontAwesome name="arrow-circle-left" size="2x" /></NavLink>
        </NavItem>
      </Nav>
    </Container>
  </Navbar>
);

export default Navigation;
