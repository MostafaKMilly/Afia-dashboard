/* eslint-disable react/jsx-pascal-case */
import React, { Component } from 'react';
import { Button, Col, Container, FormLabel, Image, Row } from 'react-bootstrap';
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
      password: "" ,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(event) {
    event.persist();
    const target = event.target
    this.setState({
      [target.name]: target.value
    })
  }
  handleSubmit(values) {
    this.props.fetchUser(values);
    this.nextPath("dashboard")
  }
  nextPath (path) {
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
            <Row style={{"alignItems" :"center"}}>
              <Col md={5} className="p-4">
                <h5>Welocme back</h5>
                <h3 className="mt-2 mb-4">Login to your account</h3>
                {errMess ? <LoginFailed messege={errMess}/> : <></>}
                <LocalForm onSubmit={(values) => this.handleSubmit(values)}
                  style={{ "marginTop": "41px" }}
                >
                  <Row className="form-group">
                    <Col>
                      <Control.text type="text" model=".username" name="username"
                        placeholder="Login with username"
                        className="p-4 mb-3 form-control"
                      />
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col>
                      <Control.text type="password" name="password" model=".password"
                        placeholder="Password"
                        className="p-4 mb-3 form-control"
                      />
                    </Col>
                  </Row>
                  <Row className=" form-group pl-4">
                    <Col xs={6}>
                      <FormLabel check>
                        <Control.checkbox model=".rememberMe" name="rememberMe" className="form-check-input" />
                      Remember me
                    </FormLabel>
                    </Col>
                    <Col xs={6} className="ml-auto text-right">
                      <a href="" color="inherent">
                        Forget password ?
                         </a>
                    </Col>

                  </Row>
                  <Row className="pl-3 pr-3">
                    <Button className="loginBtn m-0 pt-2 pb-3" style={{ "width": "100%" }} type="submit">
                      Login
                 </Button>
                  </Row>
                </LocalForm>
              </Col>
              <Col md={{size :6 , offset :1}} className="d-md-block d-none">
                <Image fluid  src={'assets/images/Medical care-bro.svg'}
                  alt="login" className="img-fluid"
                />
              </Col>
            </Row>
          </Container>

        </div>
        <div className="loginFooter">
          <p>© Copyright 2021 Afia Clinics</p>
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