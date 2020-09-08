import React, { Dispatch, SetStateAction } from "react";
import { Card, Row, Col, Dropdown, Button } from "react-bootstrap";
import { ReactComponent as FilterRight } from "bootstrap-icons/icons/filter-right.svg";
import { DropdownToggle } from "../components/dropdown";
import ActionTable from "./action/table.js";

const Action = ({ actions, setConfigs }) => {


  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    console.log(rowIndex, columnId, value);
  };

  return <Card>
    <Card.Header as="h5">
      <Row>
        <Col className="d-flex align-items-center">
          <a target="_blank" rel="noopener noreferrer" href="https://getautoclicker.com/docs/action">Action</a>
        </Col>
        <Col md="auto" className="d-flex align-items-center">
          <Button variant="success">ADD ACTION</Button>
          <Dropdown alignRight={true} className="ml-2">
            <Dropdown.Toggle as={DropdownToggle}>
              <FilterRight width="28" height="28" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Name</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Init Wait</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Repeat &amp; R-interval</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <ActionTable actions={actions} updateMyData={updateMyData} />
    </Card.Body>
  </Card >;

};

export default Action;