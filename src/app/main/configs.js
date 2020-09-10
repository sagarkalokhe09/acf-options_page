import React, { useEffect, useState } from 'react'
import Config from './config'

import { Row, Col, Button, Form, Dropdown } from 'react-bootstrap'
import { ReactComponent as ThreeDotsVertical } from 'bootstrap-icons/icons/three-dots-vertical.svg'

import { defaultConfig, LocalStorageKey } from '@dhruv-techapps/acf-common'
import { LocalStorage, ElementUtil } from '@dhruv-techapps/core-common'
import { Loading } from '@dhruv-techapps/core-components'

import { DropdownToggle } from '../components/dropdown'
import { getConfigName } from '../util/helper'

const Configs = ({ toastRef }) => {
  const [configs, setConfigs] = useState([defaultConfig])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setConfigs(LocalStorage.getItem(LocalStorageKey.CONFIGS, [defaultConfig]))
    setLoading(false)
  }, [])

  useEffect(() => {
    LocalStorage.setItem(LocalStorageKey.CONFIGS, configs)
  }, [configs])

  const onChange = (e) => {
    setSelected(ElementUtil.getValue(e.currentTarget, { selected: selected }))
  }

  const addConfig = () => {
    const name = getConfigName(undefined, configs.length)
    setConfigs([...configs, Object.assign({}, defaultConfig, { name })])
    toastRef.current.push({
      body: `New configuration added successfully ${name}`,
      header: <strong className='mr-auto'>Configuration</strong>,
      bodyClass: 'text-success'
    })
  }

  const removeConfig = () => {
    const name = configs[selected].name
    console.log(configs.filter((_config, index) => index !== selected))
    setLoading(true)
    setConfigs(configs.filter((_config, index) => index !== selected))
    setSelected(selected => configs.length === 2 ? 0 : selected === 0 ? selected : selected - 1)
    setLoading(false)
    toastRef.current.push({
      body: `${name} configuration removed successfully`,
      header: <strong className='mr-auto'>Configuration</strong>,
      bodyClass: 'text-danger'
    })
  }

  const exportAll = () => {
    console.log('export All')
  }

  const importAll = () => {
    console.log('import All')
  }

  return <>
    {loading ? <Loading className='d-flex justify-content-center m-5' />
      : <>
        <Row className='mb-3'>
          <Col>
            <Form>
              <Form.Group controlId='selected' className='mb-0'>
                <Form.Control as='select' custom onChange={onChange}>
                  {configs.map((config, index) => <option key={index} value={index}>{config.name}</option>)}
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col md='auto' className='d-flex align-items-center'>
            <Button type='button' variant='success' onClick={addConfig}>Add Configuration</Button>
            <Dropdown className='ml-3 mr-3' alignRight>
              <Dropdown.Toggle as={DropdownToggle} id='dropdown-basic'>
                <ThreeDotsVertical width='24' height='24' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={exportAll}>Export All</Dropdown.Item>
                <Dropdown.Item onClick={importAll}>Import All</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={removeConfig} className={configs.length === 1 ? 'text-muted' : 'text-danger'} disabled={configs.length === 1}>Remove Configuration</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Config configs={configs} selected={selected} toastRef={toastRef} setConfigs={setConfigs} />
      </>}
  </>
}
Configs.propTypes = {
  toastRef: Config.propTypes.toastRef
}
export default Configs
