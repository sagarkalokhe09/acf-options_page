import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
const Footer = () => <Navbar expand='lg' sticky='bottom'>
  <Nav className='mr-auto'>
    <Nav.Link href='mailto:dhruv.techapps@gmail.com' active>dhruv.techapps@gmail.com</Nav.Link>
    <Nav.Link href='https://github.com/Dhruv-Techapps/auto-click-auto-fill/issues' target='_blank'>Issues</Nav.Link>
    <Nav.Link href='https://getautoclicker.com/test' target='_blank'>Test</Nav.Link>
    <Nav.Link>v1.0.0</Nav.Link>
  </Nav>
</Navbar>
export default Footer
