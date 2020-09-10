import React from 'react'
import PropTypes from 'prop-types'
import { ElementUtil } from "@dhruv-techapps/core-common"

// Create an editable cell renderer
export const EditableCell = ({ value: initialValue, row: { index }, column: { id, dataType }, updateAction }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e) => {
    setValue(ElementUtil.getValue(e.target))
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateAction(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value || ''} data-type={dataType} name={id} className='form-control' onChange={onChange} onBlur={onBlur} />
}

EditableCell.propTypes = {
  value: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired
  }),
  column: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  updateAction: PropTypes.func.isRequired
}
