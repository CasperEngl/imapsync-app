import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const Navigation = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#brand">Web-Koncept</a>
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
