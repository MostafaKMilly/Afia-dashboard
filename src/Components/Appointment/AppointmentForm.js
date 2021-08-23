import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row, FormLabel, FormText, FormControl, Alert } from 'react-bootstrap';
import { actions, Control, Errors, Form } from 'react-redux-form';
import { Link, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../Loading'
import AppointmentBasicInfo from './AppointmentBasicInfo';
import AppointmentAvailableTimes from './AppointmentAvailableTimes';

function AppointmentForm(props) {
    
    const [errMess, setErrMess] = useState()
    if (props.patients.isLoading || props.clinics.isLoading) {
        return <Loading />
    }


    const ErrorAlert = () => {
        if (errMess) {
            return <Alert variant="danger" className="mt-2 mb-1" style={{
             width: "fit-content",
             margin: "0 auto",
             position : "absolute",
             top: "2%",
            transform: "translate(-50% , 0)"
            ,left: "50%"
            ,zIndex: 1
         }} dismissible onClose={() => {
             /* props.resetForm() */
             setErrMess(undefined)
         }}>
             <Alert.Heading>Error !</Alert.Heading>
             {errMess}
         </Alert>
        }
        else {
          return <></>
        }
    }
    const SuccessAlert = () => {
        if (props.appointmentForm.successMessage) {
            return <Alert variant="success" className="mt-2 mb-1" style={{
             width: "fit-content",
             margin: "0 auto",
             position : "absolute",
             top: "2%",
            transform: "translate(-50% , 0)"
            ,left: "50%"
            ,zIndex: 1
         }} dismissible onClose={() => {
             props.clearSuccessMessage()
         }}>
             <Alert.Heading>Success</Alert.Heading>
             {props.appointmentForm.successMessage}
         </Alert>
        }
        else {
          return <></>
        }
    }
    
    return (
        <div className="mt-2">
            <ErrorAlert/>
            <SuccessAlert/>
            <Breadcrumb>
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to="/dashboard">
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    <Link to='/dashboard/appointments'>Appointments</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="mr-auto" href="#">
                    Add appointment
                </Breadcrumb.Item>
                <Button className="d-md-inline-block d-none" onClick={() => {
                    props.resetForm()
                    setErrMess(undefined)
                }} style={{
                    "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                    "marginBottom": "-13px", "marginRight": "18px"
                }}><span className="fa fa-trash-alt"></span></Button>
            </Breadcrumb>
            <Container fluid >
                <div className="pageContainer">
                    <Row className="mb-4">
                        <Col md={12} className="mb-4">
                            <h5>Add appointment</h5>
                        </Col>
                        <Switch>
                                <Route path={`${props.match.path}/availableTimes`} render={() => <AppointmentAvailableTimes  {...props} errMess={errMess} setErrMess={setErrMess}  />} />
                                <Route exact path={`${props.match.path}`} render={() => <AppointmentBasicInfo {...props} errMess={errMess} setErrMess={setErrMess}  />} />
                                <Route path={`${props.match.path}/availableTimes`} render={() => <AppointmentAvailableTimes  {...props} errMess={errMess} setErrMess={setErrMess}  />} />
                                <Redirect exact to="/dashboard" />
                        </Switch>
                    </Row>
                </div>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    patients: state.patients,
    clinics: state.clinics,
    appointmentForm: state.appointmentForm
})

const mapDispatchToProps = (dispatch) => ({
    resetForm: () => dispatch(actions.reset('appointmentForm')),
    clearSuccessMessage : () => dispatch(actions.change('appointmentForm.successMessage' , null))
})


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppointmentForm));