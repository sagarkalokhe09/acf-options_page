import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ACTION_CONDITION_OPR, ACTION_RUNNING, defaultActionCondition } from '@dhruv-techapps/acf-common'

import { getElementProps, updateForm } from '../util/element'
import { ActionAndStatus } from './action-condition/action-and-status'
import { Plus } from '../util/svg'
import { dataLayerInput, dataLayerModel } from '../util/data-layer'

const FORM_ID = 'actionCondition'

const ActionConditionModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [conditions, setConditions] = useState([{ ...defaultActionCondition }])
  const [then, setThen] = useState()
  const [goto, setGoto] = useState()
  const [message, setMessage] = useState()
  const actionIndex = useRef(-1)
  const actions = useRef([])
  const allActions = useRef([])
  const updateRef = useRef(false)

  const onUpdate = (e, index) => {
    const update = getElementProps(e)
    if (update) {
      updateRef.current = true
      setConditions(_conditions =>
        _conditions.map((_condition, _index) => {
          if (index === _index) {
            return { ..._condition, ...update }
          }
          return _condition
        })
      )
      dataLayerInput(update, 'action-condition')
    }
  }

  const onUpdateThen = _then => {
    updateRef.current = true
    setThen(_then)
  }

  const onUpdateGoto = e => {
    updateRef.current = true
    setGoto(e.currentTarget.value)
  }

  const handleClose = () => {
    dataLayerModel('action-condition', 'close')
    setShow(false)
  }

  useEffect(() => {
    if (updateRef.current) {
      updateRef.current = false
      setConfigs(configs =>
        configs.map((config, index) => {
          if (index === configIndex) {
            if (!config.actions[actionIndex.current]) {
              config.actions[actionIndex.current] = {}
            }
            config.actions[actionIndex.current].statement = { conditions: [...conditions.map(_condition => ({ ..._condition }))], then, goto }
            return { ...config }
          }
          return config
        })
      )
      setMessage(t('modal.actionCondition.saveMessage'))
      setTimeout(setMessage, 1500)
    }
  }, [conditions, then, goto])

  useEffect(() => {
    if (actionIndex.current !== -1) {
      updateForm(FORM_ID, { then })
    }
  }, [actionIndex.current])

  const onReset = () => {
    updateRef.current = true
    setConditions([{ ...defaultActionCondition }])
    setThen()
    setGoto()
    handleClose()
  }

  useImperativeHandle(ref, () => ({
    showCondition(index, _actions, statement = { conditions: [{}] }) {
      setConditions([...statement.conditions.map(_condition => ({ ..._condition }))])
      setThen(statement.then)
      actions.current = _actions.filter((_, _actionIndex) => _actionIndex < index)
      actionIndex.current = index
      setShow(true)
      allActions.current = _actions
      setGoto(statement.goto)
    }
  }))

  const addCondition = () => {
    setConditions(_conditions => [..._conditions, { ...defaultActionCondition, operator: ACTION_CONDITION_OPR.AND }])
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose} onShow={() => dataLayerModel('action-condition', 'open')}>
      <Modal.Header closeButton>
        <Modal.Title as='h6'>{t('modal.actionCondition.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className='text-muted'>{t('modal.actionCondition.info')}</p>
        <h4 className='text-center mb-3'>IF</h4>
        <Table role='table' className='mb-0'>
          <thead>
            <tr>
              <th>OPR</th>
              <th>Action</th>
              <th>Status</th>
              <th>
                <Button type='button' variant='link' className='mt-2 p-0' aria-label='Add' onClick={() => addCondition()}>
                  <Plus width='30' height='30' />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((_condition, index) => (
              <ActionAndStatus onUpdate={onUpdate} key={index} actions={actions.current} condition={_condition} conditionIndex={index} setConditions={setConditions} updateRef={updateRef} />
            ))}
          </tbody>
        </Table>
        <h4 className='text-center mt-3'>THEN</h4>
        <Form id={FORM_ID}>
          <Row className='mt-3'>
            <Col>
              <Form.Check
                type='radio'
                checked={then === ACTION_RUNNING.SKIP}
                value={ACTION_RUNNING.SKIP}
                onChange={() => onUpdateThen(ACTION_RUNNING.SKIP)}
                name='then'
                label={t('modal.actionCondition.skip')}
              />
            </Col>
            <Col>
              <Form.Check
                type='radio'
                checked={then === ACTION_RUNNING.PROCEED}
                value={ACTION_RUNNING.PROCEED}
                onChange={() => onUpdateThen(ACTION_RUNNING.PROCEED)}
                name='then'
                label={t('modal.actionCondition.proceed')}
              />
            </Col>
            <Col>
              <Form.Check
                type='radio'
                checked={then === ACTION_RUNNING.GOTO}
                value={ACTION_RUNNING.GOTO}
                onChange={() => onUpdateThen(ACTION_RUNNING.GOTO)}
                name='then'
                label={t('modal.actionCondition.goto')}
              />
            </Col>
          </Row>
        </Form>
        {then === ACTION_RUNNING.GOTO && (
          <Row>
            <Col xs={{ span: 4, offset: 8 }}>
              <Form.Select value={goto} onChange={e => onUpdateGoto(e)} name='goto' required>
                {allActions.current.map((_action, index) => (
                  <option key={index} value={index} disabled={index === Number(actionIndex.current)}>
                    {index + 1} . {_action.name || _action.elementFinder}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='outline-primary px-5' onClick={onReset}>
          {t('common.clear')}
        </Button>
        <span className='text-success'>{message}</span>
      </Modal.Footer>
    </Modal>
  )
})

ActionConditionModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
ActionConditionModal.displayName = 'ActionConditionModal'
const memo = React.memo(ActionConditionModal)
export { memo as ActionConditionModal }
