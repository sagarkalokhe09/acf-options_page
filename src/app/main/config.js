import React from "react";
import Batch from "./batch";
import Action from "./action";
import { DropdownToggle } from "../components/dropdown";
import { ElementUtil } from "@dhruv-techapps/core-common";
import { Card, Form, Row, Col, Dropdown, InputGroup, FormControl } from "react-bootstrap";
import { ReactComponent as ThreeDotsVertical } from "bootstrap-icons/icons/three-dots-vertical.svg";

const Config = ({ configs, selected, setConfigs }) => {

  const config = configs[selected];

  const onChange = (e) => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget);
    console.log(name,value)
    setConfigs(configs => configs.map((config, index) => {
      if (index === selected) {
        return { ...configs[selected], [name]: value };
      }
      return config;
    }));
  };

  return <>
    <Form>
      <Card className="mb-3">
        <Card.Header as="h5">
          <Row>
            <Col className="d-flex align-items-center">
              <a target="_blank" rel="noopener noreferrer" href="https://getautoclicker.com/docs/configuration">Configuration</a>
            </Col>
            <Col md="auto" className="d-flex align-items-center">
              <Form.Check type="switch" name="enable" id="config-enable" label="Enable" checked={config.enable} onChange={onChange} />
              <Dropdown className="ml-3" alignRight={true}>
                <Dropdown.Toggle as={DropdownToggle}>
                  <ThreeDotsVertical width="24" height="24" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Export</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Import</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Card.Header>
        {config.enable && <Card.Body>
          <Row>
            <Col md="5" sm="12">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="config-name">Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={config.name || ''} name="name" onChange={onChange} placeholder="getautoclicker.com" aria-label="getautoclicker.com" aria-describedby="config-name" />
              </InputGroup>
            </Col>
            <Col md="7" sm="12">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="config-url">URL</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={config.url || ''} name="url" onChange={onChange} placeholder="https://getautoclicker.com/" aria-label="https://getautoclicker.com/" aria-describedby="config-url" />
              </InputGroup>
            </Col>
            <Col md="5" sm="12">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="config-init-wait">Init Wait</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={config.initWait || ''} data-type="number" name="initWait" onChange={onChange} placeholder="0" aria-label="0" aria-describedby="config-init-wait" />
              </InputGroup>
            </Col>
            <Col md="7" sm="12">
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="config-start-time">Start Time</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={config.startTime || ''} name="startTime" onChange={onChange} placeholder="hh:mm:ss" aria-label="hh:mm:ss" aria-describedby="config-start-time" />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>}
      </Card>
    </Form>
    {config.enable &&
      <>
        <Batch batch={config.batch} selected={selected} setConfigs={setConfigs} />
        <Action actions={config.actions} setConfigs={setConfigs} />
      </>
    }
  </>;
};
export default Config;