import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Badge, Button, Form, ListGroup, Modal } from 'react-bootstrap'
import { StorageService } from '@dhruv-techapps/core-services'
import { useTranslation } from 'react-i18next'
import { ElementUtil } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY, defaultConfig } from '@dhruv-techapps/acf-common'
import { ErrorAlert } from '../components'
import { GTAG } from '../util'

const RemoveConfigsModal = forwardRef((_, ref) => {
  const [configs, setConfigs] = useState([])
  const [error, setError] = useState()
  const [show, setShow] = useState(false)
  const { t } = useTranslation()
  const onSubmit = () => {
    const filteredConfigs = configs
      .filter(config => !config.checked)
      .map(config => {
        delete config.checked
        return config
      })
    StorageService.setItem(LOCAL_STORAGE_KEY.CONFIGS, filteredConfigs)
      .then(() => {
        setShow(false)
      })
      .catch(setError)
    GTAG.event({ category: 'Remove-Configurations', action: 'Click', label: 'Save' })
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
      GTAG.modalview({ title: 'Remove Configurations', url: window.location.href, path: '/configurations/remove' })
      setShow(true)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Remove Configurations', action: 'Click', label: 'Close' })
  }

  const remove = e => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(
      configs.map((config, index) => {
        if (index === Number(name)) {
          config.checked = value
        }
        return config
      })
    )
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose} scrollable>
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <Modal.Title as='h6'>{t('configuration.removeConfigs')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
          {error ? <ErrorAlert message={error} /> : <p className='text-muted'>This action cant be reverted.</p>}
          <ListGroup>
            {configs.map((config, index) => (
              <ListGroup.Item key={index}>
                <Form.Check
                  type='checkbox'
                  checked={config.checked || false}
                  onChange={remove}
                  className={config.checked && 'text-danger'}
                  name={index}
                  id={`configuration-checkbox-${index}`}
                  label={
                    <>
                      {config.name}
                      {!config.enable && (
                        <Badge pill bg='secondary' className='ms-2'>
                          {t('common.disabled')}
                        </Badge>
                      )}
                    </>
                  }
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='button' variant='outline-primary px-5' onClick={handleClose}>
            {t('common.close')}
          </Button>
          <Button type='submit' variant='danger px-5' className='ml-3'>
            {t('configuration.removeConfigs')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})
RemoveConfigsModal.displayName = 'RemoveConfigsModal'
const memo = React.memo(RemoveConfigsModal)
export { memo as RemoveConfigsModal }
