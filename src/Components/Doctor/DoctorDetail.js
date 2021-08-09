import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Button, Row, Col, Image } from 'react-bootstrap'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Loading from '../Loading';
import ErrorAlert from '../../helpers/ErrorAlert'
import { baseUrl } from '../../shared/baseUrl'

function DoctorDetail(props) {
    let [todayAppointments, setTodayAppointments] = useState([])
    let [isLoading, setIsLoading] = useState(true)
    let [errorMess, setErrorMess] = useState()
    let [workingDaysList, setWorkingDaysList] = useState([])
    let [workingDayError, setWorkingDayError] = useState()

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
    const getWorkingDay = (doctorId) => {
        return fetch(baseUrl + 'api/doctors/work_days/id/' + doctorId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
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
            .catch(error => {
                setWorkingDayError(error.message)
            })
    }
    let curday = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return (yyyy + '-' + mm + '-' + dd);
    };
    useEffect(() => {
        if (props.doctors.isLoading) return
        getDoctorTimeLine(props.doctor.doctor.id, curday()).then((appointments) => {
            setTodayAppointments(appointments)
            setIsLoading(false)
        })
        getWorkingDay(props.doctor.doctor.id).then((workingDays) => {
            setWorkingDaysList(workingDays)
        })
    }, [])

    const nextPath = (path) => {
        props.history.push(path)
    }
    if (props.doctors.isLoading || props.clinics.isLoading || isLoading || props.patients.isLoading) {
        return <Loading />
    }
    else if (props.doctors.errMess) {
        return (<ErrorAlert messege={props.doctors.errMess} />)
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
    ))) : <p>{errorMess}</p>
    let clinicId = props.clinics.clinics.filter((clinic) =>
        clinic.clinic.id === parseInt(props.doctor.doctor.clinicId, 10))[0].clinic.id
    let workingDays = workingDaysList ? workingDaysList.map((workingDay) => (
        <p>
            <span>{workingDay.day + ' : '}</span>
            <span>{formatAMPM(workingDay.startTime) + ' to '}</span>
            <span>{formatAMPM(workingDay.endTime)}</span>
        </p>
    )) : <p>{workingDayError}</p>
    return (
        <div className="mt-2">
            <Breadcrumb>
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to="/dashboard">
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    <Link to='/dashboard/doctors'>Doctors</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="mr-auto" href="#">
                    {props.doctor.doctor.firstName + " " + props.doctor.doctor.lastName}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Container fluid>
                <Row>
                    <Col xs={12} md={8} className="mb-4">
                        <div>
                            <div className="p-4 bg-white" >
                                <div className="profileEditIcons">
                                    <span className="fa fa-edit fa-lg mr-2"></span>
                                    <span className="fa fa-trash-alt fa-lg"></span>
                                </div>
                                <Container>
                                    <Row>
                                        <Col xs={12} md="auto" className="text-center">
                                            <Image src={props.doctor.photo === null ? 'assets/images/doctor.svg' :
                                                props.doctor.photo.url
                                            } roundedCircle width="218px" className="img-fluid" alt={props.doctor.firstName} />
                                        </Col>
                                        <Col className="pt-4 ml-4">
                                            <h4 className="mb-2 " >{props.doctor.doctor.firstName + " " + props.doctor.doctor.lastName}</h4>
                                            <Button variant="link" className="p-0 mb-3" onClick={() => nextPath(`/dashboard/clinics/${clinicId}`)}>{
                                                props.clinics.clinics.filter((clinic) =>
                                                    clinic.clinic.id === parseInt(props.doctor.doctor.clinicId, 10))[0].clinic.name
                                            }</Button>
                                            <p>{props.doctor.doctor.sepecialize}</p>
        
                                            <div className="mb-2">
                                                <span className="fa fa-language mr-2"></span> {props.doctor.doctor.language}
                                            </div>
                                            <div className="mb-2">
                                                <span className="fa fa-phone mr-2"></span> {props.doctor.doctor.phoneNumber}
                                            </div>
                                            <div>
                                                <span className="fa fa-inbox mr-2"></span>{props.doctor.doctor.user.email}
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            <div className="p-4 bg-white mt-4" >
                                <Container>
                                    <Row>
                                        <Col className="pt-4 ml-4">
                                            <h4 className="mb-3" >Description</h4>
                                            <p style={{ "lineHeight": "26px" }} className="mt-2">{props.doctor.doctor.description}</p>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            <div className="p-4 bg-white mt-4" >
                                <Container>
                                    <Row>
                                        <Col className="pt-3 ml-4 pb-3">
                                            <h5 className="mb-3">Today Appointments</h5>
                                            <div class="timeline-steps aos-init aos-animate">
                                                {timeline}
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} xs={12} className="workingDaysCard">
                        <div className="p-4 bg-white text-center ">
                            <Image src="assets/images/undraw_time_management_30iu.svg" className="img-fluid mt-3 mb-3" style={{ "maxWidth": "46%" }} alt={props.doctor.doctor.firstName} />
                            <h4 className="mb-3">Working Days</h4>
                            {workingDays}
                        </div>
                        <div className="pe-4 ps-4 pb-4 pt-2 bg-white mt-4 text-center">
                            <Image src="assets/images/Blood donation-rafiki.svg" className="img-fluid mt-2 mb-1" style={{ "maxWidth": "48%" }} alt={props.doctor.doctor.firstName} />
                            <h5 className="mb-3">Sessions duration</h5>
                            {props.doctor.tag !==null ?
                            <ul class="list-group list-group-flush gap-0">
                            <li class="list-group-item border-bottom-0">Check : {props.doctor.tag.check + 'm'}</li>
                            <li class="list-group-item border-bottom-0">Consultation : {props.doctor.tag.consultation + 'm'}</li>
                            <li class="list-group-item border-bottom-0">Review : {props.doctor.tag.review + 'm'}</li>
                        </ul>
                            : <p>there are no sessions duration for this doctor</p>}
                            
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    doctors: state.doctors,
    clinics: state.clinics,
    patients: state.patients
})

export default withRouter(connect(mapStateToProps)(DoctorDetail));