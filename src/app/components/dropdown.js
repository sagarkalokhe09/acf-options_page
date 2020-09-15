import React from 'react'
import PropTypes from 'prop-types'
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
export const DropdownToggle = React.forwardRef(({ children, onClick }, ref) => {
  const DropdownToggleOnclick = (e) => {
    e.preventDefault()
    onClick(e)
  }

  return <button type='button' className='btn p-1' data-toggle='dropdown' ref={ref} onClick={DropdownToggleOnclick}>{children}</button>
})
DropdownToggle.displayName = 'ParDropdownToggleagraph'
DropdownToggle.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired
}
