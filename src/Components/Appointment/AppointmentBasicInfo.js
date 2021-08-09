import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row, FormLabel, FormText, FormControl, Alert } from 'react-bootstrap';
import { actions, Control, Errors, Form } from 'react-redux-form';
import { Link, useRouteMatch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from '../Loading'
import { baseUrl } from '../../shared/baseUrl';

function AppointmentBasicInfo(props) {

    const [patients, setPatients] = useState([...props.patients.patients])
    const [selectedPatient, setSelectedPatient] = useState()
    const [filterdArray, setFilterdArray] = useState([...props.patients.patients])
    const [showDropDown, setShowDropDown] = useState(false)
    const [doctors, setDoctors] = useState([])
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const nextPath = (path) => {
        props.history.push(path)
    }

    const getDoctorsForClinic = (clinicId) => {
        return fetch(baseUrl + 'api/doctors/clinic/' + clinicId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    let error = new Error("Error " + response.status + ":" + response.statusText)
                    error.response = response
                    throw error
                }
            }, err => {
                let error = new Error(err.message)
                throw error;
            })
            .then(response => response.json())
    }

    const getAvailableTimes = (date, day, doctorId) => {
        return fetch(baseUrl + `api/appointments/empty_time/doctorId/${doctorId}/day/${day}/date/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response
                }
                else {
                    let error = new Error(response.statusText)
                    error.response = response
                    throw error
                }
            }, err => {
                let error = new Error(err.message)
                throw error;
            })
            .then(response => response.json())
    }


    useEffect(() => {
        if (props.appointmentForm.clinicId) {
            getDoctorsForClinic(props.appointmentForm.clinicId)
                .then((doctors) => {
                    setDoctors(doctors)
                })
                .catch((error) => {
                    props.setErrMess(error.message)
                })
        }
    }, [])

    if (props.patients.isLoading || props.clinics.isLoading) {
        return <Loading />
    }


    const required = (value) => value && value.length
    const maxLength = (len) => (val) => !(val) || val.length <= len
    const minLength = (len) => (val) => (val) && val.length >= len

    const handleClick = (event) => {
        let selectedUserName = event.target.textContent
        let patient = patients.filter((patient) => patient.patient.user.username === selectedUserName)[0]
        if (patient) {
            props.changePatientId(patient.patient.id)
            props.changeUserName(patient.patient.user.username)
        }
        setFilterdArray([patient])
    }
    const handleChange = (event) => {
        let username = event.target.value
        let patient = patients.filter((patient) => patient.patient.user.username === username)[0]
        if (patient) {
            props.changePatientId(patient.patient.id)
            props.changeUserName(patient.patient.user.username)
        }
        else {
            props.resetPatientId()
        }
        let tempArray = patients.filter((patient) => patient.patient.user.username.toLowerCase().includes(username.toLowerCase()))
        setFilterdArray(tempArray)
    }
    const handleSelectClinic = (event) => {
        const select = event.target
        const options = select.options
        const id = options[options.selectedIndex].id
        if (id === 0) {
            return
        }
        getDoctorsForClinic(id).then((doctors) => {
            setDoctors(doctors)
        })
            .catch((error) => {
                props.setErrMess(error.message)
            })
        props.changeClinicId(id)
    }

    const handleSelectDoctor = (event) => {
        const select = event.target
        const options = select.options
        const id = options[options.selectedIndex].id
        if (id === 0) {
            return
        }
        props.changeDoctorId(id)
    }

    const patientsList = filterdArray.map((patient) => (
        <p className="list-group-item list-group-item-action m-0" type="button" onClick={handleClick}>{patient.patient.user.username}</p>
    ))

    const clinicsSelect = props.clinics.clinics.map((clinic) => (
        <option id={clinic.clinic.id} key={clinic.clinic.id}>{clinic.clinic.name}</option>
    ))
    clinicsSelect.unshift(<option key="0" id="0">Select clinic</option>)

    const doctorSelects = doctors.map((doctor) => (
        <option id={doctor.doctor.id} key={doctor.doctor.id}>{doctor.doctor.firstName + ' ' + doctor.doctor.lastName}</option>
    ))
    doctorSelects.unshift(<option key="0" id="0">Select doctor</option>)

    let disabled = props.appointmentForm.patientId && props.appointmentForm.doctorId &&
        props.appointmentForm.date && props.appointmentForm.description.length > 10 && props.appointmentForm.clinicId ? false : true
    return (
        <Col md={12}>
            <Form model="appointmentForm" className="p-4" onSubmit={(values) => console.log(values)}>
                <Row className="form-group g-2 align-items-center" >
                    <Col md={2}>
                        <FormLabel>Patient username :</FormLabel>
                    </Col>
                    <Col md={4} style={{ position: "relative" }}>
                        <Control.input name="username" className="form-control" model=".username"
                            placeholder="Username" onChange={handleChange}
                            onFocus={() => setShowDropDown(true)} onBlur={() => setTimeout(() => setShowDropDown(false), 100)}
                        />
                        {
                            showDropDown ?
                                <div className="list-group-item list-group-item-action dropdownUser p-0" style={{
                                    position: "absolute", width: "-webkit-fill-available", marginRight: "29px"
                                    , overflow: "auto", maxHeight: "200px", height: "auto", zIndex: "1"
                                }}>
                                    {patientsList}
                                </div>
                                : <></>
                        }
                    </Col>
                </Row>
                <Row className="form-group g-2 align-items-center mt-3" >
                    <Col md={2}>
                        <FormLabel>Clinic :</FormLabel>
                    </Col>
                    <Col md={4} className="mb-2">
                        <Control.select name="clinics" model=".clinic"
                            className="form-select" onChange={handleSelectClinic}>
                            {clinicsSelect}
                        </Control.select>
                    </Col>
                    <Col md={2} className="text-md-center">
                        <FormLabel>Doctor :</FormLabel>
                    </Col>
                    <Col md={4} className="mb-2">
                        <Control.select name="doctors" model=".doctor"
                            className="form-select" onChange={handleSelectDoctor}>
                            {doctorSelects}
                        </Control.select>
                    </Col>
                </Row>
                <Row className="form-group g-2 align-items-center mt-3" >
                    <Col md={2}>
                        <FormLabel>Date :</FormLabel>
                    </Col>
                    <Col md={4} className="mb-2">
                        <Control type="date" model=".date" name="date" className="form-control" validators={{
                            validDate: (date) => new Date(date) > new Date()
                        }} />
                        <Errors
                            className="text-danger" model=".date" show="touched" messages={{
                                validDate: "date must be valid"
                            }}
                        />
                    </Col>
                    <Col md={2} className="text-md-center">
                        <FormLabel>Type :</FormLabel>
                    </Col>
                    <Col md={4} className="mb-2">
                        <Control.select name="type" model=".type"
                            className="form-select">
                            <option key={1} selected>Check</option>
                            <option key={2}>Review</option>
                            <option key={3}>Consultation</option>
                        </Control.select>
                    </Col>
                </Row>
                <Row className="form-group g-2 mt-3" >
                    <Col md={2}>
                        <FormLabel>
                            Description :
                        </FormLabel>
                    </Col>
                    <Col md={10}>
                        <Control.textarea name="description" model=".description"
                            className="form-control" rows={6} validators={{
                                minLength: minLength(10)
                            }} />
                        <Errors
                            className="text-danger" model=".description" show="touched" messages={{
                                minLength: "Must be greateer than 10 ",
                            }}
                        />
                    </Col>
                </Row>
                {/* <Row className="form-group g-2 mt-3" >
                <Col md={2}>
                    <FormLabel>
                        Available times :
                    </FormLabel>
                </Col>
                <Col md={10}>
                    <div className="timesContainer ">
                        <Button className="m-2" variant="outline-secondary">01:00PM</Button>
                    </div>
                </Col>
            </Row> */}
                <Row className="form-group">
                    <Col md={{ size: 10, offset: 2 }}>
                        <Button className="btn2" type="submit" disabled={disabled} onClick={() => nextPath(`/dashboard/addAppointments/availableTimes`)}>
                            Next
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Col>
    );
}

const mapStateToProps = (state) => ({
    patients: state.patients,
    clinics: state.clinics,
    appointmentForm: state.appointmentForm
})

const mapDispatchToProps = (dispatch) => ({
    changeClinicId: (id) => dispatch(actions.change('appointmentForm.clinicId', id)),
    changeDoctorId: (id) => dispatch(actions.change('appointmentForm.doctorId', id)),
    changePatientId: (id) => dispatch(actions.change('appointmentForm.patientId', id)),
    changeUserName: (username) => dispatch(actions.change('appointmentForm.username', username)),
    resetPatientId: () => dispatch(actions.change('appointmentForm.patientId', null)),
    changeIsAvailableTimesFetched: (value) => dispatch(actions.change('appointmentForm.isAvailableTimesFetched', value)),
    resetForm: () => dispatch(actions.reset('appointmentForm'))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentBasicInfo));