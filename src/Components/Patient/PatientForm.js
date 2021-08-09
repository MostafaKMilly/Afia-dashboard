/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Container, Breadcrumb, Button, Row, Col, FormLabel, Alert } from 'react-bootstrap'
import { connect } from 'react-redux';
import { Control, Form, Errors } from 'react-redux-form';
import { Link, withRouter } from 'react-router-dom';
import ModalPatient from '../../modals/ModalPatient';
import { actions } from 'react-redux-form'
import { checkPatientEmail, checkPatientUserName, closePatientRegisterDialog, openPatientDialog } from '../../redux/Actions/PatientAction';

function PatientForm(props) {
    const handleSubmit = (values) => {
        props.openModelDialog()
        /* history.push("/dashboard/doctors"); */
    }
    const required = (value) => value && value.length
    const maxLength = (len) => (val) => !(val) || val.length <= len
    const minLength = (len) => (val) => (val) && val.length >= len
    const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i.test(val)
    const isNumber = (val) => !isNaN(Number(val))
    const isPhoneNumber = (val) => val.length === 10
    const isChar = (val) => {
        for (let i of val) {
            if (i === ' ')
                continue
            if (!isNaN(Number(i))) {
                return false
            }
        }
        return true
    }
    const isDateValid = (val) => {
        const dateObj = new Date();
        let myDate = (dateObj.getUTCFullYear()) + "-" + +(dateObj.getMonth <10 ? '0' : '')+(dateObj.getMonth() + 1)+ "-" + (dateObj.getUTCDate());
        return myDate >= val
    }
    const ErrorAlert = () => {
        if (props.patientRegisterStatus.isPatientAdded === false) {
            return (
                <Alert variant="danger" className="addingAlert" onClose={() => props.closeRegisterDialog()} dismissible>
                    <Alert.Heading>
                        Error
                    </Alert.Heading>
                    <p>
                        {props.patientRegisterStatus.errMess}
                    </p>
                </Alert>
            )
        }
        else if (props.patientRegisterStatus.isPatientAdded) {
            return (
                <Alert variant="success" className="addingAlert " onClose={() => props.closeRegisterDialog()} dismissible>
                    <Alert.Heading>
                        Success
                    </Alert.Heading>
                    <p>
                        Patient adding successfully into database
                    </p>
                </Alert>)
        }
        else {
            return <></>
        }
    }
    return (
        <div className="mt-2">
            <ModalPatient data={props.patientForm} />
            <Breadcrumb>
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to="/dashboard">
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    <Link to='/dashboard/patients'>Patients</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="mr-auto" href="#">
                    Add Patient
                </Breadcrumb.Item>
                <Button className="d-md-inline-block d-none" onClick={() => {
                    props.resetForm()
                    props.closeRegisterDialog()
                }} style={{
                    "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                    "marginBottom": "-13px", "marginRight": "18px"
                }}><span className="fa fa-trash-alt"></span></Button>
            </Breadcrumb>
            <Container fluid >
                <div className="pageContainer">
                    <Row className="mb-4">
                        <Col md={12} className="mb-4">
                            <h5>Add Patient</h5>
                        </Col>
                        <ErrorAlert />
                        <Col md={12}>
                            <Form model="patientForm" className="p-4" onSubmit={(values) => handleSubmit(values)}>
                                <div className="separator d-flex d-md-none mb-2">
                                    Patient Name
                                </div>
                                <Row className="form-group g-2">
                                    <Col md={2}>
                                        <FormLabel>Patient Name :</FormLabel>
                                    </Col>
                                    <Col md={3}>
                                        <Control.text name="firstName" model=".firstName" className="form-control"
                                            placeholder="First Name"
                                            validators={{
                                                required, isChar, maxLength: maxLength(15), minLength: minLength(3)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".firstName" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 3 ",
                                                maxLength: "Must be smaller than 15 "
                                            }}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Control.text name="middleName" model=".middleName" className="form-control"
                                            placeholder="Middle Name" validators={{
                                                required, isChar, maxLength: maxLength(15), minLength: minLength(3)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".middleName" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 3 ",
                                                maxLength: "Must be smaller than 15 "
                                            }}
                                        />
                                    </Col>
                                    <Col md={4} >
                                        <Control.text name="lastName" model=".lastName" className="form-control"
                                            placeholder="Last Name" validators={{
                                                required, isChar, maxLength: maxLength(15), minLength: minLength(3)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".lastName" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 3 ",
                                                maxLength: "Must be smaller than 15 "
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <div className="separator d-flex d-md-none mb-2">
                                    Contact Information
                                </div>
                                <Row className="form-group g-2">
                                    <Col md={2}>
                                        <FormLabel>Address :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text name="address" model=".address" className="form-control"
                                            placeholder="Enter Patient Address" validators={{
                                                required , minLength : minLength(8)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".address" show="touched" messages={{
                                                required: 'Required ',
                                                minLength : "Must be greater than 8"
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Phone :</FormLabel>
                                    </Col>
                                    <Col md={4} >
                                        <Control.text name="phone" model=".phone" className="form-control"
                                            placeholder="Enter Patient Phone Number" validators={{
                                                required, isPhoneNumber, isNumber
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".phone" show="touched" messages={{
                                                required: 'Required ',
                                                isPhoneNumber: 'Phone Number is invalid ',
                                                isNumber: "Must be Number"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group g-2">
                                    <Col md={2}>
                                        <FormLabel>Home Number :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text name="number" model=".number" className="form-control"
                                            placeholder="Enter Patient Home number" validators={{
                                                required, isNumber , minLength : minLength(6)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".number" show="touched" messages={{
                                                required: 'Required ',
                                                isNumber: "Must be Number" ,
                                                minLength : "Must be greater than 6"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <div className="separator d-flex d-md-none mb-2">
                                    Personal Information
                                </div>
                                <Row className="form-group g-2">
                                    <Col md={2}>
                                        <FormLabel>Gender</FormLabel>
                                    </Col>
                                    <Col md={4} >
                                        <Control.select name="gender" model=".gender" className="form-select"
                                            validators={{
                                                required,
                                            }}
                                        >
                                            <option selected>Choose gender</option>
                                            <option>male</option>
                                            <option>female</option>
                                        </Control.select>
                                        <Errors
                                            className="text-danger" model=".gender" show="touched" messages={{
                                                required: 'Required ',
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        Birthday :
                                    </Col>
                                    <Col md={4}>
                                    <Control type="date" name="birthday" model=".birthday" className="form-control"
                                            validators={{
                                                required,isDateValid
                                            }}
                                       />
                                        <Errors
                                            className="text-danger" model=".birthday" show="touched" messages={{
                                                required: 'Required ',
                                                isDateValid : "Date Must be valid"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group g-2">
                                    <Col md={2}>
                                        <FormLabel>Length :</FormLabel>
                                    </Col>
                                    <Col md={4} >
                                        <Control.text name="length" model=".length" className="form-control"
                                            validators={{
                                                required,maxValue : (val) => val < 220 , minValue : (val) => val>3 
                                            }}
                                        />
                                        
                                        <Errors
                                            className="text-danger" model=".length" show="touched" messages={{
                                                required: 'Required ',
                                                maxValue : "Value must under 220m" ,
                                                minValue : "Value must be above 3m"
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Weight :</FormLabel>
                                    </Col>
                                    <Col md={4} >
                                        <Control.text name="weight" model=".weight" className="form-control"
                                            validators={{
                                                required,maxValue : (val) => val < 300 , minValue : (val) => val>10 
                                            }}
                                        />
                                        
                                        <Errors
                                            className="text-danger" model=".weight" show="touched" messages={{
                                                required: 'Required ',
                                                maxValue : "Value must under 300g" ,
                                                minValue : "Value must be above 10kg"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                
                                <div className="separator d-flex d-md-none mb-2">
                                    Account Information
                                </div>
                                <Row className="form-group g-2">
                                <Col md={2}>
                                        <FormLabel>Email :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text type="email" name="email" model=".user.email" className="form-control"
                                            placeholder="Enter Patient Email"
                                            onChange = {(e) => {props.changeEmail(e); props.checkPatientEmail(e.target.value)}}
                                            validators={{
                                                required, validEmail , reversed : () => props.patientRegisterStatus.isEmailValid
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".user.email" show="touched" messages={{
                                                required: 'Required ',
                                                validEmail: 'Email is invalid',
                                                reversed : "Email is reversed please type another one"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group g-2">
                                    <Col md={2}>
                                        <FormLabel>User Name :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text type="text" name="username" model=".user.username" className="form-control"
                                            placeholder="Enter Username" onChange={(e) => {
                                                props.changeUserName(e);
                                                props.checkPatientUsername(e.target.value)
                                            }} validators={{
                                                required, reversed: () => props.patientRegisterStatus.isUserNameValid
                                                , minLength : minLength(5) , maxLength : maxLength(20)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".user.username" show="touched" messages={{
                                                required: 'Required ',
                                                reversed: 'Username is Reverse please type another one',
                                                minLength : "Must be greater than 5",
                                                maxLength : "Must be greater than 20"
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Password :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text type="password" name="password" model=".user.password" className="form-control"
                                            placeholder="Enter Password" validators={{
                                                required, maxLength: maxLength(15), minLength: minLength(8)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".user.password" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 8 ",
                                                maxLength: "Must be smaller than 15 "
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group g-2">
                                    <Col md={{ size: 10, offset: 2 }}>
                                        <Button className="btn2" type="submit">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    patientForm: state.patientForm,
    patientRegisterStatus: state.patientRegisterStatus
})
const mapDispatchToProps = (dispatch) => ({
    openModelDialog: () => dispatch(openPatientDialog()),
    resetForm: () => dispatch(actions.reset('patientForm')),
    closeRegisterDialog: () => dispatch(closePatientRegisterDialog()),
    checkPatientUsername: (userName) => dispatch(checkPatientUserName(userName)),
    changeUserName: (username) => dispatch(actions.change('patientForm.user.username', username)),
    checkPatientEmail: (email) => dispatch(checkPatientEmail(email)),
    changeEmail: (email) => dispatch(actions.change('patientForm.user.email', email))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientForm))