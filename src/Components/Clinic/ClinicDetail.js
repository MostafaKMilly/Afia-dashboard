import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row, Container, Image, Card, useAccordionToggle, Accordion, Pagination, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    Title,
    BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Animation } from '@devexpress/dx-react-chart';

const format = () => tick => tick;

const demoStyles = () => ({
    chart: {
        paddingRight: '20px',
    },
    title: {
        whiteSpace: 'pre',
    },
});

const ValueLabel = (props) => {
    const { text } = props;
    return (
        <ValueAxis.Label
            {...props}
            text={`${text}%`}
        />
    );
};

const titleStyles = {
    title: {
        whiteSpace: 'pre',
        paddingTop: '10px'
    },
};
const TitleText = withStyles(titleStyles)(({ classes, ...props }) => (
    <Title.Text {...props} className={classes.title} />
));

function ClinicDetail(props) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const [doctorsByClinic, setDoctorsByClinic] = useState([])
    const [doctorIsLoading, setDoctorIsLoading] = useState(true)
    const [errMess, setErrMess] = useState(null)
    const [workingDayError, setWorkingDayError] = useState()
    const [workingDays, setWorkingDays] = useState([])
    const [statistics, setStatistics] = useState()
    const [statisticsIsLoading, setStatisticsIsLoading] = useState(true)
    const [appointmentsPerWeek, setAppointmentPerWeek] = useState([])
    const [appointmentsPerWeekIsLoading, setAppointmentsPerWeekIsLoading] = useState(true)
    const [patientStatistics, setPatientStatistics] = useState([])
    const [patientStatisticsIsLoading, setPatientStatisticsIsLoading] = useState(true)

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
    useEffect(() => {
        const getDoctorsForClinic = () => fetch(baseUrl + 'api/doctors/clinic/' + props.clinic.clinic.id, {
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
            .then(doctors => {
                setDoctorIsLoading(false)
                setDoctorsByClinic(doctors)
            })
            .catch(error => {
                setDoctorIsLoading(false)
                setErrMess(error.message)
            })
        getDoctorsForClinic()
        const getStatistics = () => {
            return fetch(baseUrl + 'api/statistics/clinic/' + props.clinic.clinic.id, {
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
                .then(statistics => {
                    setStatistics(statistics)
                    setStatisticsIsLoading(false)
                })
                .catch(error => {
                    setErrMess(error.message)
                    setStatisticsIsLoading(false)
                })
        }
        getStatistics()
        const getAppointmentsPerWeek = () => {
            return fetch(baseUrl + 'api/statistics/done_appointments_per_week/id/' + props.clinic.clinic.id, {
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
                .then(statistics => {
                    setAppointmentPerWeek(statistics)
                    setAppointmentsPerWeekIsLoading(false)
                })
                .catch(error => {
                    setErrMess(error.message)
                    setAppointmentsPerWeekIsLoading(false)
                })
        }
        getAppointmentsPerWeek()
        const getPatientPerMonth = () => {
            fetch(baseUrl + 'api/statistics/monthly_patient_per_year/id/' + props.clinic.clinic.id, {
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
                .then(patientsStatistics => {
                    setPatientStatistics(patientsStatistics)
                    setPatientStatisticsIsLoading(false)
                })
                .catch(error => {
                    setErrMess(error.message)
                    setPatientStatisticsIsLoading(false)
                })
        }
        getPatientPerMonth()
    }, [])
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
    if (props.clinics.isLoading || doctorIsLoading || statisticsIsLoading || props.statisticsIsLoading || appointmentsPerWeekIsLoading || patientStatisticsIsLoading) {
        return <Loading />
    }
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const doctorTempList = doctorsByClinic.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(doctorsByClinic.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }
    const CustomToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionToggle(eventKey)
        return (
            <span className="fa fa-angle-down me-2" type="button" onClick={() => {
                getWorkingDay(eventKey).then((workingDays) => setWorkingDays(workingDays))
                decoratedOnClick()
            }
            }></span>
        )
    }
    let workingDaysValues = workingDays ? workingDays.map((workingDay) => (
        <p key={workingDay.id}>
            <span>{workingDay.day + ' : '}</span>
            <span>{formatAMPM(workingDay.startTime) + ' to '}</span>
            <span>{formatAMPM(workingDay.endTime)}</span>
        </p>
    )) : <p>{workingDayError}</p>

    const doctorsList = doctorTempList.map((doctor) => (
        <Card className="ps-3 pe-2" key={doctor.doctor.id}>
            <Card.Body style={{ position: "relative" }}>
                <Card.Text className="mb-0">
                    <div className="media align-items-center ">
                        <Image className="mr-3" src={doctor.photo === null ? 'assets/images/doctor.svg' :
                            props.doctor.photo.url} width="50" alt="Generic placeholder image" />
                        <div className="media-body">
                            <h5 className="mt-0">{doctor.doctor.firstName + ' ' + doctor.doctor.lastName}</h5>
                        </div>
                    </div>
                </Card.Text>
                <div style={{
                    position: "absolute",
                    top: "36%",
                    right: 0,
                    marginRight: "36px"
                }} >
                    <CustomToggle eventKey={doctor.doctor.id}></CustomToggle>
                </div>

            </Card.Body>
            <Accordion.Collapse eventKey={doctor.doctor.id}>
                <Card.Body>
                    <Container>
                        <Row>
                            <Col className="text-center col-12">
                                <h6 style={{ fontWeight: 450 }}>Working days <span className="fa fa-clock ms-1" style={{ color: '#ff2e63f2' }}></span></h6>
                            </Col>
                            <Col className="text-center col-12">
                                {workingDaysValues}
                            </Col>

                        </Row>
                    </Container>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    ))

    const chartData = patientStatistics.map((statistics) => ({
        month: statistics.name.slice(0, 3), patientsCount: statistics.count
    }))


    /*   const chartData = [
          {
              month: "Jan", patientsCount: 20
          }, {
              month: "Feb", patientsCount: 30
          }, {
              month: "Mar", patientsCount: 10
          }, {
              month: "Apr", patientsCount: 30
          }, {
              month: "May", patientsCount: 25
          }, {
              month: "Jun", patientsCount: 60
          }, {
              month: "Jul", patientsCount: 20
          }, {
              month: "Aug", patientsCount: 10
          }, {
              month: "Sep", patientsCount: 10
          }, {
              month: "Oct", patientsCount: 29
          }, {
              month: "Nov", patientsCount: 20
          }, {
              month: "Dec", patientsCount: 10
          }
      ]; */
    const data = [
        { day: 'Su', appointments: appointmentsPerWeek.Sunday },
        { day: 'Mo', appointments: appointmentsPerWeek.Monday },
        { day: 'Tu', appointments: appointmentsPerWeek.Tuesday },
        { day: 'We', appointments: appointmentsPerWeek.Wednesday },
        { day: 'Th', appointments: appointmentsPerWeek.Thursday },
        { day: 'Fr', appointments: appointmentsPerWeek.Friday },
        { day: 'Sa', appointments: appointmentsPerWeek.Saturda },
    ];
    const { classes } = props;
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
    return (
        <div className="mt-2">
            <ErrorAlert />
            <Breadcrumb >
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to={`/dashboard`}>
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    <Link to='/dashboard/clinics'>Clinics</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="mr-auto" href="#">
                    {props.clinic.clinic.name}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Container fluid>
                <Row className="row-content">
                    <Col className="col-12 col-md-8 mb-3">
                        <div className="pt-md-3 pe-md-3 ps-md-2 ps-4 pe-4">
                            <div className="clinicCover ">
                                <div className="text-center">
                                    <Image roundedCircle width="170" src={props.clinic.photo !== null ?
                                        props.clinic.photo.url : './assets/images/Doctor-amico.png'} className="img-fluid mt-3 mb-2"></Image>
                                    <h5 style={{ fontWeight: 480 }} className="mb-0">{props.clinic.clinic.name}</h5>
                                </div>
                            </div>
                        </div>

                        <div className="pt-md-1 pe-md-3 pb-md-3 ps-md-2 ps-4 pe-4">
                            <div className="bg-white mb-3">
                                <div style={{ padding: "32px" }} className="text-center">
                                    <div className="d-md-inline-block mb-2 mb-md-0" style={{ marginRight: "80px" }}>
                                        <div className="d-flex align-items-center">
                                            <span className="fa fa-calendar-alt text-muted" style={{
                                                fontSize: "50px"
                                            }}>
                                            </span>
                                            <div className="text-center ms-3 mt-2" style={{
                                                textAlignLast: 'start'
                                            }}>
                                                <h3 style={{ fontWeight: 400 }} className="mb-0" >
                                                    {statistics.PendingAppointments}
                                                </h3>
                                                <p className="lead mt-0">Appointment</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-md-inline-block mb-2 mb-md-0" style={{ marginRight: "80px" }}>
                                        <div className="d-flex align-items-center">
                                            <span className="fa fa-user-md text-muted" style={{
                                                fontSize: "50px"
                                            }}>
                                            </span>
                                            <div className="text-center ms-3 mt-2" style={{
                                                textAlignLast: 'start'
                                            }}>
                                                <h3 style={{ fontWeight: 400 }} className="mb-0" >
                                                    {statistics.Doctors}
                                                </h3>
                                                <p className="lead mt-0">Doctors</p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-md-inline-block" >
                                        <div className="d-flex align-items-center">
                                            <span className="fa fa-user-injured text-muted" style={{
                                                fontSize: "50px"
                                            }}>
                                            </span>
                                            <div className="text-center ms-3 mt-2" style={{
                                                textAlignLast: 'start'
                                            }}>
                                                <h3 style={{ fontWeight: 400 }} className="mb-0" >
                                                    {statistics.Patients}
                                                </h3>
                                                <p className="lead mt-0">Patients</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-md-1 ">
                                <div className="bg-white mb-2 text-center pe-md-2 pe-0">
                                    <Paper>
                                        <Chart
                                            data={chartData}
                                            className={classes.chart}
                                            height="380"
                                        >
                                            <ArgumentAxis tickFormat={format} />
                                            <ValueAxis
                                                max={50}
                                                labelComponent={ValueLabel}
                                            />

                                            <LineSeries
                                                name="Patients"
                                                valueField="patientsCount"
                                                argumentField="month"
                                            />
                                            <Title
                                                text={`Monthly patients`}
                                                textComponent={TitleText}
                                            />
                                            <Animation />
                                        </Chart>
                                    </Paper>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="col-12 col-md-4 mb-2">
                        <div className="pt-md-3 pe-md-3 ps-md-2 ps-4 pe-4">
                            <div className="bg-white mb-3">
                                <h5 style={{ fontWeight: 450 }} className="text-center p-4">Doctors</h5>
                                <Accordion>
                                    {doctorsList.length !== 0 ? doctorsList : <div className="text-center">
                                        <span className="fa fa-exclamation-triangle" style={{
                                            fontSize: "48px",
                                            color: "#f75151"
                                        }}></span>
                                        <p className="mt-3">There are no doctors for this clinic</p>
                                    </div>}
                                </Accordion>
                                <center>
                                    <div className="text-center mt-2">
                                        <Pagination>{items}</Pagination>
                                    </div>

                                </center>
                            </div>
                        </div>
                        <div className="pt-md-3 pe-md-3 ps-md-2 ps-4 pe-4">
                            <div className="bg-white mb-3">
                                <h5 style={{ fontWeight: 450 }} className="text-center p-4">Appointments<sub className="ms-1">Per week</sub></h5>
                                <Paper>
                                    <Chart
                                        data={data}
                                        height="308"
                                    >
                                        <ArgumentAxis />
                                        <ValueAxis max={10} />

                                        <BarSeries
                                            valueField="appointments"
                                            argumentField="day"
                                        />
                                        <Animation />
                                    </Chart>
                                </Paper>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    clinics: state.clinics,
    doctors: state.doctors,
})

export default withStyles(demoStyles, { name: 'Demo' })(withRouter(connect(mapStateToProps)(ClinicDetail)));