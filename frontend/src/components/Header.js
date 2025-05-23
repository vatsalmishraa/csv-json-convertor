import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <i className="bi bi-filetype-csv me-2"></i>
          CSV to JSON Converter
        </Navbar.Brand>
        <div className="d-flex align-items-center">
          {/* Database connection badge removed */}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
