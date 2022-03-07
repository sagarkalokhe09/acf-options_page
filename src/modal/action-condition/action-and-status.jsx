import React from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Form } from 'react-bootstrap'
import { ACTION_CONDITION_OPR, ACTION_STATUS } from '@dhruv-techapps/acf-common'
import { X } from '../../util'
import { getElementProps } from '../../util/element'

function ActionAndStatus({ actions, condition: { actionIndex, status, operator }, updateRef, conditionIndex, setConditions }) {
  const changeOpr = _operator => {
    updateRef.current = true
    setConditions(_conditions =>
      _conditions.map((condition, index) => {
        if (index === conditionIndex) {
          return { ...condition, operator: _operator }
        }
        return condition
      })
    )
  }

  const removeCondition = () => {
    setConditions(_conditions => _conditions.filter((_, index) => conditionIndex !== index))
  }

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      updateRef.current = true
      setConditions(_conditions =>
        _conditions.map((_condition, _index) => {
          if (conditionIndex === _index) {
            return { ..._condition, ...update }
          }
          return _condition
        })
      )
    }
  }
  return (
    <tr>
      <td className='fw-bold'>
        {conditionIndex !== 0 && (
          <ButtonGroup>
            <Button type='button' variant='outline-primary' className={operator === ACTION_CONDITION_OPR.OR && 'active'} onClick={() => changeOpr(ACTION_CONDITION_OPR.OR)}>
              OR
            </Button>
            <Button type='button' variant='outline-primary' className={operator === ACTION_CONDITION_OPR.AND && 'active'} onClick={() => changeOpr(ACTION_CONDITION_OPR.AND)}>
              AND
            </Button>
          </ButtonGroup>
        )}
      </td>
      <td>
        <Form.Select value={actionIndex} onChange={e => onUpdate(e, conditionIndex)} name='actionIndex' required className='flex-grow-1 me-1'>
          <option value=''>~~ SELECT ACTION ~~</option>
          {actions.map((_action, index) => (
            <option key={index} value={index}>
              {index + 1} . {_action.name || _action.elementFinder}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Form.Select value={status} onChange={e => onUpdate(e, conditionIndex)} name='status' required style={{ flexShrink: 2 }}>
          {Object.entries(ACTION_STATUS).map((_status, index) => (
            <option key={index} value={_status[1]}>
              {_status[0]}
            </option>
          ))}
        </Form.Select>
      </td>
      <td>
        <Button type='button' variant='link' className='ms-1 mt-2 p-0 text-danger' aria-label='Close' hidden={conditionIndex === 0} onClick={() => removeCondition(conditionIndex)}>
          <X width='30' height='30' />
        </Button>
      </td>
    </tr>
  )
}

ActionAndStatus.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      elementFinder: PropTypes.string.isRequired,
      name: PropTypes.string
    }).isRequired
  ).isRequired,
  condition: PropTypes.shape({
    actionIndex: PropTypes.number,
    operator: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  updateRef: PropTypes.shape({ current: PropTypes.bool }).isRequired,
  conditionIndex: PropTypes.number.isRequired,
  setConditions: PropTypes.func.isRequired
}
export { ActionAndStatus }
