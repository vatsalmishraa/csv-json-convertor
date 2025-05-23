import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-2 mt-2">
      <Container className="text-center text-muted">
        <p className="mb-0">CSV to JSON Converter &copy; {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;
