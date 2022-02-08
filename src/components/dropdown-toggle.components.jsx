import React from 'react'
import PropTypes from 'prop-types'
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
export const DropdownToggle = React.forwardRef(({ children, onClick, className }, ref) => {
  const DropdownToggleOnclick = e => {
    e.preventDefault()
    onClick(e)
  }

  return (
    <button type='button' className={`btn border-0 ${className.replace('dropdown-toggle', '')}`} data-toggle='dropdown' ref={ref} onClick={DropdownToggleOnclick}>
      {children}
    </button>
  )
})
DropdownToggle.displayName = 'DropdownToggle'
DropdownToggle.defaultProps = {
  className: ''
}
DropdownToggle.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}