import React from "react";


interface DropdownToggleInput {
  children: React.ReactNode,
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
export const DropdownToggle = React.forwardRef(({ children, onClick }: DropdownToggleInput, ref: React.Ref<HTMLButtonElement>) => {

  const DropdownToggleOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick(e);
  }

  return <button type="button" className="btn p-1" data-toggle="dropdown" ref={ref} onClick={DropdownToggleOnclick}>    {children}  </button>;
})