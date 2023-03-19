import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { SPONSORS } from '../constants'

export function Sponsors() {
  return (
    <Container className='sponsors'>
      <Row className='my-2'>
        <Col className='px-4'>
          <b className='text-muted mb-2 d-block'>Sponsored By</b>
          {SPONSORS.map(sponsor => (
            <a href={sponsor.link} key={sponsor.title} target='_blank' rel='noreferrer'>
              <Image width={30} height={30} roundedCircle src={sponsor.image} className='me-2' />
              {sponsor.title}
            </a>
          ))}
        </Col>
      </Row>
    </Container>
  )
}
