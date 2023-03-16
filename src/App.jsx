/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ManifestService } from '@dhruv-techapps/core-services'
import { Col, Container, Row } from 'react-bootstrap'
import Header from './app/header'
import Footer from './app/footer'
import Configs from './app/configs/configs'
import { ToastHandler, ErrorAlert, ExtensionNotFound } from './components'
import { AdsBlockerModal, BlogModal, ConfirmModal } from './modal'
import { ModeProvider, ThemeProvider } from './_providers'
import { APP_NAME } from './constants'

const EXTENSION_NOT_FOUND = 'extension_not_found'

function App() {
  const toastRef = useRef()
  const blogRef = useRef()
  const confirmRef = useRef()
  const adsBlockerModal = useRef()
  const [loading, setLoading] = useState(true)
  const [manifest, setManifest] = useState({})
  const [error, setError] = useState()

  useEffect(() => {
    ManifestService.values(window.EXTENSION_ID, ['name', 'version'])
      .then(data => {
        setManifest(data)
      })
      .catch(_error => {
        if (_error.message === 'Could not establish connection. Receiving end does not exist.' || _error.message === "Cannot read properties of undefined (reading 'sendMessage')") {
          setError({ message: EXTENSION_NOT_FOUND })
        } else {
          setError(_error.message)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (/(DEV|BETA)/.test(process.env.REACT_APP_VARIANT)) {
      window.document.title = `${APP_NAME} [${process.env.REACT_APP_VARIANT}]`
    } else {
      window.document.title = APP_NAME
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (!window.adsLoaded) {
        adsBlockerModal.current.show()
      }
    }, 1000)
  })

  const REGEX_RANGE_STRING = '{6,12}'
  const REGEX_STRING = '{6}'

  if (loading) {
    return (
      <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', color: '#712cf9' }}>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <ThemeProvider>
        <ModeProvider>
          <div>
            <Suspense fallback='loading'>
              <Header error={error} confirmRef={confirmRef} />
              {error ? (
                <Container className='d-flex align-items-center justify-content-center pt-5' style={{ minHeight: 'calc(100vh - 330px)' }}>
                  <Row>
                    <Col xs={12}>{error.message === EXTENSION_NOT_FOUND ? <ExtensionNotFound /> : <ErrorAlert message={error} />}</Col>
                  </Row>
                </Container>
              ) : (
                <Configs toastRef={toastRef} blogRef={blogRef} confirmRef={confirmRef} />
              )}
              <Footer version={manifest.version || ''} />
              <ToastHandler ref={toastRef} />
              <ConfirmModal ref={confirmRef} />
              <BlogModal ref={blogRef} />
              <AdsBlockerModal ref={adsBlockerModal} />
            </Suspense>
            <datalist id='retry'>
              <option value='-2'>&infin; Infinity</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
            </datalist>
            <datalist id='recheck'>
              <option value='-2'>&infin; Infinity</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
            </datalist>
            <datalist id='repeat'>
              <option value='-2'>&infin; Infinity</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
            </datalist>
            <datalist id='interval'>
              <option value='0.25'>0.25</option>
              <option value='1'>1</option>
              <option value='1e5'>1e5</option>
            </datalist>
            <datalist id='start-time'>
              <option value='01:00:00:000'>at afternoon 1 AM</option>
              <option value='00:00:00:000'>at midnight 12 AM</option>
              <option value='13:00:00:000'>at afternoon 1 PM</option>
              <option value='15:15:15:150'>at afternoon 3 PM and 15 mins and 15 seconds and 15 milliseconds</option>
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
              <option value='Copy::'>Copy::</option>
              <option value='Copy::[\d]+'>Copy::[\d]+</option>
              <option value='Copy::[\w]+'>Copy::[\w]+</option>
              <option value='Copy::[a-z]{3}'>Copy::[\w]+</option>
              <option value='Copy::[A-Z]{6}'>Copy::[\w]+</option>
              <option value='Copy::[.]{6}'>Copy::[\w]+</option>
              <option value='Paste::'>Paste::</option>
              <option value='Paste::at(5)'>Paste::at(5)</option>
              <option value='Paste::charAt(4)'>Paste::charAt(4)</option>
              <option value='Paste::concat("World")'>Paste::concat(&quot;World&quot;)</option>
              <option value='Paste::replace("apple", "orange")'>Paste::replace(&quot;apple&quot;, &quot;orange&quot;)</option>
              <option value='Paste::replaceAll("apple", "orange")'>Paste::replaceAll(&quot;apple&quot;, &quot;orange&quot;)</option>
              <option value='Paste::slice(31)'>Paste::slice(31)</option>
              <option value='Paste::substring(1, 3)'>Paste::substring(1, 3)</option>
              <option value='Paste::substring(3)'>Paste::substring(3)</option>
              <option value='Paste::toLowerCase()'>Paste::toLowerCase()</option>
              <option value='Paste::toUpperCase()'>Paste::toUpperCase()</option>
              <option value='Paste::trim()'>Paste::trim()</option>
              <option value='Paste::trimStart()'>Paste::trimStart()</option>
              <option value='Paste::trimEnd()'>Paste::trimEnd()</option>
              <option value='<random[.]{6}>'>&lt;random[.]{REGEX_STRING}&gt;</option>
              <option value='<random[.]{6,12}>'>&lt;random[.]{REGEX_RANGE_STRING}&gt;</option>
              <option value='<random[a-z]{6}>'>&lt;random[a-z]{REGEX_STRING}&gt;</option>
              <option value='<random[A-Z]{6}>'>&lt;random[A-Z]{REGEX_STRING}&gt;</option>
              <option value='<random[\d]{6}>'>&lt;random[\d]{REGEX_STRING}&gt;</option>
              <option value='<random[\w]{6}>'>&lt;random[\w]{REGEX_STRING}&gt;</option>
              <option value='<random[custom-string]{6}>'>&lt;random[custom-string]{REGEX_STRING}&gt;</option>
              <option value='ScrollTo::TopLeft'>ScrollTo::TopLeft</option>
              <option value='ScrollTo::TopRight'>ScrollTo::TopRight</option>
              <option value='ScrollTo::BottomLeft'>ScrollTo::BottomLeft</option>
              <option value='ScrollTo::BottomRight'>ScrollTo::BottomRight</option>
              <option value='TouchEvents::touchstart'>TouchEvents::touchstart</option>
              <option value='TouchEvents::touchend'>TouchEvents::touchend</option>
              <option value='TouchEvents::touchmove'>TouchEvents::touchmove</option>
              <option value='TouchEvents::touchcancel'>TouchEvents::touchcancel</option>
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
              <option value='example<batchCount>@gmail.com'>example&lt;batchCount&gt;@gmail.com</option>
              <option value='LocationCommand::reload'>LocationCommand::reload</option>
              <option value='LocationCommand::href::url'>LocationCommand::href::url</option>
              <option value='LocationCommand::replace::url'>LocationCommand::replace::url</option>
              <option value='LocationCommand::assign::url'>LocationCommand::assign::url</option>
              <option value='LocationCommand::open::https://getautoclicker.com'>LocationCommand::open::https://getautoclicker.com</option>
              <option value='WindowCommand::close'>WindowCommand::close</option>
              <option value='WindowCommand::open::https://getautoclicker.com'>WindowCommand::open::https://getautoclicker.com</option>
              <option value='WindowCommand::delete'>WindowCommand::delete</option>
              <option value='WindowCommand::selectAll'>WindowCommand::selectAll</option>
              <option value='Attr::set::prop::value'>Attr::set::prop::value</option>
              <option value='Attr::remove::prop'>Attr::remove::prop</option>
              <option value='Class::add::className'>Class::add::className</option>
              <option value='Class::remove::className'>Class::remove::className</option>
              <option value='KeyboardEvents::'>KeyboardEvents::</option>
              <option value='KeyboardEvents::Enter'>KeyboardEvents::Enter</option>
              <option value='KeyboardEvents::Shift+Enter'>KeyboardEvents::Shift+Enter</option>
              <option value='KeyboardEvents::Shift+Alt+Enter'>KeyboardEvents::Shift+Alt+Enter</option>
              <option value='KeyboardEvents::Tab'>KeyboardEvents::Tab</option>
            </datalist>
            <datalist id='valueExtractor'>
              <option value='@id'>To get id attribute of element</option>
              <option value='@class'>To get class attribute of element</option>
              <option value='@data-attr'>To get data attribute of element</option>
              <option value='\d'>extract 1 number</option>
              <option value='\d+'>extract 1 or more number</option>
              <option value='^\d+'>extract 1 or more number from starting of string only</option>
              <option value='\d+$'>extract 1 or more number from ending of string only</option>
              <option value='\d+(\.\d)*'>extract decimal number 29.99</option>
              <option value='\d{2}'>extract only first two number 29</option>
              <option value='\d{2}-\d{2}-\d{4}'>extract in following format 28-02-2021</option>
            </datalist>
          </div>
        </ModeProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
