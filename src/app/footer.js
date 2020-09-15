import React, { useEffect, useState } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { ManifestService } from '@dhruv-techapps/core-common'
const Footer = () => {
  const [version, setVersion] = useState('2.0.0')

  useEffect(() => {
    ManifestService.getItem(['version']).then(_manifest => {
      setVersion(_manifest.version)
    })
  }, [])

  return <Navbar expand='lg' sticky='bottom'>
    <Nav className='mr-auto'>
      <Nav.Link href='mailto:dhruv.techapps@gmail.com' active>dhruv.techapps@gmail.com</Nav.Link>
      <Nav.Link href='https://github.com/Dhruv-Techapps/auto-click-auto-fill/issues' target='_blank'>Issues</Nav.Link>
      <Nav.Link href='https://getautoclicker.com/test' target='_blank'>Test</Nav.Link>
      <Nav.Link>v{version}</Nav.Link>
    </Nav>
  </Navbar>
}
export default Footer
