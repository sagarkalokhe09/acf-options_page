import React from 'react'
import PropTypes from 'prop-types'

// Create an editable cell renderer
export const EditableCell = ({ value: initialValue, row: { index }, column: { id }, updateAction }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateAction(index, id, value)
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} className='form-control' onChange={onChange} onBlur={onBlur} />
}

EditableCell.propTypes = {
  value: PropTypes.string,
  row: PropTypes.shape({
    index: PropTypes.number.isRequired
  }),
  column: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  updateAction: PropTypes.func.isRequired
}
