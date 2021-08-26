import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Card, Container, Image, OverlayTrigger, Pagination, Popover, Row, Alert } from 'react-bootstrap'
import { Control, LocalForm } from 'react-redux-form';
import { Link, withRouter } from 'react-router-dom'
import ErrorAlert from '../../helpers/ErrorAlert';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import { connect } from 'react-redux';

function AppointmentsToolKit(props) {
    let [appointments, setAppointments] = useState([])
    let [searchedAppointments, setSearchedAppointments] = useState([])
    let [appointmentsErrMess, setAppointmentsErrMess] = useState()
    let [appointmentIsLoading, setAppointmentsIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [showReset, setShowReset] = useState(false)
    const [searchErrMess, setSearchErrMess] = useState()
    const [searchValue, setSearchValue] = useState([])
    const getAppointments = (type, date) => {
        setAppointmentsIsLoading(true)
        fetch(baseUrl + `api/appointments/type/${type}/date/${date}`, {
            method: "GET",
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
            .then((appointments) => {
                setAppointments(appointments)
                setSearchedAppointments(appointments)
                setAppointmentsIsLoading(false)
            })
            .catch((error) => {
                setAppointmentsErrMess(error.message)
                setAppointmentsIsLoading(false)
            })
    }

    useEffect(() => {
        getAppointments(props.type, new Date().toLocaleDateString('pt-br').split('/').reverse().join('-'))
    }, [])

    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const handleSearch = (values) => {
        if (searchValue?.length > 0) {
            let patient = props.patients.patients.filter((patient) => {
                let str = patient.patient.firstName + ' ' + patient.patient.lastName
                return str.includes(values.searchQuery)
            })[0]
            if (!patient) {
                setSearchErrMess("there is no patient with this name")
                return
            }
            let list = appointments.filter((appointment) => appointment.patientId === patient.patient.id)
            if (list.length === 0) {
                setSearchErrMess("there is no patient with this name")
                return
            }
            setSearchedAppointments(list)
        }
    }
    const handleChange = (value) => {
        setSearchValue(value)
        if (value.length > 0) {
            setShowReset(true)
        }
        else if (value.length === 0) {
            setSearchedAppointments([...appointments])
            setShowReset(false)
        }
    }
    const handleChangeDate = (event) => {
        setAppointmentsErrMess(undefined)
        getAppointments(props.type, event.target.value)
    }
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const filterdAppointments = searchedAppointments.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(appointments.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }
    const PatientsName = ({ patientId }) => {
        let patient = props.patients.patients.filter((patient) => patient.patient.id === patientId)[0]
        return patient.patient.firstName + ' ' + patient.patient.lastName
    }
    function getDoctorName(appointmentId) {
        let doctor = props.doctors.doctors.filter((doctor) => doctor.doctor.id === appointmentId)[0]
        return 'Dr. ' + doctor.doctor.firstName + ' ' + doctor.doctor.lastName
    }
    const appointmentsList = filterdAppointments.map((appointment, index) => (
        <Card className="ps-5 pt-2 pe-2" key={appointment.id}>
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
                <LocalForm>
                    <div className="d-md-flex d-block">
                        <Card.Text>
                            {appointment.description} <br></br>
                            <Row className="mt-2">
                                <Col md="auto">
                                    <Control type="time" readOnly model=".startTime" className="form-control" defaultValue={appointment.startTime} />
                                </Col>
                                <Col md="auto" className="mt-2">
                                    <p>{"to"}</p>
                                </Col>
                                <Col md="auto">
                                    <Control type="time" readOnly model=".endTime" className="form-control" id={appointment.id} defaultValue={appointment.endTime}
                                    />
                                </Col>
                                <Col md="auto" className="mt-3 mt-md-0">
                                    <Control type="date" readOnly model=".date" className="form-control" id={appointment.id} defaultValue={appointment.date} />
                                </Col>
                            </Row>
                        </Card.Text>
                    </div>
                </LocalForm>
            </Card.Body>
        </Card>
    ))
    const ErrorAlertComponents = () => {
        if (searchErrMess) {
            return <Alert variant="danger" className="mt-2 mb-1" style={{
                width: "fit-content",
                margin: "0 auto",
                position: "absolute",
                top: "2%",
                transform: "translate(-50% , 0)"
                , left: "50%"
                , zIndex: 1
            }} dismissible onClose={() => setSearchErrMess(undefined)}>
                <Alert.Heading>Error !</Alert.Heading>
                {searchErrMess}
            </Alert>
        }
        else {
            return <></>
        }
    }
    const getItem = () => {
        if (props.type === "Cancelled") {
            return (<Image width={172} src='.\assets\images\undraw_stranded_traveler_pdbw (1).svg'></Image>)
        }
        else if (props.type === "Rejected") {
            return (<Image width={172} src='.\assets\images\undraw_cancel_u1it (1).svg'></Image>)
        }
        else if (props.type === "Gone") {
            return (<Image width={172} src='.\assets\images\undraw_Receipt_re_fre3.svg'></Image>)
        }
        else if (props.type === "Done") {
            return (<Image width={172} src='.\assets\images\undraw_Done_re_oak4.svg'></Image>)
        }
        else {
            return (<Image width={172} src='.\assets\images\undraw_Order_confirmed_re_g0if.svg'></Image>)
        }
    }
    return (
        <div className="mt-2">

            <Breadcrumb>
                <Breadcrumb.Item className="pl-3 mt-1" href="#">
                    <Link to={`/dashboard`}>
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className="pl-3 mt-1" href="#">
                    <Link to={`/dashboard/appointments`}>
                        Appointments
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className="mr-auto mt-1" active href="#">
                    {props.type + "  Appointments"}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Container fluid >
                <ErrorAlertComponents />
                <div className="pageContainer" style={{ position: "relative" }}>
                    <div className="appointmentsButton mt-4 pt-1">

                        <OverlayTrigger
                            trigger="click"
                            placement="bottom"
                            rootClose
                            overlay={
                                <Popover>
                                    <Popover.Content>
                                        <div className="d-grid">
                                            <Button variant="link" onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments')
                                            }} >
                                                Pending
                                            </Button>
                                            <Button variant="link" disabled={props.type === "Accepted" ? true : false} onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/accepted')
                                            }}>
                                                Accepted
                                            </Button>
                                            <Button variant="link" disabled={props.type === "Rejected" ? true : false} onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/rejected')
                                            }}>
                                                Rejected
                                            </Button>
                                            <Button variant="link" disabled={props.type === "Cancelled" ? true : false} onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/cancelled')
                                            }} >
                                                Cancelled
                                            </Button>
                                            <Button variant="link" disabled={props.type === "Done" ? true : false} onClick={(event) => {
                                                event.preventDefault()
                                                props.history.push('/dashboard/appointments/done')
                                            }} >
                                                Done
                                            </Button>
                                            <Button variant="link" disabled={props.type === "Gone" ? true : false} onClick={(event) => {
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
                            <h4>{props.type + "  Appointments"}</h4>
                        </Col>
                        <Col xs={12}>
                            <Container fluid className="mb-2 mt-4">
                                <Row>
                                    <Col>
                                        <div style={{ position: 'relative', width: '132px', margin: '0 auto' }} className="mt-2 mb-2">
                                            {getItem()}
                                        </div>
                                        <div className="mt-2 mb-2">
                                            <LocalForm model="searchBox" className="text-center" onSubmit={(values) => handleSearch(values)} >
                                                <Row style={{ alignItems: "flex-end" }} className="mb-3 mt-3 justify-content-md-center">
                                                    <Col className="col-12 col-md-6 mb-2 mb-md-0 order-1 order-md-1" style={{ position: "relative" }}>
                                                        <Control type="text" value={searchValue} placeholder="search.." className="form-control" model=".searchQuery"
                                                            onChange={(event) => handleChange(event.target.value)} />
                                                        {showReset ? <Button variant="link" className="me-3" style={{ position: "absolute", top: "0", right: "0" }}
                                                            onClick={() => {
                                                                setShowReset(false)
                                                                setSearchErrMess(undefined)
                                                                setSearchedAppointments([...appointments])
                                                                setSearchValue('')
                                                            }}
                                                        >Reset</Button> : <></>}
                                                    </Col>
                                                    <Col className="col-12  col-md-1 mb-2 mb-md-0 order-3 order-md-2">
                                                        <Button variant="outline-success mt-2 text-center w-auto" type="submit">Search</Button>
                                                    </Col>
                                                    <Col className="col-12 col-md-12 order-2 mt-md-3 order-md-3">
                                                        <Row className="justify-content-md-center">
                                                            <Col className="col-12 col-md-4">
                                                                <Control type="date" onChange={handleChangeDate} className="form-control" model=".searchDate" defaultValue={new Date().toLocaleDateString('pt-br').split('/').reverse().join('-')}></Control>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                            </LocalForm>
                                        </div>
                                        {
                                            appointmentIsLoading ? <Loading /> :
                                                appointmentsErrMess ?
                                                    <Col xs={12}>
                                                        <ErrorAlert messege={appointmentsErrMess} color="#ffffff" />
                                                    </Col> :
                                                    <div>
                                                        {appointmentsList}
                                                    </div>
                                        }


                                    </Col>
                                    {appointmentsErrMess ? <></> :
                                        <center className="mt-2">
                                            <div className="text-center">
                                                <Pagination>{items}</Pagination>
                                            </div>
                                        </center>

                                    }

                                </Row>
                            </Container>
                        </Col>

                    </Row>
                </div>
            </Container>
        </div>
    );
}

const mapStateTopProps = (state) => ({
    doctors: state.doctors,
    patients: state.patients
})

export default withRouter(connect(mapStateTopProps)(AppointmentsToolKit));