import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap'
import Reorder, { reorder } from 'react-reorder'
import { StorageService } from '@dhruv-techapps/core-services'
import { useTranslation } from 'react-i18next'
import { LOCAL_STORAGE_KEY, defaultConfig } from '@dhruv-techapps/acf-common'
import { ErrorAlert } from '../components'
import { GTAG } from '../util'

const ReorderConfigsModal = forwardRef((_, ref) => {
  const [configs, setConfigs] = useState([])
  const [error, setError] = useState()
  const [show, setShow] = useState(false)
  const { t } = useTranslation()
  const onSubmit = () => {
    StorageService.setItem(LOCAL_STORAGE_KEY.CONFIGS, configs)
      .then(() => {
        setShow(false)
      })
      .catch(setError)
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
          <Modal.Title as='h6'>{t('modal.reorder.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          {error ? <ErrorAlert message={error} /> : <p className='text-muted'>{t('modal.reorder.hint')}</p>}
          <Reorder reorderId='configurations' draggedClassName='active' placeholderClassName='list-group-item-secondary' onReorder={onReorder} component={ListGroup}>
            {configs.map((config, index) => (
              <ListGroup.Item key={index}>
                {config.name}
                {!config.enable && (
                  <Badge pill bg='secondary' className='ms-2'>
                    {t('common.disabled')}
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </Reorder>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='button' variant='outline-primary px-5' onClick={handleClose}>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='primary px-5' className='ml-3'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})
ReorderConfigsModal.displayName = 'ReorderConfigsModal'
const memo = React.memo(ReorderConfigsModal)
export { memo as ReorderConfigsModal }
