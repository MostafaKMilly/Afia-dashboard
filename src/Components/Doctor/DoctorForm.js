/* eslint-disable react/jsx-pascal-case */
import React, { useState } from 'react';
import { Container, Breadcrumb, Button, Row, Col, FormLabel, Alert } from 'react-bootstrap'
import { connect } from 'react-redux';
import { Control, Form, Errors } from 'react-redux-form';
import { Link, withRouter } from 'react-router-dom';
import { checkDoctorEmail, checkDoctorUserName, clearDoctorErrorMessages, closeRegisterDialog, openDoctorDialog } from '../../redux/Actions/DoctorActions';
import Loading from '../Loading';
import ModalDoctor from '../../modals/ModalDoctor';
import { actions } from 'react-redux-form'
import { intialDotorForm } from '../../redux/Forms/doctorform';

function DoctorForm(props) {
    const [addWorkingDaysErrMess, setWorkingDaysErrMess] = useState()

    const handleSubmit = (values) => {
        props.closeRegisterDialog()
        props.clearDoctorErrorMessages()
        props.openModelDialog()
    }
    const handleSelect = (event) => {
        const select = event.target
        const options = select.options
        const id = options[options.selectedIndex].id
        props.changeClinicId(id)
    }
    const AddTimesIntoList = (e) => {
        setWorkingDaysErrMess(undefined)
        let exist = false
        const { day, startTime, endTime } = { ...props.doctorForm.workingDays }
        props.doctorForm.workingDaysList.forEach((workingDay) => {
            if (workingDay.day === day && workingDay.startTime <= startTime && workingDay.endTime >= endTime) {
                exist = true
            }
        })
        if (exist) {
            setWorkingDaysErrMess("working day is invalid !")
            return
        }

        if ((day !== '' && endTime !== '' && startTime !== '' && startTime !== endTime) && startTime < endTime) {
            props.addToWorkingDays({ ...props.doctorForm.workingDays })
        }

        props.resetWorkinDays()
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
    function formatAMPM(date) {
        var hours = date.split(':')[0]
        var minutes = date.split(':')[1];
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const timeRequired = () => props.doctorForm.workingDaysList.length
    if (props.clinics.isLoading) {
        return <Loading />
    }
    function handleRemove(i) {
        props.removeWorkingDays(i)
    }
    const workingDaysList = props.doctorForm.workingDaysList.map((item, i) => (
        <li key={i} className="mb-4 mt-3">
            <span className="fa fa-calendar-day mr-3" style={{ "color": "grey" }}></span>
            {item.day}
            <span className="fa fa-clock ml-4 mr-4" style={{ "color": "grey" }}></span>
            {formatAMPM(item.startTime)}
            <span style={{ "color": "grey" }} className="ml-3 mr-2">{'->'}</span>
            <span className="fa fa-clock ml-4 mr-4" style={{ "color": "grey" }}></span>
            {formatAMPM(item.endTime)}
            <span className="fa fa-trash-alt ml-4" style={{ "color": "#ff2e63f2" }} onClick={() => handleRemove(i)} type="button"></span>
        </li>
    ))
    const ErrorAlert = () => {

        if (props.doctorRegisterStatus.isDoctorAdded === false) {
            return (
                <Alert variant="danger" className="addingAlert" onClose={() => props.closeRegisterDialog()} dismissible>
                    <Alert.Heading>
                        Error
                    </Alert.Heading>
                    {props.doctorRegisterStatus.errMess.map((errMess) => <p>{errMess}</p>)}
                </Alert>
            )
        }
        else if (props.doctorRegisterStatus.isDoctorAdded) {
            return (
                <Alert variant="success" className="addingAlert " onClose={() => props.closeRegisterDialog()} dismissible>
                    <Alert.Heading>
                        Success
                    </Alert.Heading>
                    <p>
                        Doctor adding successfully into database
                    </p>
                </Alert>)
        }
        else {
            return <></>
        }

    }

    return (
        <div className="mt-2">
            <ModalDoctor data={props.doctorForm} type="Doctor" />
            <Breadcrumb >
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to="/dashboard">
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    <Link to='/dashboard/doctors'>Doctors</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="mr-auto" href="#">
                    Add Doctor
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
                            <h5>Add Doctor</h5>
                        </Col>
                        <ErrorAlert />

                        <Col md={12}>
                            <Form model="doctorForm" className="p-4" onSubmit={(values) => handleSubmit(values)}>
                                <div className="separator d-flex d-md-none mb-2">
                                    Doctor Name
                                </div>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>First Name :</FormLabel>
                                    </Col>
                                    <Col md={4} className="mb-2">
                                        <Control.text name="firstName" model=".firstName" className="form-control"
                                            placeholder="Enter Doctor First Name"
                                            validators={{
                                                required, isChar, maxLength: maxLength(15), minLength: minLength(3)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".firstName" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 1 ",
                                                maxLength: "Must be smaller than 15 "
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Last Name :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text name="lastName" model=".lastName" className="form-control"
                                            placeholder="Enter Doctor Last Name" validators={{
                                                required, isChar, maxLength: maxLength(15), minLength: minLength(3)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".lastName" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 1 ",
                                                maxLength: "Must be smaller than 15 "
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <div className="separator d-flex d-md-none mb-2">
                                    Contact Information
                                </div>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>Phone Number :</FormLabel>
                                    </Col>
                                    <Col md={4} className="mb-2">
                                        <Control.text name="phoneNumber" model=".phoneNumber" className="form-control"
                                            placeholder="Enter Doctor Phone Number" validators={{
                                                required, isPhoneNumber, isNumber
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".phoneNumber" show="touched" messages={{
                                                required: 'Required ',
                                                isPhoneNumber: 'Phone number is invalid ',
                                                isNumber: "Must be Number"
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Email :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text type="email" name="email" model=".user.email" className="form-control"
                                            placeholder="Enter Doctor Email"
                                            onChange={(e) => { props.changeEmail(e); props.checkDoctorEmail(e.target.value) }}
                                            validators={{
                                                required, validEmail, reversed: () => props.doctorRegisterStatus.isEmailValid
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".user.email" show="touched" messages={{
                                                required: 'Required ',
                                                validEmail: 'Email is invalid',
                                                reversed: "Email is reversed please type another one"
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <div className="separator d-flex d-md-none mb-2">
                                    Account Information
                                </div>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>User Name :</FormLabel>
                                    </Col>
                                    <Col md={4} className="mb-2">
                                        <Control.text type="text" name="username" model=".user.username" className="form-control"
                                            placeholder="Enter Username" onChange={(e) => {
                                                props.changeUserName(e);
                                                props.checkDoctorUserName(e.target.value)
                                            }} validators={{
                                                required, reversed: () => props.doctorRegisterStatus.isUserNameValid, minLength: minLength(5),
                                                maxLength: maxLength(20)
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".user.username" show="touched" messages={{
                                                required: 'Required ',
                                                reversed: 'Username is Reverse please type another one',
                                                minLength: "Must be greateer than 5",
                                                maxLength: "Must be smaller than 20"
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Password :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.text type="password" name="password" model=".user.password" className="form-control"
                                            placeholder="Enter Doctor Password" validators={{
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
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>Clinic :</FormLabel></Col>
                                    <Col md={4} className="mb-2">
                                        <Control.select name="clinic" model=".clinic" disabled={props.clinics.clinics.length === 0 ? true : false}
                                            className="form-select" onChange={handleSelect} validators={{ required }}
                                            defaultValue={props.doctorForm.clinic.length === 0 ? props.clinics.clinics[0]?.clinic?.name : props.doctorForm.clinic} >
                                            {props.clinics.clinics.map((clinic) => (
                                                <option id={clinic.clinic.id} key={clinic.clinic.id}>{clinic.clinic.name}</option>
                                            ))}
                                        </Control.select>
                                        <Errors
                                            className="text-danger" model=".clinic" show="touched" messages={{
                                                required: "Required "
                                            }}
                                        />
                                        <Control.text name="clinicId" model=".clinicId"
                                            className="d-none"
                                            defaultValue={props.doctorForm.clinicId.length === 0 ? props.clinics.clinics[0]?.clinic?.id : props.doctorForm.clinicId} />
                                    </Col>
                                    <Col md={2}>
                                        <FormLabel>Sepecialize :</FormLabel>

                                    </Col>
                                    <Col md={4} className="mb-2">
                                        <Control.text type="text" name="sepecialize" model=".sepecialize" className="form-control"
                                            placeholder="Enter Sepecialize" validators={{
                                                isChar, minLength: minLength(4), required
                                            }}
                                        />
                                        <Errors
                                            className="text-danger" model=".sepecialize" show="touched" messages={{
                                                isChar: "Must be char ",
                                                minLength: "Must be greater than 4"
                                                , required: "Required "
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>Languages :</FormLabel>
                                    </Col>
                                    <Col md={4}>
                                        <Control.select name="language" model=".language"
                                            className="form-control" multiple={true} type="select-multiple" validators={{ required }}>
                                            <option>Arabic</option>
                                            <option>English</option>
                                            <option>French</option>
                                        </Control.select>
                                        <Errors
                                            className="text-danger" model=".language" show="touched" messages={{
                                                required: "Required "
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>
                                            Description :
                                        </FormLabel>
                                    </Col>
                                    <Col md={10}>
                                        <Control.textarea name="description" model=".description"
                                            className="form-control" rows={6} validators={{
                                                minLength: minLength(20), required
                                            }} />
                                        <Errors
                                            className="text-danger" model=".description" show="touched" messages={{
                                                required: "Required ",
                                                minLength: "Must be greateer than 20 ",
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group align-items-center">
                                    <Col md={2}>
                                        <FormLabel>
                                            Working Days :
                                        </FormLabel>
                                    </Col>
                                    <Col md={10}>
                                        <div className="mb-2 mt-2 row row-cols-lg-auto g-3 align-items-center">
                                            <div md="auto">
                                                <Control.select model=".workingDays.day" name="day" className="form-select" validators={{ timeRequired }}>
                                                    <option selected>Choose Day</option>
                                                    <option>Saturday</option>
                                                    <option>Sunday</option>
                                                    <option>Monday</option>
                                                    <option>Tuesday</option>
                                                    <option>Wednesday</option>
                                                    <option>Thursday</option>
                                                    <option>Friday</option>
                                                </Control.select>
                                            </div>
                                            <div md="auto">
                                                <div className="input-group">
                                                    <div className="input-group-text">Start Time</div>
                                                    <Control model=".workingDays.startTime" type="time" className="form-control" />
                                                </div>
                                            </div>
                                            <div md="auto">
                                                <div className="input-group">
                                                    <div className="input-group-text">End Time</div>
                                                    <Control model=".workingDays.endTime" type="time" className="form-control" />                                                </div>
                                            </div>
                                            <div md="auto" className="text-center">
                                                <Button variant="outline-secondary" onClick={AddTimesIntoList}>Add</Button>
                                            </div>
                                            <div md="auto" className="text-center">
                                                <Errors
                                                    className="text-danger" model=".workingDays.day" show="touched" messages={{
                                                        timeRequired: 'Required ',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={{ offset: 2 }}>
                                        {addWorkingDaysErrMess ? <p className="text-danger">{addWorkingDaysErrMess}</p> : <></>}

                                        <ul className="list-unstyled">
                                            {workingDaysList}
                                        </ul>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>
                                            Sessions duration :
                                        </FormLabel>
                                    </Col>
                                    <Col md={3} className="mb-2 mt-2 mt-md-0 mb-md-0">
                                        <div className="form-floating">
                                            <Control.select model=".tags.check" name="check" className="form-select">
                                                <option selected>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                            </Control.select>

                                            <label for="floatingSelect">Check</label>
                                        </div>
                                    </Col>
                                    <Col md={3} className="mb-2 mt-2 mt-md-0 mb-md-0">
                                        <div className="form-floating">
                                            <Control.select model=".tags.review" name="review" className="form-select" >
                                                <option selected>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                            </Control.select>

                                            <label for="floatingSelect">Review</label>
                                        </div>
                                    </Col>
                                    <Col md={3} className="mb-2 mt-2 mt-md-0 mb-md-0">
                                        <div className="form-floating">
                                            <Control.select model=".tags.consultation" name="consultation" className="form-select">
                                                <option selected>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                            </Control.select>
                                            <label for="floatingSelect">Consultation</label>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="form-group">
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
    doctorForm: state.doctorForm,
    doctorRegisterStatus: state.doctorRegisterStatus
})
const mapDispatchToProps = (dispatch) => ({
    openModelDialog: () => dispatch(openDoctorDialog()),
    resetForm: () => dispatch(actions.reset('doctorForm'))
    , changeClinicId: (id) => dispatch(actions.change('doctorForm.clinicId', id)),
    resetWorkinDays: () => dispatch(actions.change('doctorForm.workingDays', intialDotorForm.workingDays)),
    addToWorkingDays: (item) => dispatch(actions.push('doctorForm.workingDaysList', item)),
    removeWorkingDays: (i) => dispatch(actions.remove('doctorForm.workingDaysList', i)),
    closeRegisterDialog: () => dispatch(closeRegisterDialog()),
    checkDoctorUserName: (userName) => dispatch(checkDoctorUserName(userName)),
    changeUserName: (username) => dispatch(actions.change('doctorForm.user.username', username)),
    checkDoctorEmail: (email) => dispatch(checkDoctorEmail(email)),
    changeEmail: (email) => dispatch(actions.change('doctorForm.user.email', email)),
    clearDoctorErrorMessages: () => dispatch(clearDoctorErrorMessages())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorForm))