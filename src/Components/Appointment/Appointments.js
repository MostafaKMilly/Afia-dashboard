import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Breadcrumb, Button, Card, Col, Container, Modal, OverlayTrigger, Popover, Row, useAccordionToggle } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import { acceptAppointment, changePendingAppointments, fetchPendingAppointments, fetchPendingAppointmentsByDate, rejectAppointment, updateAppointmetns, updateAppointmetnsByDate } from '../../redux/Actions/AppointmentsActions';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import ErrorAlert from '../../helpers/ErrorAlert'
import { LocalForm, Control } from 'react-redux-form'
import HideForType from '../../helpers/HideForType';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Appointments(props) {
    let [doctors, setDoctors] = useState([])
    let [clinics, setClinics] = useState([])
    let [todayAppointments, setTodayAppointments] = useState([])
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
    let [date, setDate] = useState()
    let [showReset, setShowReset] = useState(false)
    let [searchValue, setSearchValue] = useState()
    let [autoAcceptErrMess, setAutoAcceptErrMess] = useState()
    const [autoAcceptedList, setAutoAcceptedAutoList] = useState([])
    const [showAcceptModal, setShowAcceptModal] = useState(false)
    const [searchErrMess, setSearchErrMess] = useState()
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
        const getDoctorsForClinic = () => fetch(baseUrl + 'api/doctors/clinic/' + props.clinics.clinics[0]?.clinic?.id, {
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
        props.fetchPendingAppointments(props.clinics.clinics[0]?.clinic?.id)
    }, [])
    const CustomToggle = ({ children, eventKey, date }) => {
        const decoratedOnClick = useAccordionToggle(eventKey)
        return (
            <button className="iconBtn" type="button" onClick={() => {
                decoratedOnClick()
                handleExpand(updatedDate || date)
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
        hours = hours ? hours : 12;
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
            getClinicTimeLine(props.clinics.clinics[0]?.clinic?.id, date).then((appointments) => {
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
            getClinicTimeLine(props.clinics.clinics[0]?.clinic?.id, date).then((appointments) => {
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
        <div className="timeline-step" key={appointment.id}>
            <div className="timeline-content" data-toggle="popover" data-trigger="hover">
                <div className="inner-circle"></div>
                <p className="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                <p className="h6 text-muted mb-1">
                    <PatientsName patientId={appointment.patientId} />
                </p>
                {
                    !selectedDoctor ? <p className="h6  mb-0 mb-lg-0" style={{ color: "#ff3467" }}>
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
        <div className="timeline-step" key={appointment.id}>
            <div className="timeline-content" data-toggle="popover" data-trigger="hover">
                <div className="inner-circle"></div>
                <p className="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                <p className="h6 text-muted mb-0 mb-lg-0">
                    <PatientsName patientId={appointment.patientId} />
                </p>
            </div>
        </div>
    ))) : <p>{appointmentsTimeLineErrMess}</p>
    function getDoctorName(appointmentId) {
        let doctor = props.doctors.doctors.filter((doctor) => doctor.doctor.id === appointmentId)[0]
        return 'Dr. ' + doctor.doctor.firstName + ' ' + doctor.doctor.lastName
    }
    const handleAccept = (values, appointmentId, doctorId) => {
        let valuesObject = { ...values, day: daysInWeek[new Date(values.date).getDay()], status: 'Accepted' }
        getAvailableTimes(valuesObject.date, valuesObject.day, doctorId)
            .then((availableTimes) => {
                let valid = false
                availableTimes.forEach((element) => {
                    if (valuesObject.startTime >= element.startTime.slice(0, 5) && valuesObject.endTime.slice(0, 5) <= element.endTime) {
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
                    if (selectedDoctor && date) {
                        getDoctorTimeLine(selectedDoctor, date).then((appointments) => {
                            settodayTimeLineErrMess(undefined)
                            setTodayAppointments(appointments)
                        })
                            .catch(error => {
                                settodayTimeLineErrMess(error.message)
                            })
                    }
                    else if (SelectedClinic && date) {
                        getClinicTimeLine(SelectedClinic, date).then((appointments) => {
                            settodayTimeLineErrMess(undefined)
                            setTodayAppointments(appointments)
                        })
                            .catch(error => {
                                settodayTimeLineErrMess(error.message)
                            })
                    }
                    else if (date) {
                        getClinicTimeLine(props.clinics.clinics[0]?.clinic?.id, date).then((appointments) => {
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
        rejectAppointment(values, appointmentId).then(() => {
            props.rejectAppointment(appointmentId)
        })
            .catch(error => {
                setAcceptAppointmentErrMess(error.message)
            })
    }

    const DateComponent = (propsValus) => {
        let [date, setDate] = useState()
        let [validDateList, setValidDatesList] = useState([])
        const getValidDates = (doctorId) => {
            return fetch(baseUrl + 'api/doctors/working_days/id/' + doctorId, {
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
            if (propsValus) {
                setDate(new Date(propsValus.dateValue))
                getValidDates(propsValus.doctorId).then((workingDays) => {
                    let arr = []
                    workingDays.forEach((workingDay) => {
                        arr.push(new Date(workingDay.date))
                    })
                    setValidDatesList(arr)
                })
                    .catch((error) => setValidDatesList([]))
            }

        }, [])
        if (props.patients.isLoading || props.doctors.isLoading || doctorsIsLoading || props.clinics.isLoading || clinicsIsLoading) {
            return <Loading />
        }

        return <DatePicker selected={date} includeDates={validDateList} {...propsValus} onChange={(date) => {
            propsValus.onChange(date.toLocaleDateString('pt-br').split('/').reverse().join('-'))
            handleChangeDate(date.toLocaleDateString('pt-br').split('/').reverse().join('-'))
        }} />
    }

    let appointment = props.appointments.appointments.map((appointment, index) => (
        <Card className="ps-3 pe-2" key={appointment.id} style={{ overflow: 'visible' }}>
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
                <LocalForm onSubmit={(values) => handleAccept(values, appointment.id, appointment.doctorId)}>
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
                                    <Control type="time" model=".endTime" className="form-control" id={appointment.id} defaultValue={appointment.endTime}/>
                                </Col>
                                <Col md="auto" className="mt-3 mt-md-0">
                                    <Control model=".date" className="form-control" component={DateComponent} id={appointment.id} mapProps={{ dateValue: appointment.date, doctorId: appointment.doctorId }} defaultValue={appointment.date} />
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
                                <div className="timeline-steps aos-init aos-animate">
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

    if (props.appointments.errMess) {
        error = true
    }

    const selectDoctor = (event) => {
        setDate('')
        setSearchValue('')
        setSearchErrMess('')
        settodayTimeLineErrMess(undefined)
        setTodayAppointments([])
        let doctorId = event.target[event.target.selectedIndex].id
        if (doctorId === 0) {
            props.fetchPendingAppointments(SelectedClinic || props.clinics.clinics[0]?.clinic?.id)
            setSelectedDoctor(undefined)
        }
        else {
            setSelectedDoctor(doctorId)
            props.updateAppointments(doctorId)
        }
    }
    const selectClinic = (event) => {
        setDate('')
        setSearchValue('')
        setSearchErrMess('')
        settodayTimeLineErrMess(undefined)
        setTodayAppointments([])
        let clinicId = event.target[event.target.selectedIndex].id
        setSelectedClinic(clinicId)
        let doctorArray = props.doctors.doctors.filter((doctor) => doctor.doctor.clinicId == clinicId)
        setDoctors(doctorArray)
        props.fetchPendingAppointments(clinicId)
    }
    let clinicSelectors = clinics.map((clinic) => (
        <option key={clinic.clinic.id} id={clinic.clinic.id}>{clinic.clinic.name}</option>
    ))
    let doctorSelectors = doctors.map((doctor) => (
        <option key={doctor.doctor.id} id={doctor.doctor.id}>{doctor.doctor.firstName + ' ' + doctor.doctor.lastName}</option>
    ))
    doctorSelectors.unshift(<option key="0" id="0">All Doctor</option>)

    const ErrorAlertComponents = () => {
        if (acceptAppointmentErrMess || searchErrMess || autoAcceptErrMess) {
            return <Alert variant="danger" className="mt-2 mb-1" style={{
                width: "fit-content",
                margin: "0 auto",
                position: "absolute",
                top: "2%",
                transform: "translate(-50% , 0)"
                , left: "50%"
                , zIndex: 1
            }} dismissible onClose={() => {
                setAcceptAppointmentErrMess(undefined)
                setSearchErrMess(undefined)
                setAutoAcceptErrMess(undefined)
            }}>
                <Alert.Heading>Error !</Alert.Heading>
                {acceptAppointmentErrMess || searchErrMess || autoAcceptErrMess}
            </Alert>
        }
        else {
            return <></>
        }
    }
    function addMinutes(time, minsToAdd) {
        function D(J) { return (J < 10 ? '0' : '') + J; };
        var piece = time.split(':');
        var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

        return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
    }

    const handleChangeSearchDate = (event) => {
        setDate(event.target.value)
        settodayTimeLineErrMess(undefined)
        setTodayAppointments([])
        if (selectedDoctor) {
            props.updateAppointmentsByDate(selectedDoctor, event.target.value)
        }
        else if (SelectedClinic) {
            props.fetchPendingAppointmentsByDate(SelectedClinic, event.target.value)
        }
        else {
            props.fetchPendingAppointmentsByDate(props.clinics.clinics[0]?.clinic?.id, event.target.value)
        }
        if (selectedDoctor) {
            getDoctorTimeLine(selectedDoctor, event.target.value).then((appointments) => {
                settodayTimeLineErrMess(undefined)
                setTodayAppointments(appointments)
            })
                .catch(error => {
                    settodayTimeLineErrMess(error.message)
                })
        }
        else if (SelectedClinic) {
            getClinicTimeLine(SelectedClinic, event.target.value).then((appointments) => {
                settodayTimeLineErrMess(undefined)
                setTodayAppointments(appointments)
            })
                .catch(error => {
                    settodayTimeLineErrMess(error.message)
                })
        }
        else {
            getClinicTimeLine(props.clinics.clinics[0]?.clinic?.id, event.target.value).then((appointments) => {
                settodayTimeLineErrMess(undefined)
                setTodayAppointments(appointments)
            })
                .catch(error => {
                    settodayTimeLineErrMess(error.message)
                })
        }

    }

    const handleGetAllPendingAppointments = (event) => {
        event.preventDefault()
        setDate('')
        settodayTimeLineErrMess(undefined)
        setTodayAppointments([])
        setSearchValue('')
        setSearchErrMess('')
        if (selectedDoctor) {
            props.updateAppointments(selectedDoctor)
        }
        else if (SelectedClinic) {
            props.fetchPendingAppointments(SelectedClinic)
        }
        else {
            props.fetchPendingAppointments(props.clinics.clinics[0]?.clinic?.id)
        }
    }
    const resetAppointments = () => {
        if (date && date.length > 0) {
            if (selectedDoctor) {
                props.updateAppointmentsByDate(selectedDoctor, date)
            }
            else if (SelectedClinic) {
                props.fetchPendingAppointmentsByDate(SelectedClinic, date)
            }
            else {
                props.fetchPendingAppointmentsByDate(props.clinics.clinics[0]?.clinic?.id, date)
            }
        }
        else {
            if (selectedDoctor) {
                props.updateAppointments(selectedDoctor)
            }
            else if (SelectedClinic) {
                props.fetchPendingAppointments(SelectedClinic)
            }
            else {
                props.fetchPendingAppointments(props.clinics.clinics[0]?.clinic?.id)
            }
        }
    }
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value)
        if (event.target.value.length > 0) {
            setShowReset(true)
        }
        else if (event.target.value.length === 0) {
            resetAppointments()
            setShowReset(false)
        }
    }
    const handleSearch = (values) => {
        setSearchErrMess('')
        if (values.searchQuery?.length > 0) {
            let patient = props.patients.patients.filter((patient) => {
                let str = patient.patient.firstName + ' ' + patient.patient.lastName
                return str.includes(values.searchQuery)
            })[0]
            if (!patient) {
                setSearchErrMess("there is no patient with this name")
                return
            }
            let arr = props.appointments.appointments.filter((appointment) => appointment.patientId === patient.patient.id)
            if (arr.length === 0) {
                setSearchErrMess("there is no patient with this name")
                return
            }
            props.changeAppointment(arr)
        }
    }

    const handleAutoAccept = (event) => {
        event.preventDefault()
        setAutoAcceptedAutoList([])
        let list = []
        getAvailableTimes(date, daysInWeek[new Date(date).getDay()], selectedDoctor)
            .then((availableTimes) => {
                availableTimes.forEach((availableTime) => {
                    let startTime = availableTime.startTime.slice(0, 5)
                    props.appointments.appointments.forEach((appointment) => {
                        let diff = (new Date(`Wed Aug 25 2021 ${appointment.endTime}`) -
                            new Date(`Wed Aug 25 2021 ${appointment.startTime}`)) / 60000
                        let endTime = addMinutes(startTime, diff)
                        if (endTime < availableTime.endTime.slice(0, 5) && !list.filter((item) => item.id === appointment.id)[0]) {
                            list.push({
                                id: appointment.id, startTime, endTime, doctorId: appointment.doctorId, date: appointment.date, day: appointment.day,
                                patientId: appointment.patientId
                            })
                            startTime = endTime
                        }
                        else {
                            return
                        }
                    })
                })
                if (list.length > 0) {
                    setAutoAcceptedAutoList(list)
                    setShowAcceptModal(true)
                }
                else {
                    setAutoAcceptErrMess("the day is full")
                }
            })
            .catch((error) => setAutoAcceptErrMess(error.message))
    }

    const handleAcceptAutoSaveModal = (event) => {
        event.preventDefault()
        let list = [...autoAcceptedList]
        list.forEach((item) => {
            handleAccept({ startTime: item.startTime, endTime: item.endTime, date: item.date }, item.id, item.doctorId)
        })
        setShowAcceptModal(false)
    }
    const autoAcceptTimeLine = autoAcceptedList.concat(todayAppointments).sort((a, b) => {
        if (a.startTime < b.startTime) {
            return -1
        }
        if (a.startTime > b.startTime) {
            return 1
        }
        return 0
    })
        .map((appointment => (
            <div className="timeline-step">
                <div className="timeline-content" data-toggle="popover" data-trigger="hover">
                    <div className="inner-circle"></div>
                    <p className="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                    <p className="h6 text-muted mb-1">
                        <PatientsName patientId={appointment.patientId} />
                    </p>
                    {
                        !selectedDoctor ? <p className="h6  mb-0 mb-lg-0" style={{ color: "#ff3467" }}>
                            <DoctorName doctorId={appointment.doctorId} />
                        </p> : <></>
                    }

                </div>
            </div>
        )))
    return (
        <div className="mt-2">
            <ErrorAlertComponents />
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
                <div className="pageContainer" style={{ position: "relative" }}>

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
                                            <Button variant="link" onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/accepted')
                                            }}>
                                                Accepted
                                            </Button>
                                            <Button variant="link" onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/rejected')
                                            }}>
                                                Rejected
                                            </Button>
                                            <Button variant="link" onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/cancelled')
                                            }} >
                                                Cancelled
                                            </Button>
                                            <Button variant="link" onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/done')
                                            }} >
                                                Done
                                            </Button>
                                            <Button variant="link" onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/gone')
                                            }} >
                                                Gone
                                            </Button>

                                        </div>
                                    </Popover.Content>
                                </Popover>
                            }>
                            <span className="fas fa-ellipsis-v" style={{ fontSize: "19px" }}></span>
                        </OverlayTrigger>

                    </div>

                    <Row className="mb-4">
                        <Col xs={12} className="mt-3 text-center">
                            <h4>Appointments</h4>
                        </Col>
                        <Col xs={12}>
                            <Container fluid className="mb-2 mt-4">
                                <Row>
                                    <Col>
                                        <div className="timeline-steps aos-init aos-animate">
                                            {timeline}
                                        </div>
                                        <div className="mt-2 mb-2">
                                            <LocalForm model="searchBox" className="text-center" onSubmit={(values) => handleSearch(values)}>
                                                <Row style={{ alignItems: "flex-end" }} className="mb-3 mt-3 justify-content-md-center">
                                                    <Col className="col-12 col-md-6 mb-2 mb-md-0 order-1 order-md-1" style={{ position: "relative" }}>
                                                        <Control value={searchValue} type="text" placeholder="search.." className="form-control" model=".searchQuery" onChange={handleSearchChange} />
                                                        {showReset && searchValue?.length > 0 ? <Button variant="link" className="me-3" style={{ position: "absolute", top: "0", right: "0" }}
                                                            onClick={() => {
                                                                setShowReset(false)
                                                                setSearchValue('')
                                                                setSearchErrMess(undefined)
                                                                resetAppointments()
                                                            }}
                                                        >Reset</Button> : <></>}
                                                    </Col>
                                                    <Col className="col-12  col-md-1 mb-2 mb-md-0 order-3 order-md-2">
                                                        <Button variant="outline-success mt-2 text-center w-auto" type="submit">Search</Button>
                                                    </Col>
                                                    <Col className="col-12 col-md-12 order-2 mt-md-3 order-md-3">
                                                        <Row className="justify-content-md-center">
                                                            <Col className="col-12 col-md-4">
                                                                <Control type="date" value={date} onChange={handleChangeSearchDate} className="form-control" model=".searchDate"></Control>

                                                            </Col>
                                                            <Col className="col-12 col-md-1 mt-3 mb-2 mb-md-0 mt-md-0 pe-md-1 align-self-center">

                                                                <button className="submitButton" onClick={handleGetAllPendingAppointments}>

                                                                    <span className="fa fa-stream ms-2 me-2 d-inline"></span>All

                                                                </button>

                                                            </Col>
                                                            {selectedDoctor && date && props.appointments.appointments.length > 0 ?
                                                                <Col className="col-12 col-md-2 mt-3 mb-2 mb-md-0 mt-md-0  align-self-center">
                                                                    <Button className="loginBtn" onClick={handleAutoAccept}>
                                                                        <span className="fa fa-check-double me-2 d-inline"></span>Auto Accept
                                                                    </Button>
                                                                </Col> : <></>}

                                                        </Row>
                                                    </Col>
                                                </Row>

                                            </LocalForm>
                                        </div>
                                        {
                                            props.appointments.isLoading ? <Loading /> :
                                                <Accordion>
                                                    {appointment}
                                                </Accordion>
                                        }
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        {doctorsErrMess || clinicsErrMess || error || (props.appointments.appointments.length === 0 && !props.appointments.isLoading) ? <Col xs={12}>
                            <ErrorAlert messege={doctorsErrMess || clinicsErrMess || props.appointments.errMess || "Error 404:There are no appointments for this clinics"} color="#ffffff" />
                        </Col> : <></>}
                    </Row>
                </div>
                <Modal size="xl" show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Confirm auto
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="timeline-steps aos-init aos-animate">
                            {autoAcceptTimeLine}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
                            Close
                        </Button>
                        <Button className="loginBtn" onClick={handleAcceptAutoSaveModal}>
                            Accept
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}
const mapStateToProps = (state) => ({
    appointments: state.appointments,
    patients: state.patients,
    doctors: state.doctors,
    clinics: state.clinics
})

const mapDispatchToProps = (dispatch) => ({
    fetchPendingAppointments: (id) => dispatch(fetchPendingAppointments(id)),
    fetchPendingAppointmentsByDate: (id, date) => dispatch(fetchPendingAppointmentsByDate(id, date)),
    updateAppointments: (id) => dispatch(updateAppointmetns(id)),
    updateAppointmentsByDate: (id, date) => dispatch(updateAppointmetnsByDate(id, date)),
    changeAppointment: (list) => dispatch(changePendingAppointments(list)),
    acceptAppointment: (appointmentId) => dispatch(acceptAppointment(appointmentId)),
    rejectAppointment: (appointmentId) => dispatch(rejectAppointment(appointmentId))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Appointments))
