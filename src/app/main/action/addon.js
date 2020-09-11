import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Modal, Form, Container, Row, Col } from 'react-bootstrap'
import { ElementUtil } from '@dhruv-techapps/core-common'
import { AddonCondition, defaultAddon } from '@dhruv-techapps/acf-common'

const AddonModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  console.log('AddonModal')

  const [addon, setAddon] = useState({ ...defaultAddon })
  const [show, setShow] = useState(false)
  const actionIndex = useRef(-1)

  useImperativeHandle(ref, () => ({
    showAddon (index, addon) {
      actionIndex.current = index
      setAddon({ ...addon })
      setShow(true)
    }
  }))

  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setAddon({ ...addon, [name]: value })
  }

  const handleClose = () => {
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.actions[actionIndex.current].addon = { ...addon }
        return config
      }
      return config
    }))
    setShow(false)
  }

  return <Modal show={show} size='lg' onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>AAddon</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <h6>Add condition to be checked before executing Action</h6>
        <hr />
        <Container>
          <Row>
            <Col>
              <Form.Group controlId='addon-element'>
                <Form.Label>Element</Form.Label>
                <Form.Control type='text' placeholder='Element' name='element' value={addon.element} onChange={onChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='addon-condition' className='mb-0'>
                <Form.Label>Condition</Form.Label>
                <Form.Control as='select' custom value={addon.condition} onChange={onChange} name='condition'>
                  {Object.entries(AddonCondition).map((condition, index) => <option key={index} value={condition[1]}>{condition[0]}</option>)}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='addon-value'>
                <Form.Label>Value</Form.Label>
                <Form.Control type='text' placeholder='Value' value={addon.value} onChange={onChange} name='value' />
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Form>
    </Modal.Body>
  </Modal>
})

AddonModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(AddonModal)
