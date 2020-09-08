import React from "react";
import { Card, Row, Col, Form, InputGroup, FormControl } from "react-bootstrap";


const Batch = ({ batch, setConfigs }) => {
  return <Card className="mb-3">
    <Card.Header as="h5">
      <Row>
        <Col>
          <a target="_blank" rel="noopener noreferrer" href="https://getautoclicker.com/docs/batch">Batch</a>
        </Col>
        <Col md="auto">
          <Form>
            <Form.Check
              type="switch"
              id="batch-refresh"
              label="Refresh"
            />
          </Form>
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <Row>
        <Col md="6" sm="12">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="batch-repeat">repeat</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="0"
              aria-label="0"
              aria-describedby="batch-repeat"
            />
          </InputGroup>
        </Col>
        <Col md="6" sm="12">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="batch-repeat-interval">R-Interval</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="0"
              aria-label="0"
              aria-describedby="batch-repeat-interval"
            />
            <InputGroup.Append>
              <InputGroup.Text id="batch-repeat-interval">sec</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>

    </Card.Body>
  </Card>
}
export default Batch;