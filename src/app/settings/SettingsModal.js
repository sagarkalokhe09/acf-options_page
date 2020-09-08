import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Modal, Form, Card, InputGroup, FormControl, Container, Row, Col } from 'react-bootstrap';
import { defaultSetting, LoadTypeModel, RetryOptionModel, LocalStorageKey } from "@dhruv-techapps/acf-common";
import { ElementUtil, Loading, LocalStorage } from "@dhruv-techapps/core-components";


const SettingsModal = ({ show, handleClose }) => {

  const [settings, setSettings] = useState(defaultSetting);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSettings(LocalStorage.getItem(LocalStorageKey.SETTINGS, defaultSetting));
    setLoading(false);
  }, []);

  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget, settings);
    setSettings({ ...settings, [name]: value });
    LocalStorage.setItem(LocalStorageKey.SETTINGS, { ...settings, [name]: value });
  };


  return <Modal show={show} onHide={handleClose} size="lg" animation={false}>
    <Modal.Header closeButton>
      <Modal.Title>Settings</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {loading ? <Loading className="d-flex justify-content-center m-5" /> :
        <Form>
          <Card className="mb-2">
            <Card.Body>
              <Card.Subtitle>
                <Form.Check id="checkiFrames" checked={settings.checkiFrames} onChange={onChange} label={"Check IFrames"} />
              </Card.Subtitle>
              <Card.Text className="text-muted">
                <small>Check this box if you want to check xPath within iFrames also</small>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Subtitle>
                <Form.Check id="notifications" checked={settings.notifications} onChange={onChange} label={"Show Notification"} />
              </Card.Subtitle>
              <Card.Text className="text-muted">
                <small>This is very important feature of extension which tells you if any error occur in extension while executing or if any XPath provided is not found or wrong. Select this option while configuring and uncheck once you have finished configuring.</small>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body>
              <Card.Subtitle>
                Extension load <Form.Check inline type="radio" name="loadType" id="loadType" value={LoadTypeModel.window} checked={settings.loadType === LoadTypeModel.window} onChange={onChange} label={"Window"} />
                <Form.Check inline type="radio" name="loadType" id="loadType" value={LoadTypeModel.document} checked={settings.loadType === LoadTypeModel.document} onChange={onChange} label={"Document"} />
              </Card.Subtitle>
              <small>
                <ul className="mb-0 mt-2">
                  <li><span className="text-primary">Window</span> (default) browser loads extension once all its content is loaded</li>
                  <li><span className="text-primary">Document</span> browser loads extension before scripts and images are loaded (faster)(unsafe)</li>
                </ul>
              </small>
            </Card.Body>
          </Card>
          <Card className="mb-2 py-3">
            <Container>
              <Row>
                <Col md={6} sm={12} className="mb-2 mb-md-0">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="retry">Retry</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="5" aria-label="5" id="retry" aria-describedby="retry" onChange={onChange} value={settings.retry} />
                  </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="retry-interval">Retry Interval</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="1" aria-label="1" id="retryInterval" aria-describedby="retry-interval" onChange={onChange} value={settings.retryInterval} />
                    <InputGroup.Append>
                      <InputGroup.Text id="retry-interval">sec</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col xs={12}>
                  <h6 className="my-2 text-secondary font-weight-light"><small>* Below are action which can be performed if xpath is not found by extension after retry</small></h6>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type="radio" name="retryOption" id="retryOption" value={RetryOptionModel.Stop} checked={RetryOptionModel.Stop === settings.retryOption} onChange={onChange} label={"Stop"} />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type="radio" name="retryOption" id="retryOption" value={RetryOptionModel.Skip} checked={RetryOptionModel.Skip === settings.retryOption} onChange={onChange} label={"Skip Not Found"} />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type="radio" name="retryOption" id="retryOption" value={RetryOptionModel.Reload} checked={RetryOptionModel.Reload === settings.retryOption} onChange={onChange} label={"Retry Refresh"} />
                </Col>
              </Row>
            </Container>
          </Card>
        </Form>}
    </Modal.Body>
  </Modal>;
};

SettingsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
export default SettingsModal;