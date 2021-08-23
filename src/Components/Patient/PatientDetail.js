import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Container, Row, Image, Card, Alert, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import BootstrapTable from "react-bootstrap-table-next"
import { pageButtonRenderer } from '../../helpers/pageButtonRenderer'
import paginationFactory from 'react-bootstrap-table2-paginator';
import HideForType from '../../helpers/HideForType'
import EditPersonalInfoPatient from '../../modals/EditPersonalInfoPatient';
import { getPatientMedicalFile } from '../../redux/Actions/PatientAction';

function PatientDetail(props) {
    const [cancelledAppointments, setCancelledAppointments] = useState([])
    const [cancelledAppointmentsIsLoading, setCancelledAppointmentsIsLoading] = useState(true)
    const [errMess, setErrMess] = useState()
    const [medciens, setMedcines] = useState([])
    const [medciensIsLoading, setMedcinesIsLoading] = useState(true)
    const [medciensErrMess, setMedcinesErrMess] = useState()
    const [sessions, setSessions] = useState([])
    const [sessionsErrMess, setSessionsErrMess] = useState()
    const [sessionsIsLoading, setSessionsIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showLoadingAlert, setShowLoadingAlert] = useState(true)
    useEffect(() => {
        const getCannceledAppoinments = () => {
            fetch(baseUrl + 'api/statistics/canceled_appointments/id/' + props.patient?.patient.id, {
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
                .then(cannceledAppoinments => {
                    setCancelledAppointments(cannceledAppoinments)
                    setCancelledAppointmentsIsLoading(false)
                })
                .catch(error => {
                    setErrMess(error.message)
                    setCancelledAppointmentsIsLoading(false)
                })
        }
        getCannceledAppoinments()
        const getMedcines = () => {
            fetch(baseUrl + 'api/patients/medicines/id/' + props.patient?.patient.id, {
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
                .then(medciens => {
                    setMedcines(medciens)
                    setMedcinesIsLoading(false)
                })
                .catch(error => {
                    setMedcinesErrMess(error.message)
                    setMedcinesIsLoading(false)
                })
        }
        getMedcines()
        const getSessions = () => {
            fetch(baseUrl + 'api/appointments/full/id/' + props.patient?.patient.id, {
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
                .then(sessions => {
                    setSessions(sessions)
                    setSessionsIsLoading(false)
                })
                .catch(error => {
                    setSessionsErrMess(error.message)
                    setSessionsIsLoading(false)
                })
        }
        getSessions()
    }, [])

    if (props.patients.isLoading || cancelledAppointmentsIsLoading || medciensIsLoading || sessionsIsLoading || props.doctors.isLoading) {
        return <Loading />
    }

    let medcinesList = []
    medciens.forEach((medcine) => {
        medcine.name.split(' ').forEach((medcineName) => {
            medcinesList.push(medcineName)
        })
    })

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total ml-2">
            Showing {from} to {to} of {size} Results
        </span>
    );
    const options = {
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        disablePageTitle: true,
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '25', value: 25
        }, {
            text: '50', value: 50
        }, {
            text: '100', value: 100
        }, {
            text: 'All', value: sessions.length
        }],
        pageButtonRenderer,
    }
    function doctorNaneFormatter(cell, row) {
        let doctor = props.doctors.doctors.filter((doctor) => doctor.doctor.id === row.Appointment.doctorId)[0]
        return (doctor.doctor.firstName + ' ' + doctor.doctor.lastName)
    }
    const sessionsColumns = [{
        dataField: 'Appointment.id',
        text: 'Id'
    }, {
        dataField: 'Appointment.doctorId',
        text: 'Doctor Name',
        formatter: doctorNaneFormatter
    }, {
        dataField: 'Appointment.day',
        text: 'Day'
    },
    {
        dataField: 'Appointment.date',
        text: 'Date'
    }, {
        dataField: 'Appointment.type',
        text: 'Type'
    },
    ];

    const expandRow = {
        renderer: row => (
            <Container fluid>
                <Row>
                    <Col className="col-md-6 col-12 mb-2 mb-md-0 text-center">
                        <span className="fa fa-capsules me-1"></span>
                        {'Medciens  : ' + row.Session.medicine}
                    </Col>
                    <Col className="col-md-6 col-12 mb-2 mb-md-0 text-center">
                        <div>
                            <span className="fa fa-clipboard me-1"></span>Doctor Report :
                            <textarea className="form-control mt-2">{row.Session.doctorReport}</textarea>
                        </div>
                    </Col>
                    <Col className="col-md-12 col-12 mt-3 mb-3">
                        <Container>
                            <Row>
                                <p>Photos</p>
                                {row.Photo.map((photo) => (
                                    <Col className="col-md-4 col-12">
                                        <a href={photo.url} target="_blank">
                                            <Image fluid thumbnail src={photo.url} />
                                        </a>
                                    </Col>
                                ))}

                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        ),
        showExpandColumn: true,
        expandByColumnOnly: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => {
            if (isAnyExpands) {
                return <span className="fa fa-angle-up fa-sm"></span>;
            }
            return (<span className="fa fa-angle-down fa-sm"></span>);
        },
        expandColumnRenderer: ({ expanded }) => {
            if (expanded) {
                return <span className="fa fa-angle-up fa-sm"></span>;
            }
            return (
                <span className="fa fa-angle-down fa-sm"></span>
            );
        }
    };
    const ErrorAlert = () => {
        if (errMess) {
            return <Alert variant="danger" className="mt-2 mb-1" style={{
                width: "fit-content",
                margin: "0 auto",
                position: "absolute",
                top: "2%",
                transform: "translate(-50% , 0)"
                , left: "50%"
                , zIndex: 1
            }} dismissible onClose={() => setErrMess(undefined)}>
                <Alert.Heading>Error !</Alert.Heading>
                {errMess}
            </Alert>
        }
        else {
            return <></>
        }
    }
    const LoadingFileAlert = () => {
        if (showLoadingAlert) {
            console.log("mostafa")
            if ((props.patientRegisterStatus.isFileLoading && !props.patientRegisterStatus.patientFileErrMess) || 
            (props.patientRegisterStatus.isMedicalFileLoading && !props.patientRegisterStatus.medicalFileErrMess)) {
                return <Alert variant="primary" className="mt-2 mb-1" style={{
                    width: "fit-content",
                    margin: "0 auto",
                    position: "absolute",
                    top: "2%",
                    transform: "translate(-50% , 0)"
                    , left: "50%"
                    , zIndex: 1
                }} dismissible onClose={() => setShowLoadingAlert(false)}>
                    <Alert.Heading>Loading..</Alert.Heading>
                    <span className="ps-1 text-dark" >Patient File Loading <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        variant="primary"
                    /></span>
                </Alert>
            }
            else if (props.patientRegisterStatus.patientFileErrMess || props.patientRegisterStatus.medicalFileErrMess) {
                return <Alert variant="danger" className="mt-2 mb-1" style={{
                    width: "fit-content",
                    margin: "0 auto",
                    position: "absolute",
                    top: "2%",
                    transform: "translate(-50% , 0)"
                    , left: "50%"
                    , zIndex: 1
                }} dismissible onClose={() => setShowLoadingAlert(false)}>
                    <Alert.Heading>Error !</Alert.Heading>
                    {props.patientRegisterStatus.patientFileErrMess || props.patientRegisterStatus.medicalFileErrMess}
                </Alert>
            }
            else {
                return <></>
            }
        }
        else {
            return <></>
        }
    }
    return (
        <div className="mt-2">
            <ErrorAlert />
            <LoadingFileAlert />
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
                    {props.patient.patient.firstName + " " + props.patient.patient.lastName}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Container fluid>
                <Row className="row-content">
                    <Col className="col-12 col-md-4  mb-2">
                        <div className="pt-md-4 pe-md-3 pb-md-3 ps-md-2 ps-4 pe-4">
                            <div className="bg-white mb-3" style={{position : "relative"}}>
                            <div className="appointmentsButton">
                                    <HideForType type={["Admin"]}>
                                        <span className="fa fa-download fa-lg mt-2" style={{ cursor: "pointer" }} onClick={() => props.getMedicalFile(props.patient.patient)}></span>
                                    </HideForType>
                                </div>
                                <div className="text-center">
                                    <Image roundedCircle src=
                                        {props.patient.photo === null ?
                                            props.patient.patient.gender === "male" ? 'assets/images/maleavatar.svg' : 'assets/images/femaleavatar.svg' :
                                            props.patient.photo.url
                                        } width="170px" className="img-fluid mt-4 mb-4"></Image>
                                </div>
                                <h4 style={{ fontWeight: 350 }} className="text-center">{props.patient.patient.firstName + ' ' + props.patient.patient.middleName + ' ' + props.patient.patient.lastName}</h4>
                                <div className="offset-2 mt-4">
                                    <span className="d-flex ">
                                        <p className="text-muted" style={{ flexGrow: 1 }}>Gender : </p>
                                        <p style={{ flexGrow: 1 }}>{props.patient.patient.gender}</p>
                                    </span>

                                </div>
                                <div className="offset-2 mt-2">
                                    <span className="d-flex">
                                        <p className="text-muted" style={{ flexGrow: 1 }}>Age : </p>
                                        <p style={{ flexGrow: 1 }}>{new Date().getFullYear() - parseInt(props.patient.patient.birthday.split('-')[0])}</p>
                                    </span>
                                </div>
                                <div className="offset-2 mt-2">
                                    <span className="d-flex">
                                        <p className="text-muted" style={{ flexGrow: 1 }}>Length : </p>
                                        <p style={{ flexGrow: 1 }}>{props.patient.patient.length + ' m'}</p>
                                    </span>
                                </div>
                                <div className="offset-2 mt-2">
                                    <span className="d-flex">
                                        <p className="text-muted" style={{ flexGrow: 1 }}>Weight : </p>
                                        <p style={{ flexGrow: 1 }}>{props.patient.patient.weight + ' kg'}</p>
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white mt-2">

                                <h5 style={{ fontWeight: 350 }} className="text-center p-3 mb-1">
                                    <span className="fa fa-capsules me-2"></span>Medicines</h5>
                                {!medciensErrMess ?
                                    <ul class="list-inline ps-3 pe-3 text-center">
                                        {
                                            medcinesList.map((medcine) => (
                                                <li class="list-inline-item me-2 mb-3">{medcine}</li>
                                            ))
                                        }
                                    </ul>
                                    : <p className="text-center p-3 text-danger">{medciensErrMess}</p>
                                }
                            </div>
                            <div className="bg-white mt-2">

                                <Card>
                                    <Card.Header className="text-white text-left p-3 pl-4 lead" style={{
                                        backgroundColor: '#ec3535'
                                    }}>Cancelled Appointments</Card.Header>
                                    <Card.Body>
                                        <Card.Text className="d-flex">
                                            <div className="c100 p0 small me-3">
                                                <span className="fa fa-calendar-check fa-lg" style={{
                                                    color: "#ec3535"
                                                }}></span>
                                                <div className="slice">
                                                    <div className="bar" style={{ borderColor: '#ec3535' }}></div>
                                                    <div className="fill" style={{ borderColor: '#ec3535' }}></div>
                                                </div>
                                            </div>
                                            <div className="text-center ms-3" >
                                                <h2 style={{ fontWeight: 400 }} >
                                                    {cancelledAppointments.count}
                                                </h2>
                                                <p className="lead">Total</p>
                                            </div>


                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </Col>
                    <Col className="col-12 col-md-8">
                        <div className="pt-md-4 pe-md-3 pb-md-3 ps-md-2 ps-4 pe-4">
                            <div className="bg-white mb-3 pt-3 pe-3 pb-3 ps-4">
                                <div className="patientProfileEditIcons">
                                    <HideForType type={["Admin"]}>
                                        <span className="fa fa-edit fa-lg" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}></span>
                                    </HideForType>
                                </div>
                                <h5 style={{ fontWeight: 350 }} className="text-muted mt-2">Personal Details</h5>
                                <div className="mt-3">
                                    <div>
                                        <div className="d-inline-block" style={{ marginRight: "50px" }}>
                                            <p className="text-muted mb-2">First name</p>
                                            <p className="mb-2">{props.patient.patient.firstName}</p>
                                        </div>
                                        <div className="d-inline-block" style={{ marginRight: "50px" }}>
                                            <p className="text-muted mb-2">Middle name</p>
                                            <p className="mb-2">{props.patient.patient.middleName}</p>
                                        </div>
                                        <div className="d-inline-block" style={{ marginRight: "50px" }}>
                                            <p className="text-muted mb-2">Last name</p>
                                            <p className="mb-2">{props.patient.patient.lastName}</p>
                                        </div>
                                        <div className="d-inline-block" style={{ marginRight: "50px" }}>
                                            <p className="text-muted mb-2">Birthdate</p>
                                            <p className="mb-2">{props.patient.patient.birthday}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <div style={{ marginRight: "50px" }} className="d-inline-block">
                                            <p className="text-muted mb-2">Email address</p>
                                            <p className="mb-2">{props.patient.patient.user.email}</p>
                                        </div>
                                        <div style={{ marginRight: "50px" }} className="d-inline-block">
                                            <p className="text-muted mb-2">Phone number</p>
                                            <p className="mb-2">{props.patient.patient.phone}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-muted mb-2">Address</p>
                                        <p className="mb-2">{props.patient.patient.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pe-md-3 pb-md-3 ps-md-2 ps-4 pe-4">
                            <div className="bg-white mb-3 pt-3 pe-3 pb-3 ps-4">
                                <h5 style={{ fontWeight: 350 }} className="text-muted mt-2">Sessions</h5>
                                <div className="mt-3">
                                    <BootstrapTable
                                        wrapperClasses="table-responsive"
                                        noDataIndication="Table is Empty"
                                        keyField='id'
                                        data={sessions}
                                        columns={sessionsColumns}
                                        expandRow={expandRow}
                                        pagination={paginationFactory(options)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <EditPersonalInfoPatient showModal={showModal} setShowModal={setShowModal} patient={props.patient} />
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    patients: state.patients,
    doctors: state.doctors,
    patientRegisterStatus: state.patientRegisterStatus
})

const mapDispatchToProps = (dispatch) => ({
    getMedicalFile : (patient) => dispatch(getPatientMedicalFile(patient))
})

export default withRouter(connect(mapStateToProps , mapDispatchToProps)(PatientDetail));