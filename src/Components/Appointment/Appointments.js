import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Breadcrumb, Button, ButtonGroup, Card, Col, Container, OverlayTrigger, Popover, Row, useAccordionToggle } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useRouteMatch, withRouter } from 'react-router-dom'
import { acceptAppointment, fetchPendingAppointments, rejectAppointment, updateAppointmetns } from '../../redux/Actions/AppointmentsActions';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import ErrorAlert from '../../helpers/ErrorAlert'
import { LocalForm, Control } from 'react-redux-form'
import HideForType from '../../helpers/HideForType';

function Appointments(props) {
    let [doctors, setDoctors] = useState([])
    let [clinics, setClinics] = useState([])
    let [todayAppointments, setTodayAppointments] = useState([])
    let [errorMess, setErrorMess] = useState()
    let [SelectedClinic, setSelectedClinic] = useState(null)
    let [selectedDoctor, setSelectedDoctor] = useState(null)
    let [doctorsIsLoading, setDoctorsIslLoading] = useState(true)
    let [clinicsIsLoading, setClinicsIslLoading] = useState(true)
    let [doctorsErrMess, setDoctorErrMess] = useState()
    let [clinicsErrMess, setClinicsErrMess] = useState()
    let [acceptAppointmentErrMess, setAcceptAppointmentErrMess] = useState('')
    let [appoinmtentTimeLine, setAppoinmtentTimeLine] = useState([])
    let [updatedDate, setUpdatedDate] = useState()
    let [appointmentsTimeLineErrMess, setAppointmentsTimeLineErrMess] = useState()
    let [todayTimeLineErrMess, settodayTimeLineErrMess] = useState()

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

    }

    const rejectAppointment = (values, appointmentId) => {
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

    }
    const getAvailableTimes = (date , day , doctorId) => {
        return fetch(baseUrl + `api/appointments/empty_time/doctorId/${doctorId}/day/${day}/date/${date}` , {
            method : "GET" ,
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
            .then(clinics => {
                setClinics(clinics)
                setClinicsIslLoading(false)
            })
            .catch((error) => {
                setClinicsErrMess(error.message)
                setClinicsIslLoading(false)
            })
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
                setDoctorsIslLoading(false)
                setDoctors(doctors)
            })
            .catch((error) => {
                setDoctorErrMess(error.message)
                setDoctorsIslLoading(false)
            })
        getDoctorsForClinic()
        getClinicTimeLine(1, curday())
            .then(
                appointments => setTodayAppointments(appointments)
            )
            .catch(error => {
                settodayTimeLineErrMess(error.message)
            })
        props.fetchPendingAppointments(1)
    }, [])
    const CustomToggle = ({ children, eventKey, date }) => {
        const decoratedOnClick = useAccordionToggle(eventKey)
        return (
            <button className="iconBtn" type="button" onClick={() => {
                decoratedOnClick()
                handleExpand(updatedDate||date)
            }}>
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
    const DoctorName = ({ doctorId }) => {
        let doctor = props.doctors.doctors.filter((doctor) => doctor.doctor.id === doctorId)[0]
        return 'Dr. ' + doctor.doctor.firstName + ' ' + doctor.doctor.lastName
    }
    let sortedTimeLine = todayAppointments?.sort((a, b) => {
        if (a.startTime < b.startTime) {
            return -1
        }
        if (a.startTime > b.startTime) {
            return 1
        }
        return 0
    })
    const handleExpand = (date) => {
        setAppointmentsTimeLineErrMess(undefined)
        if (selectedDoctor) {
            getDoctorTimeLine(selectedDoctor, date).then((appointments) => {
                setAppoinmtentTimeLine(appointments)
            })
                .catch(error => {
                    setAppointmentsTimeLineErrMess(error.message)
                })
        }
        else if (SelectedClinic) {
            getClinicTimeLine(SelectedClinic, date).then((appointments) => {
                setAppoinmtentTimeLine(appointments)
            })
                .catch(error => {
                    setAppointmentsTimeLineErrMess(error.message)
                })
        }
        else {
            getClinicTimeLine(1, date).then((appointments) => {
                setAppoinmtentTimeLine(appointments)
            })
                .catch(error => {
                    setAppointmentsTimeLineErrMess(error.message)
                })
        }
    }
    const handleChangeDate = (date) => {
        
        if (!date) {
            return
        }
        if (selectedDoctor) {
            getDoctorTimeLine(selectedDoctor, date).then((appointments) => {
                setAppointmentsTimeLineErrMess(undefined)
                setAppoinmtentTimeLine(appointments)
            })
                .catch(error => {
                    setAppointmentsTimeLineErrMess(error.message)
                })
        }
        else if (SelectedClinic) {
            getClinicTimeLine(SelectedClinic, date).then((appointments) => {
                setAppointmentsTimeLineErrMess(undefined)
                setAppoinmtentTimeLine(appointments)
            })
                .catch(error => {
                    setAppointmentsTimeLineErrMess(error.message)
                })
        }
        else {
            getClinicTimeLine(1, date).then((appointments) => {
                setAppointmentsTimeLineErrMess(undefined)
                setAppoinmtentTimeLine(appointments)
            })
                .catch(error => {
                    setAppointmentsTimeLineErrMess(error.message)
                })
        }
        setUpdatedDate(date)
    }
    let timeline = !todayTimeLineErrMess ? sortedTimeLine.map((appointment => (
        <div class="timeline-step">
            <div class="timeline-content" data-toggle="popover" data-trigger="hover">
                <div class="inner-circle"></div>
                <p class="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                <p class="h6 text-muted mb-1">
                    <PatientsName patientId={appointment.patientId} />
                </p>
                {
                    !selectedDoctor ? <p class="h6  mb-0 mb-lg-0" style={{ color: "#ff3467" }}>
                        <DoctorName doctorId={appointment.doctorId} />
                    </p> : <></>
                }

            </div>
        </div>
    ))) : <p>{todayTimeLineErrMess}</p>

    let sortedAppointmentsTimeLine = appoinmtentTimeLine?.sort((a, b) => {
        if (a.startTime < b.startTime) {
            return -1
        }
        if (a.startTime > b.startTime) {
            return 1
        }
        return 0
    })

    let timeLineFoappointment = !appointmentsTimeLineErrMess ? sortedAppointmentsTimeLine.map((appointment => (
        <div class="timeline-step">
            <div class="timeline-content" data-toggle="popover" data-trigger="hover">
                <div class="inner-circle"></div>
                <p class="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                <p class="h6 text-muted mb-0 mb-lg-0">
                    <PatientsName patientId={appointment.patientId} />
                </p>
            </div>
        </div>
    ))) : <p>{appointmentsTimeLineErrMess}</p>
    function getDoctorName(appointmentId) {
        let doctor = props.doctors.doctors.filter((doctor) => doctor.doctor.id === appointmentId)[0]
        return 'Dr. ' + doctor.doctor.firstName + ' ' + doctor.doctor.lastName
    }
    const handleAccept = (values, appointmentId , doctorId) => {
        let valuesObject = { ...values, day: daysInWeek[new Date(values.date).getDay()], status: 'Accepted' }
       getAvailableTimes(valuesObject.date , valuesObject.day , doctorId)
       .then((availableTimes) => {
        let valid = false 
        availableTimes.forEach((element) => {
            if(valuesObject.startTime >= element.startTime.slice(0,5) && valuesObject.endTime.slice(0,5) <= element.endTime) {
                valid = true
                return
            }
        })
        if (!valid) {
            let error = new Error("time is invalid please try another one")
            throw error
        }
        acceptAppointment(valuesObject, appointmentId).then(() => {
            props.acceptAppointment(appointmentId)
            if (selectedDoctor) {
                getDoctorTimeLine(selectedDoctor, curday()).then((appointments) => {
                    settodayTimeLineErrMess(undefined)
                    setTodayAppointments(appointments)
                })
                    .catch(error => {
                        settodayTimeLineErrMess(error.message)
                    })
            }
            else if (SelectedClinic) {
                getClinicTimeLine(SelectedClinic, curday()).then((appointments) => {
                    settodayTimeLineErrMess(undefined)
                    setTodayAppointments(appointments)
                })
                    .catch(error => {
                        settodayTimeLineErrMess(error.message)
                    })
            }
            else {
                getClinicTimeLine(1, curday()).then((appointments) => {
                    settodayTimeLineErrMess(undefined)
                    setTodayAppointments(appointments)
                })
                    .catch(error => {
                        settodayTimeLineErrMess(error.message)
                    })
            }
        })
            .catch(error => {
                setAcceptAppointmentErrMess(error.message)
            })
       })
       .catch((error) => setAcceptAppointmentErrMess(error.message))
    }

    const handleReject = (event) => appointmentId => {
        event.preventDefault()
        let values = { status: "Rejected" }
        console.log(values, appointmentId)
        rejectAppointment(values, appointmentId).then(() => {
            props.rejectAppointment(appointmentId)
        })
            .catch(error => {
                setAcceptAppointmentErrMess(error.message)
            })
    }
    let appointment = props.appointments.appointments.map((appointment, index) => (
        <Card className="ps-3 pe-2" key={appointment.id}>
            <Card.Body style={{ position: "relative" }}>
                <Card.Title className="mb-2">
                    <PatientsName patientId={appointment.patientId} />
                </Card.Title>
                {
                    !selectedDoctor ?
                        <Card.Subtitle className="mb-1">
                            {getDoctorName(appointment.doctorId)}
                        </Card.Subtitle>
                        : <></>
                }
                <Card.Subtitle className="mt-1" style={{ color: '#010a43' }}>
                    {appointment.type}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">{appointment.title}</Card.Subtitle>
                <LocalForm onSubmit={(values) => handleAccept(values, appointment.id ,appointment.doctorId )}>
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
                                    <Control type="date" model=".date" className="form-control" id={appointment.id} defaultValue={appointment.date}  onChange={(event) => handleChangeDate(event.target.value) }/>
                                </Col>
                            </Row>
                        </Card.Text>
                        <div style={{
                            flex: "none",
                            flexGrow: "2",
                            textAlign: "right"
                        }} className="d-md-block d-none">
                            <HideForType type={["Admin"]}>
                                <button className="acceptButton me-2">
                                    <span className="fa fa-check ps-1 pe-1" type="submit"></span></button>
                                <button className="rejectButton me-2" onClick={(event) => handleReject(event)(appointment.id)}>
                                    <span className="fa fa-ban ps-1 pe-1" ></span></button>
                            </HideForType>
                            <CustomToggle eventKey={appointment.id} date={appointment.date}>Expand</CustomToggle>
                        </div>
                        <div className="d-md-none d-block">
                            <HideForType type={["Admin"]}>
                                <button className="acceptButton me-2" type="submit">
                                    <span className="fa fa-check me-2"></span>Accept</button>
                            </HideForType>
                            <CustomToggle eventKey={appointment.id} date={appointment.date}>Expand</CustomToggle>
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
                                    {timeLineFoappointment}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    ))
    let error = false
    if (props.appointments.loading || props.patients.isLoading || props.doctors.isLoading || doctorsIsLoading || clinicsIsLoading) {
        return <Loading />
    }
    if (props.appointments.errMess) {
        error = true
    }

    const selectDoctor = (event) => {
        let doctorId = event.target[event.target.selectedIndex].id
        if (doctorId == 0) {
            props.fetchPendingAppointments(SelectedClinic || 1)
            getClinicTimeLine(SelectedClinic || 1, curday()).then((appointments) => {
                settodayTimeLineErrMess(undefined)
                setTodayAppointments(appointments)
            })
                .catch(error => {
                    settodayTimeLineErrMess(error.message)
                })
            setSelectedDoctor(undefined)
        }
        else {
            setSelectedDoctor(doctorId)
            getDoctorTimeLine(doctorId, curday()).then((appointments) => {
                settodayTimeLineErrMess(undefined)
                setTodayAppointments(appointments)
            })
                .catch(error => {
                    settodayTimeLineErrMess(error.message)
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
            settodayTimeLineErrMess(undefined)
            setTodayAppointments(appointments)
        }
        )
            .catch(error => {
                settodayTimeLineErrMess(error.message)
            })
    }
    let clinicSelectors = clinics.map((clinic) => (
        <option key={clinic.clinic.id} id={clinic.clinic.id}>{clinic.clinic.name}</option>
    ))
    let doctorSelectors = doctors.map((doctor) => (
        <option key={doctor.doctor.id} id={doctor.doctor.id}>{doctor.doctor.firstName + ' ' + doctor.doctor.lastName}</option>
    ))
    doctorSelectors.unshift(<option key="0" id="0">All Doctor</option>)

    const ErrorAlertComponents = () => {
        if (acceptAppointmentErrMess) {
            return <Alert variant="danger" className="mt-2 mb-1" style={{
                width: "fit-content",
                margin: "0 auto",
                position: "absolute",
                top: "-5%",
                transform: "translate(-50% , 0)"
                , left: "50%"
                , zIndex: 1
            }} dismissible onClose={() => setAcceptAppointmentErrMess(undefined)}>
                <Alert.Heading>Error !</Alert.Heading>
                {acceptAppointmentErrMess}
            </Alert>
        }
        else {
            return <></>
        }
    }
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
                    <HideForType type={["Admin"]}>
                        <Button style={{
                            "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                            "marginBottom": "-13px", "marginRight": "7px"
                        }} onClick={() => nextPath(`addAppointments`)}><span className="fa fa-plus"></span></Button>
                    </HideForType>
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
                <div className="pageContainer" style={{position : "relative"}}>
                    <div className="appointmentsButton">
                        
                    <OverlayTrigger
                trigger="click"
                placement="bottom"
                rootClose 
                overlay={
                    <Popover >
                        <Popover.Content>
                            <div className="d-grid">
                                <Button variant="link" disabled >
                                    Pending
                                </Button>
                                <Button variant="link"   onClick={(event) => {
                                        event.preventDefault()
                                        props.history.push('/dashboard/appointments/rejected')}}>
                                    Rejected
                                </Button>
                                <Button variant="link" onClick={(event) => {
                                        event.preventDefault()
                                        props.history.push('/dashboard/appointments/cancelled')}} >
                                    Cancelled
                                </Button>
                                <Button variant="link" onClick={(event) => {
                                        event.preventDefault()
                                        props.history.push('/dashboard/appointments/done')}} >
                                    Done
                                </Button>
                                <Button variant="link" onClick={(event) => {
                                        event.preventDefault()
                                        props.history.push('/dashboard/appointments/gone')}} >
                                    Gone
                                </Button>
                              
                            </div>
                        </Popover.Content>
                    </Popover>
                }>
                <span className="fas fa-ellipsis-v" style={{fontSize : "19px"}}></span>
            </OverlayTrigger>
                    
                    </div>
                    <ErrorAlertComponents />
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
                        {doctorsErrMess || clinicsErrMess || error || props.appointments.appointments.length === 0 ? <Col xs={12}>
                            <ErrorAlert messege={doctorsErrMess || clinicsErrMess || props.appointments.errMess || "Error 404:There are no appointments for this clinics"} color="#ffffff" />
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
    acceptAppointment: (appointmentId) => dispatch(acceptAppointment(appointmentId)),
    rejectAppointment: (appointmentId) => dispatch(rejectAppointment(appointmentId))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Appointments))
