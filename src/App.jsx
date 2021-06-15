/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useRef, useState } from 'react'
import { ManifestService } from '@dhruv-techapps/core-common'
import Header from './app/header'
import Footer from './app/footer'
import { ToastHandler } from './components'
import Configs from './app/configs/configs'
import { ExtensionNotFoundModel } from './modal'
import { GTAG } from './util'
import AuthProvider from './_providers/AuthProvider'
import { AdsBlockerModal } from './modal/ads-blocker.modal'

function App() {
  const toastRef = useRef()
  const extensionNotFoundRef = useRef()
  const adsBlockerRef = useRef()
  const [manifest, setManifest] = useState({})
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    ManifestService.values(['name', 'version'])
      .then(setManifest)
      .catch(error => {
        if (error.message === 'Could not establish connection. Receiving end does not exist.') {
          GTAG.exception({ description: error.message, fatal: true })
          if (extensionNotFoundRef.current) {
            extensionNotFoundRef.current.show()
          }
        }
      })
    setTheme(localStorage.getItem('theme') || 'light')
    window.document.title = process.env.REACT_APP_NAME
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (!window.adsLoaded) {
        adsBlockerRef.current.show()
      }
    }, 1000)
  }, [])

  useEffect(() => {
    document.body.setAttribute('theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <AuthProvider>
      <div>
        <Header toggleTheme={toggleTheme} theme={theme} />
        <Configs toastRef={toastRef} />
        <Footer version={manifest.version || ''} />
        <ToastHandler ref={toastRef} />
        <AdsBlockerModal ref={adsBlockerRef} />
        <ExtensionNotFoundModel ref={extensionNotFoundRef} />
        <datalist id='retry'>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </datalist>
        <datalist id='repeat'>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          <option value='-2'>&infin; Infinity</option>
        </datalist>
        <datalist id='interval'>
          <option value='0.25'>0.25</option>
          <option value='0.5'>0.5</option>
          <option value='0.75'>0.75</option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='1e5'>1e5</option>
        </datalist>
        <datalist id='start-time'>
          <option value='01:00:00:00'>at afternoon 1 AM</option>
          <option value='00:00:00:00'>at midnight 12 AM</option>
          <option value='13:00:00:00'>at afternoon 1 PM</option>
          <option value='15:15:15:15'>at afternoon 3 PM and 15 mins and 15 seconds and 15 milliseconds</option>
        </datalist>
        <datalist id='elementFinder'>
          <option value='#'>#</option>
          <option value='ClassName::'>ClassName::</option>
          <option value='Name::'>Name::</option>
          <option value='TagName::'>TagName::</option>
          <option value='Selector::'>Selector::</option>
          <option value='SelectorAll::'>SelectorAll::</option>
          <option value='//input[@id="element-id"]'>//input[@id=&quot;element-id&quot;]</option>
          <option value='//a[@href]'>//a[@href]</option>
          <option value='//a[@href="url"]'>//a[@href=&quot;url&quot;]</option>
          <option value='//button[contains(@class,"me")]'>//button[contains(@class,&quot;me&quot;)]</option>
          <option value='//button[contains(text(),"Me")]'>//button[contains(text(),&quot;Me&quot;)]</option>
          <option value='//div[substring(text(), 0, 3) >= "50"]'>//div[substring(text(), 0, 3) &gt;= &quot;50&quot;]</option>
          <option value='//button[contains(@class,"me") and contains(text(),"Me")]'>//button[contains(@class,&quot;me&quot;) and contains(text(),&quot;Me&quot;)]</option>
          <option value='//li[contains(text(),"9")]'>//li[contains(text(),&quot;9&quot;)]</option>
          <option value='//li[contains(text(),"9") or contains(text(),"10")][1]'>//li[contains(text(),&quot;9&quot;) or contains(text(),&quot;10&quot;)][1]</option>
          <option value='//option[contains(text(),"9")]'>//option[contains(text(),&quot;9&quot;)]</option>
          <option value='//option[contains(text(),"9") or contains(text(),"10")][1]'>//option[contains(text(),&quot;9&quot;) or contains(text(),&quot;10&quot;)][1]</option>
          <option value='//select[@id="product-size"]/option[2]'>//select[@id=&quot;product-size&quot;]/option[2]</option>
        </datalist>
        <datalist id='value'>
          <option value='Query::param'>Query::param</option>
          <option value='ScrollTo::TopLeft'>ScrollTo::TopLeft</option>
          <option value='ScrollTo::TopRight'>ScrollTo::TopRight</option>
          <option value='ScrollTo::BottomLeft'>ScrollTo::BottomLeft</option>
          <option value='ScrollTo::BottomRight'>ScrollTo::BottomRight</option>
          <option value='MouseEvents::click'>MouseEvents::click</option>
          <option value='MouseEvents::dblclick'>MouseEvents::dblclick</option>
          <option value='MouseEvents::input'>MouseEvents::input</option>
          <option value='MouseEvents::change'>MouseEvents::change</option>
          <option value='MouseEvents::["input","change"]'>MouseEvents::[&quot;input&quot;,&quot;change&quot;]</option>
          <option value='MouseEvents::["mouseover", "mousedown", "mouseup", "click"]'>MouseEvents::[&quot;mouseover&quot;, &quot;mousedown&quot;, &quot;mouseup&quot;, &quot;click&quot;]</option>
          <option value='FormEvents::blur'>FormEvents::blur</option>
          <option value='FormEvents::focus'>FormEvents::focus</option>
          <option value='FormEvents::select'>FormEvents::select</option>
          <option value='FormEvents::clear'>FormEvents::clear</option>
          <option value='FormEvents::remove'>FormEvents::remove</option>
          <option value='FormEvents::submit'>FormEvents::submit</option>
          <option value='KeyEvents::Example Text'>KeyEvents::Example Text</option>
          <option value='KeyEvents::{"value":"Example text","delay":3}'>KeyEvents::&lcub;&quot;value&quot;:&quot;Example text&quot;,&quot;delay&quot;:3&rcub;</option>
          <option value='example<batchRepeat>@gmail.com'>example&lt;batchRepeat&gt;@gmail.com</option>
          <option value='LocationCommand::reload'>LocationCommand::reload</option>
          <option value='LocationCommand::href::url'>LocationCommand::href::url</option>
          <option value='LocationCommand::replace::url'>LocationCommand::replace::url</option>
          <option value='LocationCommand::assign::url'>LocationCommand::assign::url</option>
          <option value='LocationCommand::open::https://getautoclicker.com'>LocationCommand::open::https://getautoclicker.com</option>
          <option value='WindowCommand::close'>WindowCommand::close</option>
          <option value='WindowCommand::open::https://getautoclicker.com'>WindowCommand::open::https://getautoclicker.com</option>
          <option value='WindowCommand::cut'>WindowCommand::cut</option>
          <option value='WindowCommand::copy'>WindowCommand::copy</option>
          <option value='WindowCommand::delete'>WindowCommand::delete</option>
          <option value='WindowCommand::paste'>WindowCommand::paste</option>
          <option value='WindowCommand::selectAll'>WindowCommand::selectAll</option>
          <option value='Attr::set::prop::value'>Attr::set::prop::value</option>
          <option value='Attr::remove::prop'>Attr::remove::prop</option>
          <option value='Class::add::className'>Class::add::className</option>
          <option value='Class::remove::className'>Class::remove::className</option>
        </datalist>
        <datalist id='valueExtractor'>
          <option value='@id'>To get id attribute of element</option>
          <option value='@class'>To get class attribute of element</option>
          <option value='@data-attr'>To get data attribute of element</option>
          <option value='/^(\d+)$/'>extract 1 or more number 299</option>
          <option value='/^(\d+.\d*)$/'>extract decimal number 29.99</option>
          <option value='/^(\d{2})$/'>extract only first two number 29</option>
          <option value='/^(\d{2}-\d{2}-\d{4})$/'>extract in following format 28-02-2021</option>
        </datalist>
      </div>
    </AuthProvider>
  )
}

export default App
