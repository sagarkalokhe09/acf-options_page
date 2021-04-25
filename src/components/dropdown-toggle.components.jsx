import React from 'react'
import PropTypes from 'prop-types'
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
export const DropdownToggle = React.forwardRef(({ children, onClick, id }, ref) => {
  const DropdownToggleOnclick = e => {
    e.preventDefault()
    onClick(e)
  }

  return (
    <button type='button' className='py-0 border-0' aria-label={id} data-toggle='dropdown' ref={ref} onClick={DropdownToggleOnclick}>
      {children}
    </button>
  )
})
DropdownToggle.displayName = 'DropdownToggle'
DropdownToggle.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}
