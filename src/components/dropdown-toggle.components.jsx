import React from 'react'
import PropTypes from 'prop-types'
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
export const DropdownToggle = React.forwardRef(({ children, onClick, className, ariaLabel }, ref) => {
  const DropdownToggleOnclick = e => {
    e.preventDefault()
    onClick(e)
  }

  return (
    <button type='button' aria-label={ariaLabel} className={`btn border-0 ${className.replace('dropdown-toggle', '')}`} data-toggle='dropdown' ref={ref} onClick={DropdownToggleOnclick}>
      {children}
    </button>
  )
})
DropdownToggle.displayName = 'DropdownToggle'
DropdownToggle.defaultProps = {
  className: '',
  ariaLabel: ''
}
DropdownToggle.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string
}
