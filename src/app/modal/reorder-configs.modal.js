import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Form, Button, Alert, ListGroup } from 'react-bootstrap'
import Reorder, { reorder } from 'react-reorder'
import { StorageService } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'
import { defaultConfig, LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { ErrorAlert } from '../components/error.alert'
import GTAG from '../gtag'
import './reorder-configs.modal.scss'

const ReorderConfigsModal = forwardRef((_, ref) => {
  const [configs, setConfigs] = useState([])
  const [error, setError] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  const onSubmit = () => {
    StorageService.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs).then(() => {
      setShow(false)
    }).catch(setError).finally(_ => setLoading(false))
    GTAG.event({ category: 'Reorder-Configurations', action: 'Click', label: 'Save' })
  }

  useImperativeHandle(ref, () => ({
    showReorder () {
      StorageService.getItem(LOCAL_STORAGE_KEY.CONFIGS, [{ ...defaultConfig, name: '' }]).then(_configs => {
        setConfigs(_configs)
      }).catch(setError).finally(_ => setLoading(false))
      GTAG.modalview({ title: 'Reorder Configurations', url: window.location.href, path: '/configurations/reorder' })
      setShow(true)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Reorder Configurations', action: 'Click', label: 'Close' })
  }

  const onReorder = (event, previousIndex, nextIndex, fromId, toId) => {
    setConfigs(reorder(configs, previousIndex, nextIndex))
  }

  return <Modal show={show} size='lg' onHide={handleClose}>
    <Form onSubmit={onSubmit}>
      <Modal.Header>
        <Modal.Title>Reorder Configurations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading
          ? <Loading className='d-flex justify-content-center m-5' />
          : <>
            {error && <ErrorAlert message={error}/>}
            <Alert variant="warning">Please save all configurations before reordering</Alert>
            <Reorder
              reorderId="configurations"
              draggedClassName="active"
              placeholderClassName="list-group-item-secondary"
              onReorder={onReorder}
              component={ListGroup}>
              {configs.map((config, index) => (
                <ListGroup.Item key={index}>
                  {config.name} {!config.enable && '(Disabled)'}
                </ListGroup.Item>
              ))}
            </Reorder>
          </>}
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' variant="secondary" onClick={handleClose}>Close</Button>
        <Button type='submit' className="ml-3">Save</Button>
      </Modal.Footer>
    </Form>
  </Modal>
})
ReorderConfigsModal.displayName = 'ReorderConfigsModal'
export default React.memo(ReorderConfigsModal)
