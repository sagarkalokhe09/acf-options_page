import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'

const Footer = ({ version }) => {
  return <Navbar expand='lg' sticky='bottom'>
    <Nav className='mr-auto'>
      <Nav.Link href='mailto:dhruv.techapps@gmail.com' active>dhruv.techapps@gmail.com</Nav.Link>
      <Nav.Link href={process.env.REACT_APP_ISSUES} target='_blank'>Issues</Nav.Link>
      <Nav.Link href={process.env.REACT_APP_TEST} target='_blank'>Test</Nav.Link>
      <Nav.Link>v{version}</Nav.Link>
    </Nav>
  </Navbar>
}
Footer.propTypes = {
  version: PropTypes.string.isRequired
}
export default Footer
