import React, { useEffect, useState } from 'react';
import { Accordion, Breadcrumb, Button, Card, Col, Container, Row, useAccordionToggle } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useRouteMatch, withRouter } from 'react-router-dom'
import { acceptAppointment, fetchPendingAppointments, updateAppointmetns } from '../../redux/Actions/AppointmentsActions';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import ErrorAlert from '../../helpers/ErrorAlert'
import { LocalForm, Control } from 'react-redux-form'
import HideForType from '../../helpers/HideForType';

function Appointments(props) {
    let [doctors, setDoctors] = useState([])
    let [clinics, setClinics] = useState([])
    let [todayAppointments, setTodayAppointments] = useState([])
    let [isLoading, setIsLoading] = useState(true)
    let [errorMess, setErrorMess] = useState()
    let [SelectedClinic, setSelectedClinic] = useState(null)
    let [acceptAppointmentErrMess, setAcceptAppointmentErrMess] = useState('')
    let curday = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return (yyyy + '-' + mm + '-' + dd);
    };
    let { path, url } = useRouteMatch()
    const nextPath = (path) => {
        props.history.push(path)
    }
    const getClinicTimeLine = (clinicId, date) => {
        return fetch(baseUrl + 'api/appointments/accepted/clinicId/' + clinicId + '/date=' + date, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
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
            .catch(error => {
                setErrorMess(error.message)
                setIsLoading(false)
            })
    }
    const getDoctorTimeLine = (doctorId, date) => {
        return fetch(baseUrl + 'api/appointments/accepted/doctorId/' + doctorId + '/date=' + date, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
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
            .catch(error => {
                setErrorMess(error.message)
                setIsLoading(false)
            })
    }
    let daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const acceptAppointment = (values, appointmentId) => {
        return fetch(baseUrl + 'api/appointments/id/' + appointmentId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
        }).then(response => {
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
            .catch(error => {
                setAcceptAppointmentErrMess(error.message)
            })
    }
    useEffect(() => {
        const getClinics = () => fetch(baseUrl + 'api/clinics/all', {
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
            .then(clinics => setClinics(clinics))
        getClinics()
        const getDoctorsForClinic = () => fetch(baseUrl + 'api/doctors/clinic/1', {
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
            .then(doctors => {
                setIsLoading(false)
                setDoctors(doctors)
            })
        getDoctorsForClinic()
        getClinicTimeLine(1, curday())
            .then(
                appointments => setTodayAppointments(appointments)
            )
        props.fetchPendingAppointments(1)
    }, [])
    const CustomToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionToggle(eventKey)
        return (
            <button className="iconBtn" type="button" onClick={decoratedOnClick}>
                <span className="fa fa-chevron-down me-2"></span>
                {children}
            </button>
        )
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
    const PatientsName = ({ patientId }) => {
        let patient = props.patients.patients.filter((patient) => patient.patient.id === patientId)[0]
        return patient.patient.firstName + ' ' + patient.patient.lastName
    }

    let timeline = todayAppointments ? todayAppointments.map((appointment => (
        <div class="timeline-step">
            <div class="timeline-content" data-toggle="popover" data-trigger="hover">
                <div class="inner-circle"></div>
                <p class="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                <p class="h6 text-muted mb-0 mb-lg-0">
                    <PatientsName patientId={appointment.patientId} />
                </p>
            </div>
        </div>
    ))) : <p>{errorMess + ' today'}</p>
    function getDoctorName(appointmentId) {
        let doctor = props.doctors.doctors.filter((doctor) => doctor.doctor.id === appointmentId)[0]
        return 'Dr. ' + doctor.doctor.firstName + ' ' + doctor.doctor.lastName
    }
    const handleAccept = (values, appointmentId) => {
        let valuesObject = { ...values, day: daysInWeek[new Date(values.date).getDay()], status: 'Accepted' }
        acceptAppointment(valuesObject, appointmentId).then(() => {
            props.acceptAppointment(appointmentId)
        })
    }
    let appointment = props.appointments.appointments.map((appointment, index) => (
        <Card className="ps-3 pe-2" key={appointment.id}>
            <Card.Body style={{ position: "relative" }}>
                <Card.Title className="mb-2">
                    <PatientsName patientId={appointment.patientId} />
                </Card.Title>
                <Card.Subtitle className="mb-1">
                    {getDoctorName(appointment.doctorId)}
                </Card.Subtitle>
                <Card.Subtitle className="mt-1" style={{ color: '#010a43' }}>
                    {appointment.type}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{appointment.title}</Card.Subtitle>
                <LocalForm onSubmit={(values) => handleAccept(values, appointment.id)}>
                    <div className="d-md-flex d-block">
                        <Card.Text>
                            {appointment.description} <br></br>
                            <Row className="mt-2">
                                <Col md="auto">
                                    <Control type="time" model=".startTime" className="form-control" defaultValue={appointment.startTime} />
                                </Col>
                                <Col md="auto" className="mt-2">
                                    <p>{"to"}</p>
                                </Col>
                                <Col md="auto">
                                    <Control type="time" model=".endTime" className="form-control" id={appointment.id} defaultValue={appointment.endTime}
                                        onChange={(event) => console.log(event)} />
                                </Col>
                                <Col md="auto" className="mt-3 mt-md-0">
                                    <Control type="date" model=".date" className="form-control" id={appointment.id} defaultValue={appointment.date} />
                                </Col>
                            </Row>
                        </Card.Text>
                        <div style={{
                            flex: "none",
                            flexGrow: "2",
                            textAlign: "right"
                        }} className="d-md-block d-none">
                            <button className="acceptButton me-2">
                                <span className="fa fa-check me-2" type="submit"></span>Accept</button>
                            <CustomToggle eventKey={appointment.id}>Expand</CustomToggle>
                        </div>
                        <div className="d-md-none d-block">
                            <button className="acceptButton me-2" type="button">
                                <span className="fa fa-check me-2"></span>Accept</button>
                            <CustomToggle eventKey={appointment.id}>Expand</CustomToggle>
                        </div>
                    </div>
                </LocalForm>
            </Card.Body>
            <Accordion.Collapse eventKey={appointment.id}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col>
                                <div class="timeline-steps aos-init aos-animate">
                                    {timeline}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    ))
    let error = false
    if (props.appointments.loading || props.patients.isLoading || props.doctors.isLoading || isLoading) {
        return <Loading />
    }
    if (props.appointments.errMess) {
        error = true
    }
    const selectDoctor = (event) => {
        let doctorId = event.target[event.target.selectedIndex].id
        if (doctorId == 0) {
            props.fetchPendingAppointments(SelectedClinic)
        }
        else {
            getDoctorTimeLine(doctorId, curday()).then((appointments) => {
                setTodayAppointments(appointments)
                setIsLoading(false)
            })
            props.updateAppointments(doctorId)
        }
    }
    const selectClinic = (event) => {
        let clinicId = event.target[event.target.selectedIndex].id
        setSelectedClinic(clinicId)
        let doctorArray = props.doctors.doctors.filter((doctor) => doctor.doctor.clinicId == clinicId)
        setDoctors(doctorArray)
        props.fetchPendingAppointments(clinicId)
        getClinicTimeLine(clinicId, curday()).then((appointments) => {
            setIsLoading(false)
            setTodayAppointments(appointments)
        }
        )
    }
    let clinicSelectors = clinics.map((clinic) => (
        <option key={clinic.clinic.id} id={clinic.clinic.id}>{clinic.clinic.name}</option>
    ))
    let doctorSelectors = doctors.map((doctor) => (
        <option key={doctor.doctor.id} id={doctor.doctor.id}>{doctor.doctor.firstName + ' ' + doctor.doctor.lastName}</option>
    ))
    doctorSelectors.unshift(<option key="0" id="0">All Doctor</option>)

    return (
        <div className="mt-2">
            <Breadcrumb >
                <Breadcrumb.Item className="pl-3 mt-1" href="#">
                    <Link to={`/dashboard`}>
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className="mr-auto mt-1" active href="#">
                    Appointments
                </Breadcrumb.Item>
                <div style={{ display: '-webkit-inline-box' }} className="mt-3 mt-md-0 SelectionDiv me-auto ms-auto me-md-0 ms-md-0">
                    <select type="select" className="form-select w-auto" onChange={selectClinic} style={{ marginRight: '8px', height: '42px' }}>
                        {clinicSelectors}
                    </select>
                    <select type="select" className="form-select w-auto" onChange={selectDoctor} style={{ marginRight: '8px', height: '42px' }}>
                        {doctorSelectors}
                    </select>
                    <Button style={{
                        "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                        "marginBottom": "-13px", "marginRight": "7px"
                    }} onClick={() => nextPath(`addAppointments`)}><span className="fa fa-plus"></span></Button>
                </div>
               
            </Breadcrumb>
            <div className="mt-3 mt-md-0 SelectionDivMob me-auto ms-auto me-md-0 ms-md-0 d-grid ps-4 pe-4 w-75 gap-2">
                    <select type="select" className="form-select w-auto" onChange={selectClinic} style={{ height: '42px' }}>
                        {clinicSelectors}
                    </select>
                    <select type="select" className="form-select w-auto" onChange={selectDoctor} style={{ height: '42px' }}>
                        {doctorSelectors}
                    </select>
                    <Button style={{
                        "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                        "marginBottom": "18px"
                    }} onClick={() => nextPath(`addAppointments`)}><span className="fa fa-plus"></span></Button>
                </div>
            <Container fluid >
                <div className="pageContainer ">
                    <Row className="mb-4">
                        <Col xs={12} className="mt-3 text-center">
                            <h4>Appointments</h4>
                        </Col>
                        <Col xs={12}>
                            <Container fluid className="mb-2 mt-4">
                                <Row>
                                    <Col>
                                        <div class="timeline-steps aos-init aos-animate">
                                            {timeline}
                                        </div>
                                        <Accordion>
                                            {appointment}
                                        </Accordion>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        {error ? <Col xs={12}>
                            <ErrorAlert messege={props.appointments.errMess} color="#ffffff" />
                        </Col> : <></>}
                    </Row>
                </div>
            </Container>
        </div>
    );
}
const mapStateToProps = (state) => ({
    appointments: state.appointments,
    patients: state.patients,
    doctors: state.doctors
})

const mapDispatchToProps = (dispatch) => ({
    fetchPendingAppointments: (id) => dispatch(fetchPendingAppointments(id)),
    updateAppointments: (id) => dispatch(updateAppointmetns(id)),
    acceptAppointment: (appointmentId) => dispatch(acceptAppointment(appointmentId))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Appointments))
