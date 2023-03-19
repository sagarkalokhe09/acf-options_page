import React from 'react'

export function Loading() {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ color: '#712cf9' }}>
      <div className='spinner-border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}
