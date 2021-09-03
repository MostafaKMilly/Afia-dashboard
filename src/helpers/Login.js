/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import { Button, Col, Container, FormLabel, Image, Modal, Nav, Navbar, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchUser } from '../redux/Actions/userActions';
import LoginFailed from './LoginFailed';
import { Control, LocalForm } from 'react-redux-form';


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      showModal: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
  }
  handleChange(event) {
    event.persist();
    const target = event.target
    this.setState({
      [target.name]: target.value
    })
  }
  handleSubmit(values) {
    if (!values.username || !values.password) {
      return
    }
    this.props.fetchUser(values);
    this.nextPath("dashboard")
  }
  handleOpenModal() {
    this.setState({ showModal: true })
  }
  handleCloseModal() {
    this.setState({ showModal: false })
  }
  nextPath(path) {
    this.props.history.push(path)
  }
  render() {
    let errMess;
    if (this.props.user.errMess) {
      errMess = this.props.user.errMess
    }
    return (
      <div>
        <div className="vertical-center">
          <Container>
            <Row style={{ "alignItems": "center" }}>
              <Col md={5} className="p-4">
                <h5>Welocme back</h5>
                <h3 className="mt-2 mb-4">Login to your account</h3>
                <Button variant="link" className="mt-0 mb-0 pb-0 ps-0 pt-0 pe-0 pb-2" onClick={() => this.props.history.push('/home')}>
                  {'< Return to home'}
                </Button>
                {errMess ? <LoginFailed messege={errMess} /> : <></>}
                <LocalForm onSubmit={(values) => this.handleSubmit(values)}
                  style={{ "marginTop": "11px" }}
                >
                  <Row className="form-group">
                    <Col>
                      <Control.text type="text" defaultValue="mostafakmilly" model=".username" name="username"
                        placeholder="Login with username"
                        className="p-4 mb-3 form-control"
                      />
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <Control.text type="password" defaultValue="12345678" name="password" model=".password"
                        placeholder="Password"
                        className="p-4 mb-3 form-control"
                      />
                    </Col>
                  </Row>
                  <Row className=" form-group pl-4">
                    <Col xs={6}>
                      <FormLabel check="true">
                        <Control.checkbox defaultChecked={true} model=".rememberMe" name="rememberMe" className="form-check-input" />
                        Remember me
                      </FormLabel>
                    </Col>
                    <Col xs={6} className="ml-auto text-right">
                      <Button variant="link" className="mt-0 mb-0 pb-0 pt-0 pe-0 pb-2" onClick={() => this.handleOpenModal()}>
                        Forget password ?
                      </Button>
                    </Col>

                  </Row>
                  <Row className="pl-3 pr-3">
                    <Button className="loginBtn m-0 pt-2 pb-3" style={{ "width": "100%" }} type="submit">
                      Login
                    </Button>
                  </Row>
                </LocalForm>
              </Col>
              <Col md={{ size: 6, offset: 1 }} className="d-md-block d-none">
                <Image fluid src={'assets/images/Medical care-bro.svg'}
                  alt="login" className="img-fluid"
                />
              </Col>
            </Row>
            <Modal show={this.state.showModal} onHide={() => this.handleCloseModal()}>
              <Modal.Header closeButton>
                <Modal.Title>Contact Us</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <Image src="assets\images\logo (1).svg" className="mb-2" width="110" height="110" fluid />
                <p>
                  If you forget your password feel free to contact us :)
                </p>
                <div>
                  <span className="fa fa-phone me-2"></span> +963943565925
                </div>
                <div>
                  <span className="fa fa-inbox me-2"></span> mostafamilly6@gmail.com
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.handleCloseModal()}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>

        </div>
        <div className="loginFooter d-md-block d-none">
          <p>© Copyright {new Date().getFullYear()} Afia Clinics</p>
        </div>
      </div>

    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (userInfo) => dispatch(fetchUser(userInfo)),
})

const mapStateToProps = (state) => ({
  doctors: state.doctors,
  clinics: state.clinics,
  user: state.user
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));