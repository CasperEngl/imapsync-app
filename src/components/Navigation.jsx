/*
eslint

react/jsx-no-target-blank: 0,
*/

import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const Navigation = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="https://web-koncept.dk/" target="_blank">Web-Koncept</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem href="../">
        <FontAwesome name="arrow-circle-left" size="2x" />
      </NavItem>
    </Nav>
  </Navbar>
);

export default Navigation;
