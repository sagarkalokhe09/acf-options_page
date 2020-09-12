import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

// Create an editable cell renderer
export const EditableCell = ({ value: initialValue, row: { index }, column: { id, required, pattern, dataType }, updateAction }) => {
  // We need to keep and update the state of the cell normally
// We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)
  const [invalid, setInvalid] = React.useState(false)
  const input = useRef()
  const onChange = (e) => {
    setInvalid(false)
    const { value } = e.currentTarget
    if (value) {
      if (pattern && !pattern.test(value)) {
        setInvalid(true)
      }
    } else if (required) {
      setInvalid(true)
    }
    setValue(value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = (e) => {
    const { value } = e.currentTarget
    if (!invalid) {
      updateAction(index, id, dataType === 'number' ? Number(value) : value)
    }
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <Form.Control ref={input} value={value} name={id} onChange={onChange} onBlur={onBlur} isInvalid={invalid} />
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
    id: PropTypes.string.isRequired,
    required: PropTypes.bool,
    pattern: PropTypes.instanceOf(RegExp),
    dataType: PropTypes.string
  }),
  updateAction: PropTypes.func.isRequired
}
