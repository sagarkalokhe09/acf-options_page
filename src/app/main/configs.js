import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Dropdown } from "react-bootstrap";
import { defaultConfig, LocalStorageKey } from "@dhruv-techapps/acf-common";
import { LocalStorage, Loading, ElementUtil } from "@dhruv-techapps/core-components";

import { ReactComponent as ThreeDotsVertical } from "bootstrap-icons/icons/three-dots-vertical.svg";
import Config from "./config";
import { DropdownToggle } from "../components/dropdown";
import { getConfigName } from "../util/helper";

const Colors = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  LIGHT: 'light',
  DARK: 'dark',
};

const defaultColors = [
  Colors.PRIMARY,
  Colors.SECONDARY,
  Colors.SUCCESS,
  Colors.DANGER,
  Colors.WARNING,
  Colors.INFO,
  Colors.LIGHT,
  Colors.DARK,
];

const Configs = () => {


  console.log(Loading)
  console.log(Button)

  const [configs, setConfigs] = useState([defaultConfig]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setConfigs(LocalStorage.getItem(LocalStorageKey.CONFIGS, [defaultConfig]));
    setLoading(false);
  }, []);

  const onChange = (e) => {
    setSelected(ElementUtil.getValue(e.currentTarget, { "selected": selected }));
  };

  const addConfig = () => {
    setConfigs([defaultConfig, ...configs]);
  };

  const exportAll = () => {
    console.log("export All");
  };

  const importAll = () => {
    console.log("import All");
  };

  return <main>
    <Container>
      {loading ? <Loading className="d-flex justify-content-center m-5" interval={500} colors={defaultColors} children={<div></div>} /> :
        <>
          <Row className="mb-3">
            <Col>
              <Form>
                <Form.Group controlId="selected" className="mb-0">
                  <Form.Control as="select" custom onChange={onChange}>
                    {configs.map((config, index) => <option key={index} value={index}>{config.name || getConfigName(config.url, index)}</option>)}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Col>
            <Col md="auto" className="d-flex align-items-center">
              <Button type="button" variant='success' onClick={addConfig}>ADD CONFIG</Button>
              <Dropdown className="ml-3 mr-3" alignRight={true}>
                <Dropdown.Toggle as={DropdownToggle} id="dropdown-basic">
                  <ThreeDotsVertical width="24" height="24" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={exportAll}>Export All</Dropdown.Item>
                  <Dropdown.Item onClick={importAll}>Import All</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
         {/* <Config configs={configs} selected={selected} setConfigs={setConfigs} />*/}
        </>
      }
    </Container>
  </main>;
};
export default Configs;