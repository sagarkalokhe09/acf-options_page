import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap'
import Reorder, { reorder } from 'react-reorder'
import { StorageService } from '@dhruv-techapps/core-services'
import { useTranslation } from 'react-i18next'
import { LOCAL_STORAGE_KEY, defaultConfig } from '@dhruv-techapps/acf-common'
import { ErrorAlert } from '../components'
import { dataLayerModel } from '../util/data-layer'

const ReorderConfigsModal = forwardRef((_, ref) => {
  const [configs, setConfigs] = useState([])
  const [error, setError] = useState()
  const [show, setShow] = useState(false)
  const { t } = useTranslation()
  const onSubmit = e => {
    e.preventDefault()
    StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.CONFIGS]: configs })
      .then(() => {
        setShow(false)
        window.location.reload()
      })
      .catch(setError)
  }

  useImperativeHandle(ref, () => ({
    showReorder() {
      StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.CONFIGS)
        .then(result => {
          setConfigs(
            (result.configs || [{ ...defaultConfig, name: '' }]).map((prevConfig, prevConfigIndex) => {
              if (!prevConfig.name) {
                const url = prevConfig.url.split('/')
                prevConfig.name = url[2] || `config-${prevConfigIndex}`
              }
              return prevConfig
            })
          )
        })
        .catch(setError)
      setShow(true)
    }
  }))

  const handleClose = () => {
    dataLayerModel('reorder-configs', 'close')
    setShow(false)
  }

  const onReorder = (event, previousIndex, nextIndex) => {
    setConfigs(reorder(configs, previousIndex, nextIndex))
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose} scrollable onShow={() => dataLayerModel('reorder-configs', 'open')}>
      <Form onSubmit={onSubmit} id='reorder-configs'>
        <Modal.Header>
          <Modal.Title as='h6'>{t('modal.reorder.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          <ErrorAlert error={error} />
          <p className='text-muted'>{t('modal.reorder.hint')}</p>
          <div className='list-group'>
            <Reorder reorderId='configurations' draggedClassName='active' placeholderClassName='list-group' onReorder={onReorder}>
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
          </div>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='button' variant='outline-primary px-5' onClick={handleClose}>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='primary px-5' className='ml-3' id='reorder-configs-button'>
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
