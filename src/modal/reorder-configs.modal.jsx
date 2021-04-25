import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Alert, Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap'
import Reorder, { reorder } from 'react-reorder'
import { StorageService } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'
import { LOCAL_STORAGE_KEY, defaultConfig } from '@dhruv-techapps/acf-common'
import { ErrorAlert } from '../components'
import { GTAG } from '../util'

const ReorderConfigsModal = forwardRef((_, ref) => {
  const [configs, setConfigs] = useState([])
  const [error, setError] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)

  const onSubmit = () => {
    StorageService.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
      .then(() => {
        setShow(false)
      })
      .catch(setError)
      .finally(() => setLoading(false))
    GTAG.event({ category: 'Reorder-Configurations', action: 'Click', label: 'Save' })
  }

  useImperativeHandle(ref, () => ({
    showReorder() {
      StorageService.getItem(LOCAL_STORAGE_KEY.CONFIGS, [{ ...defaultConfig, name: '' }])
        .then(prevConfigs => {
          setConfigs(
            prevConfigs.map((prevConfig, prevConfigIndex) => {
              if (!prevConfig.name) {
                const url = prevConfig.url.split('/')
                prevConfig.name = url[2] || `config-${prevConfigIndex}`
              }
              return prevConfig
            })
          )
        })
        .catch(setError)
        .finally(() => setLoading(false))
      GTAG.modalview({ title: 'Reorder Configurations', url: window.location.href, path: '/configurations/reorder' })
      setShow(true)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Reorder Configurations', action: 'Click', label: 'Close' })
  }

  const onReorder = (event, previousIndex, nextIndex) => {
    setConfigs(reorder(configs, previousIndex, nextIndex))
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose} scrollable>
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <Modal.Title>Reorder Configurations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Loading className='d-flex justify-content-center m-5' />
          ) : (
            <>
              {error && <ErrorAlert message={error} />}
              <Alert variant='warning'>Please save all configurations before reordering</Alert>
              <Reorder reorderId='configurations' draggedClassName='active' placeholderClassName='list-group-item-secondary' onReorder={onReorder} component={ListGroup}>
                {configs.map((config, index) => (
                  <ListGroup.Item key={index}>
                    {config.name}{' '}
                    {!config.enable && (
                      <Badge pill variant='danger font-weight-light'>
                        Disabled
                      </Badge>
                    )}
                  </ListGroup.Item>
                ))}
              </Reorder>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='button' variant='outline-secondary' onClick={handleClose}>
            Close
          </Button>
          <Button type='submit' variant='outline-primary' className='ml-3'>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})
ReorderConfigsModal.displayName = 'ReorderConfigsModal'
const memo = React.memo(ReorderConfigsModal)
export { memo as ReorderConfigsModal }
