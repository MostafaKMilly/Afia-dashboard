import React, { Component } from 'react';
import { Alert, Card, Col, Pagination, Row } from 'react-bootstrap'
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    PieSeries,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { fetchCenterDays } from '../redux/Actions/CenterActions';
import Loading from './Loading';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import HideForType from '../helpers/HideForType';
import { baseUrl } from '../shared/baseUrl';
class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statistics: {},
            statisticsIsLoading: true,
            errMess: null,
            currentPage: 1,
            itemsPerPage: 5,
            pendingAppointments : [],
            pendingAppointmentsErrMess : undefined,
            pendingAppointmentsIsLoading : true
        }
        this.handleClick = this.handleClick.bind(this)
    }
    getStatistics() {
        return fetch(baseUrl + 'api/statistics/public', {
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
    }

    getPendingAppointments () {
        return fetch(baseUrl + 'api/statistics/clinics/pending_appointments' , {
            method : "GET",
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

    componentDidMount() {
        this.getStatistics().then((statistics) => {
            this.setState({ statistics })
            console.log(this.state.statistics)
            this.setState({ statisticsIsLoading: false })
        })
            .catch(error => {
                this.setState({ errMess: error })
                this.setState({ statisticsIsLoading: false })
            })
        this.getPendingAppointments().then((pendingAppointments) => {
            this.setState({pendingAppointments , pendingAppointmentsIsLoading : false})
        })
        .catch((error) => {
            this.setState({pendingAppointmentsErrMess : error.message , pendingAppointmentsIsLoading : false})
        })

    }
    handleClick(event) {
        this.setState({ currentPage: parseInt(event.target.id, 10) })
    }
    checkIfHavePendingAppointments(clinicName) {
        let count = 0
        this.state.pendingAppointments.forEach((pendingAppointment) => {
            if (pendingAppointment.name === clinicName) {
                count=pendingAppointment.count
            }
        })
        return count
    }
    render() {
        if (this.props.center.isLoading || this.state.pendingAppointmentsIsLoading || this.props.patients.isLoading || this.state.statisticsIsLoading || this.props.clinics.isLoading) {
            return <Loading />
        }
        const nextPath = (path) => {
            this.props.history.push(path)
        }
        const totalPaitnets = this.props.patients.patients.length
        const dataPieChart = [
            { gender: 'female', area: this.state.statistics.Gender.female / totalPaitnets * 100 },
            { gender: 'male', area: this.state.statistics.Gender.male / totalPaitnets * 100 },
        ];
        let monthlyPatientsPrecentage = this.state.statistics.MonthlyPatient.totalPatient != 0 ? Math.ceil(this.state.statistics.MonthlyPatient.count
            / this.state.statistics.MonthlyPatient.totalPatient * 100) : 0

        let totalPendingAppointment = this.state.statistics.TotalPendingAppointment.count
        let todayPendingAppointmentPrecentage = this.state.statistics.TodayPendingAppointment.totalPendingAppointment != 0 ? Math.ceil(this.state.statistics.TodayPendingAppointment.count
            / this.state.statistics.TodayPendingAppointment.totalPendingAppointment * 100) : 0

        let doneAppointmentsPrecentage = this.state.statistics.DoneAppointment.totalAcceptedAppointment != 0 ? Math.ceil(this.state.statistics.DoneAppointment.count /
            this.state.statistics.DoneAppointment.totalAcceptedAppointment * 100) : 0

        let totalDoneAppointments = this.state.statistics.DoneAppointmentPerWeek.totalDoneAppointments
        const data = [
            { day: 'Su', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Sunday / totalDoneAppointments * 100) },
            { day: 'Mo', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Monday / totalDoneAppointments * 100) },
            { day: 'Tu', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Tuesday / totalDoneAppointments * 100) },
            { day: 'We', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Wednesday / totalDoneAppointments * 100) },
            { day: 'Th', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Thursday / totalDoneAppointments * 100) },
            { day: 'Fr', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Friday / totalDoneAppointments * 100) },
            { day: 'Sa', appointments: Math.ceil(this.state.statistics.DoneAppointmentPerWeek.Saturday / totalDoneAppointments * 100) },
        ];
        const ErrorAlert = () => {
            return <Alert variant="danger">
                <span className="fa fa-exclamation-triangle me-2"></span>
                {this.props.center.errMess}
            </Alert>
        }


        const lastIndex = this.state.currentPage * this.state.itemsPerPage
        const firstIndex = lastIndex - this.state.itemsPerPage
        const clinicsList = this.props.clinics.clinics.slice(firstIndex, lastIndex)
        let items = []
        for (let i = 1; i <= Math.ceil(this.props.clinics.clinics.length / this.state.itemsPerPage); i++) {
            items.push(
                <Pagination.Item key={i} active={i === this.state.currentPage} id={i} onClick={this.handleClick}>
                    {i}
                </Pagination.Item>
            )
        }
        return (
            <div>
                <div className="container-fluid p-4" align="center">
                    <Row className="row-content">
                        <Col className="col-12 col-md-6 text-center text-md-left mb-3 mb-md-0">
                            <h2 style={{ fontWeight: 450 }}>Overview</h2>
                        </Col>


                        {this.props.center.errMess ? <Col className="col-12 col-md-auto offset-md-1 ms-md-auto text-center text-md-right">
                            <ErrorAlert />
                        </Col> :
                            <Col className="col-12 col-md-6 text-center text-md-right">

                                
                                <HideForType type={["Nurse"]}>
                                <button className="btn me-2 mb-2 mb-md-0 text-white" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/appointments`)}>
                                    Pending Appointments
                                </button>
                                    <button className="btn me-2 text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/patients/add`)}>
                                        Add Patients
                                    </button>
                                    <button className="btn text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/doctors/add`)}>
                                        Add Doctors
                                    </button>
                                </HideForType>
                                <HideForType type={["Admin"]}>
                                    <button className="btn me-2 mb-2 mb-md-0 text-white" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/addAppointments`)}>
                                        Add appointment
                                    </button>
                                <button className=" btn me-2 text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/patients/add`)}>
                                    Add Patient
                                </button>
                                    <button className="btn text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/calender`)}>
                                        Calender
                                    </button>
                                </HideForType>

                            </Col>
                        }


                    </Row>
                    <Row className="row-content">
                        <Col className="col-12 col-md-3 mb-3 mb-md-0">
                            <Card>
                                <Card.Header className="bg-primary text-white text-left p-3 pl-4 lead" style={{ fontSize: '19px' }}>Done Appointments</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className={`c100 ${'p' + doneAppointmentsPrecentage} small me-3`}>
                                            <span className="fa fa-calendar-check fa-lg text-primary"></span>
                                            <div className="slice">
                                                <div className="bar"></div>
                                                <div className="fill"></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {this.state.statistics.DoneAppointment.count}
                                            </h2>
                                            <p className="lead">Total</p>
                                        </div>
                                        <div className="precentage">
                                            {doneAppointmentsPrecentage + '%'}
                                        </div>

                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col className="col-12 col-md-3 mb-3 mb-md-0">
                            <Card>
                                <Card.Header className="text-white text-left p-3 pl-4 lead" style={{
                                    backgroundColor: "#e01447f2"
                                }}>Patients</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className={`c100 ${'p' + monthlyPatientsPrecentage} small me-3`}>
                                            <span className="fa fa-user-injured fa-lg " style={{
                                                color: '#e01447f2'
                                            }}></span>
                                            <div className="slice" >
                                                <div className="bar" style={{
                                                    borderColor: '#e01447f2'
                                                }}></div>
                                                <div className="fill" style={{ borderColor: '#e01447f2' }}></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {this.state.statistics.MonthlyPatient.count}
                                            </h2>
                                            <p className="lead">Monthly</p>
                                        </div>
                                        <div className="precentage">
                                            {monthlyPatientsPrecentage + '%'}
                                        </div>

                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col className="col-12 col-md-3 mb-3 mb-md-0">
                            <Card>
                                <Card.Header className="text-white text-left p-3 pl-4 lead" style={{
                                    backgroundColor: "#182783"
                                }}>Pending appointments</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className={`c100 ${'p' + todayPendingAppointmentPrecentage} small me-3`}>
                                            <span className="fa fa-user-nurse fa-lg" style={{
                                                color: '#182783'
                                            }}></span>
                                            <div className="slice">
                                                <div className="bar" style={{
                                                    borderColor: '#182783'
                                                }}></div>
                                                <div className="fill" style={{ borderColor: '#182783' }}></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {this.state.statistics.TodayPendingAppointment.count}
                                            </h2>
                                            <p className="lead">Today</p>
                                        </div>
                                        <div className="precentage">
                                            {todayPendingAppointmentPrecentage + '%'}
                                        </div>

                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col className="col-12 col-md-3 mb-3 mb-md-0">
                            <Card>
                                <Card.Header className="text-white text-left p-3 pl-4 lead" style={{
                                    backgroundColor: "#F29339"
                                }}>Pending Appointments</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className="c100 p100 small me-3">
                                            <span className="fa fa-calendar fa-lg " style={{
                                                color: "#F29339"
                                            }}></span>
                                            <div className="slice">
                                                <div className="bar" style={{
                                                    borderColor: '#F29339'
                                                }}></div>
                                                <div className="fill" style={{ borderColor: '#F29339' }}></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {totalPendingAppointment}
                                            </h2>
                                            <p className="lead">Total</p>
                                        </div>
                                        <div className="precentage">

                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </Col>
                    </Row>
                    <Row className="row-content">
                        <Col className="col-12 col-md-4 mb-3 mb-md-0" >
                            <Paper>
                                <Chart
                                    data={data}
                                    height="380"
                                >
                                    <ArgumentAxis />
                                    <ValueAxis max={10} />

                                    <BarSeries
                                        valueField="appointments"
                                        argumentField="day"
                                    />
                                    <Title text="Appointment per week" />
                                    <Animation />
                                </Chart>
                            </Paper>
                        </Col>
                        <Col className="col-12 col-md-4 mb-3 mb-md-0">
                            <Paper className="pb-4">
                                <h6 className="MuiTypography-h6 pt-2 pb-1">Pending Appointments</h6>
                                <ol class="list-group list-group-flush">
                                    {this.props.clinics.clinics.length ? clinicsList.map((clinic) => (
                                        <li class="list-group-item d-flex justify-content-between align-items-start" key={clinic.clinic.id}>
                                            <div class="ms-2 me-auto">
                                                <div style={{ fontWeight: 500 }}>{clinic.clinic.name}</div>
                                            </div>
                                            <span class="badge rounded-pill" style={{background : "rgb(52 66 146)"}}>{this.checkIfHavePendingAppointments(clinic.clinic.name)}</span>
                                        </li>
                                    )) : <p className="lead text-danger" style={{paddingTop : "116px" , paddingBottom : "112px"}}>there are no clinics</p>}
                                </ol>
                                <center style={{overflow : "auto", maxWidth : "75%" ,overflowY: "hidden"}} className="mt-3">
                                    <div className="text-center">
                                        <Pagination className="mb-0">{items}</Pagination>
                                    </div>
                                </center>
                            </Paper>
                        </Col>
                        <Col className="col-12 col-md-4">
                            <Paper id="circleChart" style={{
                                paddingRight: "68px",
                                paddingLeft: "68px"
                            }}>
                                {isNaN(dataPieChart[0].area)|| isNaN(dataPieChart[1].area) ? <p className="lead text-danger" style={{paddingTop : "174px" , paddingBottom : "174px"}}>There are no patients</p> :
                                   <Chart
                                   data={dataPieChart}
                                   height="380"
                               >
                                   <PieSeries
                                       valueField="area"
                                       argumentField="gender"
                                       innerRadius={0.9}

                                   />
                                   <Title
                                       text="Patients"
                                   />
                                   <Animation />
                               </Chart>
                                }
                             
                                <div style={{
                                    position: "absolute",
                                    top: "44px",
                                    left: 0,
                                    marginLeft: "33px"
                                }}>
                                    <div className="mb-2 ms-2">
                                        male
                                        <div style={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: "#e7823a",
                                            display: "inline-block",
                                            marginLeft: "8px",
                                            marginBottom: "-3px"
                                        }}>

                                        </div>
                                    </div>
                                    <div className="me-1">
                                        female
                                        <div style={{
                                            width: 20,
                                            height: 20,
                                            backgroundColor: "#546bc1",
                                            display: "inline-block",
                                            marginLeft: "8px",
                                            marginBottom: "-3px"
                                        }}>

                                        </div>
                                    </div>
                                </div>
                            </Paper>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateTopProps = (state) => ({
    center: state.center,
    patients: state.patients,
    clinics: state.clinics
})


export default withRouter(connect(mapStateTopProps)(Home));