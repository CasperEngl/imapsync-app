import * as React from 'react';
import { Navbar, NavbarBrand, Container } from 'reactstrap';

function Header() {
  return (
    <Navbar
      color="light"
      fixed="top"
      dark={true}
      className="py-0"
      style={{
        WebkitAppRegion: 'drag',
      }}
    >
      <Container>
        <NavbarBrand className="mx-auto font-weight-bold">
          IMAPSYNC
        </NavbarBrand>
      </Container>
    </Navbar>
  );
}

export default Header;
