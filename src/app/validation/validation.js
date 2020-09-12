export const numberOnlyVal = (e, length) => {
  const re = /[0-9]+/g
  if (!re.test(e.key)) {
    e.preventDefault()
  }
}

export const floatOnlyVal = (e, length) => {
  const re = /[0-9.]+/g
  if (e.key === '.' && e.target.value.indexOf('.') !== -1) {
    console.log('prevent')
    e.preventDefault()
  } else if (!re.test(e.key)) {
    e.preventDefault()
  }
}

export const nameValidate = e => {
  const re = /[A-z\s]+/g
  if (!re.test(e.key)) {
    e.preventDefault()
  }
}
