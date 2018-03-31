import React from 'react';
import { Navbar } from 'react-bootstrap';

const Navigation = () => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#brand">Web-Koncept</a>
      </Navbar.Brand>
    </Navbar.Header>
  </Navbar>
);

export default Navigation;
