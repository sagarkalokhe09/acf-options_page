import React, { useEffect, useState } from 'react'
import { Service, StorageService } from '@dhruv-techapps/core-services'
import { Button, Form, Image } from 'react-bootstrap'
import { LOCAL_STORAGE_KEY, RESPONSE_CODE, RUNTIME_MESSAGE_ACF } from '@dhruv-techapps/acf-common'
import PropTypes from 'prop-types'

function SettingDiscord({ onChange, label, checked }) {
  const [discord, setDiscord] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    StorageService.get(window.EXTENSION_ID, LOCAL_STORAGE_KEY.DISCORD)
      .then(({ discord: result }) => {
        if (result) {
          setDiscord(result)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const connect = async () => {
    const response = await Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.DISCORD_LOGIN, login: true })
    if (response !== RESPONSE_CODE.ERROR) {
      setDiscord(response)
    }
  }

  const remove = async () => {
    const response = await Service.message(window.EXTENSION_ID, { action: RUNTIME_MESSAGE_ACF.DISCORD_LOGIN, remove: true })
    if (response === RESPONSE_CODE.REMOVED) {
      setDiscord()
    }
  }

  if (loading) {
    return null
  }

  if (discord) {
    return (
      <div>
        <div className='d-flex align-items-center'>
          <Image
            alt={discord.displayName}
            className='me-2'
            title={discord.displayName}
            src={`https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`}
            roundedCircle
            width='30'
            height='30'
          />
          {discord.username}
          <Button variant='link' onClick={remove}>
            (remove)
          </Button>
        </div>
        <Form.Check type='switch' onChange={onChange} checked={checked} name='discord' label={label} />
      </div>
    )
  }

  return <Button onClick={connect}>Connect with discord</Button>
}

SettingDiscord.displayName = 'SettingDiscord'
SettingDiscord.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
export { SettingDiscord }
