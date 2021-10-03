import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Image, Modal, Nav, Tab } from 'react-bootstrap'
import { GTAG, PatchQuestionFill } from '../util'

const AdsBlockerModal = forwardRef((_, ref) => {
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      GTAG.modalview({ title: 'Ads Blocker', url: window.location.href, path: '/adsBlocker' })
      setShow(true)
    }
  }))

  const closeClick = event => {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !window.adsLoaded) {
        setShow(true)
      }
    })
    if (event.isTrusted) setShow(false)
  }

  const refreshClick = () => {
    GTAG.event({ category: 'Ads-Blocker', Config: 'Click', label: 'Refresh' })
    window.location.reload()
  }

  return (
    <Modal show={show} centered backdrop='static' keyboard={false} id='ads-blocker'>
      <Modal.Header className='justify-content-center'>
        <Modal.Title>
          <b>Please allow ads on our site</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='mx-auto'>
        <p className='d-flex justify-content-center'>Which of these extensions do you have?</p>
        <Tab.Container defaultActiveKey='adBlock'>
          <Nav variant='tabs' justify>
            <Nav.Item>
              <Nav.Link eventKey='adBlock' className='d-flex justify-content-center align-items-center flex-column'>
                <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/ab_icon-1.svg' alt='AdBlock' width='40px' />
                <small className='mt-1'>AdBlock</small>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='adBlockPlus' className='d-flex justify-content-center align-items-center flex-column'>
                <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/abp_icon-1.svg' alt='AdBlock Plus' width='40px' />
                <small className='mt-1'>AdBlock Plus</small>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='uBlockOrigin' className='d-flex justify-content-center align-items-center flex-column'>
                <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/uo_icon-1.svg' alt='uBlock Origin' width='40px' />
                <small className='mt-1'>uBlock Origin</small>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='other' className='d-flex justify-content-center align-items-center flex-column'>
                <PatchQuestionFill width='40px' height='40px' />
                <small className='mt-1'>Other</small>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className='p-2'>
            <Tab.Pane eventKey='adBlock'>
              <div className='d-flex justify-content-center pb-4 pt-2'>
                <Image fluid src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/browser_ab-2.png' alt='Browser for the AdBlock extension' width='400px' />
              </div>
              <ol>
                <li>
                  Click the AdBlock icon
                  <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/ab_icon-1.svg' alt='AdBlock' width='20px' className='mx-1' /> in the browser extension area on the upper
                  right-hand corner. (You may see a small number covering part of the icon.)
                </li>
                <li>
                  Select <Button variant='link'>More pause options.</Button>
                </li>
                <li>
                  In the &quot;Don’t run AdBlock on...&quot; dialog box, select{' '}
                  <Button variant='danger' size='sm'>
                    Exclude
                  </Button>
                  . The AdBlock icon changes to a “thumbs up” image.
                </li>
              </ol>
            </Tab.Pane>
            <Tab.Pane eventKey='adBlockPlus'>
              <div className='d-flex justify-content-center pb-4 pt-2'>
                <Image fluid src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/browser_abp-2.png' alt='Browser for the AdBlock extension' width='400px' />
              </div>
              <ol>
                <li>
                  Click the Adblock Plus icon <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/abp_icon-1.svg' alt='AdBlock Plus ' width='20px' className='mx-1' /> in the
                  browser extension area on the upper right-hand corner. (You may see a small number covering part of the icon.)
                </li>
                <li>
                  Click the “power” button
                  <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/abp_power_icon-1.svg' alt='Power icon' width='20px' className='mx-1' /> so that it slides left.
                </li>
                <li>
                  Click the <b>Refresh</b> button.
                </li>
              </ol>
            </Tab.Pane>
            <Tab.Pane eventKey='uBlockOrigin'>
              <div className='d-flex justify-content-center pb-4 pt-2'>
                <Image fluid src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/browser_uo-2.png' alt='Browser for the AdBlock extension' width='400px' />
              </div>
              <ol>
                <li>
                  Click the uBlock Origin icon
                  <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/uo_icon-1.svg' alt='uBlock Origin' width='20px' className='mx-1' />
                  in the browser extension area on the upper right-hand corner. (You may see a small number covering part of the icon.)
                </li>
                <li>
                  Click the “power” button
                  <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/uo_power_icon-1.svg' alt='Power icon' width='20px' className='mx-1' />. It turns gray, indicating that ads
                  on that site are no longer being blocked.
                </li>
                <li>
                  Click the “refresh” button
                  <img src='https://www.gstatic.com/fundingchoices/whitelist/blockers/chrome/uo_refresh_icon-1.svg' alt='Refresh icon' width='20px' className='mx-1' />.
                </li>
              </ol>
            </Tab.Pane>
            <Tab.Pane eventKey='other'>
              <ol>
                <li>
                  Click the icon of the ad blocker extension installed on your browser.
                  <div>You’ll usually find this icon in the upper right-hand corner of your screen. You may have more than one ad blocker installed.</div>
                </li>
                <li>
                  Follow the instructions for disabling the ad blocker on the site you’re viewing.<div>You may have to select a menu option or click a button.</div>
                </li>
                <li>Refresh the page, either by following prompts or clicking your browser’s “refresh” or “reload” button.</li>
              </ol>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer className='justify-content-between'>
        <Button variant='outline-secondary' className='px-3 mr-3' size='md' onClick={closeClick}>
          Close
        </Button>
        <Button variant='outline-primary' className='px-3' size='md' onClick={refreshClick}>
          Refresh
        </Button>
      </Modal.Footer>
    </Modal>
  )
})
AdsBlockerModal.displayName = 'AdsBlockerModal'
export { AdsBlockerModal }
