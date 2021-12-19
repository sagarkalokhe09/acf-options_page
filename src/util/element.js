import { NUMBER_FIELDS, IN_VALID_CLASS } from './validation'

const getElementProps = e => {
  if (e.target.classList.contains(IN_VALID_CLASS)) {
    return null
  }
  let { value } = e.target
  const { name, type } = e.target
  if (type === 'checkbox') {
    value = e.target.checked
  } else if (typeof value === 'string' && NUMBER_FIELDS.indexOf(name) !== -1 && value.indexOf('e') === -1) {
    value = Number(value)
  }
  if (/\./.test(name)) {
    return name.split('.').reduceRight((o, i) => (typeof o !== 'string' ? { [i]: o } : { [i]: { [o]: value } }))
  }
  return { [name]: value }
}

const updateForm = (formId, data) => {
  const form = document.querySelector(`#${formId}`)
  if (form) {
    Array.from(form.elements).forEach(element => {
      if (element.type === 'radio') {
        element.checked = data[element.name] === element.value
      } else if (element.type !== 'checkbox') {
        element.value = data[element.name] || ''
      }
    })
  }
}

export { getElementProps, updateForm }
