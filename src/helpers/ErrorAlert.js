import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap';

function ErrorAlert({ messege, color, isButtonVisible }) {
  let visible
  if (isButtonVisible) {
    visible = "visible"
  }
  else {
    visible = "hidden"
  }
  if (!color) {
    color = "#e9ecef"
  }
  return (
    <div className="vertical-center" style={{
      backgroundColor: color
    }}>
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <img src={'assets/images/undraw_server_down_s4lk.svg'}
              alt="login" className="img-fluid"
              style={{
                "height": "130px", "marginBottom": "20px"
              }}
            />
          </Col>
          <Col xs={12} className="text-center lead">
            <p>{messege}</p>
          </Col>

          <Col xs={12} style={{
            "textAlign": "center"
          }}>
            <Button className="btn3" onClick={() => window.location.reload()} style={{
              visibility: visible
            }}>
              Refresh
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default ErrorAlert;