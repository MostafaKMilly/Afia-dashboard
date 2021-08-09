import React, { Component } from 'react';
import { Alert, Card, Col, Row } from 'react-bootstrap'
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
            statistics : {},
            statisticsIsLoading : true,
            errMess : null
        }
    }
    getStatistics () {
        return fetch(baseUrl + 'api/statistics/public' , {
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
            this.setState({statistics})
            console.log(this.state.statistics)
            this.setState({statisticsIsLoading : false})
        })
        .catch(error => {
            this.setState({errMess : error})
            this.setState({statisticsIsLoading : false})
        })
    }
    render()  {
        if (this.props.center.isLoading || this.props.patients.isLoading || this.state.statisticsIsLoading) {
            return <Loading />
        }
        const nextPath = (path) => {
            this.props.history.push(path)
        }
        const totalPaitnets = this.props.patients.patients.length
        const dataPieChart = [
            { gender: 'female', area:this.state.statistics.Gender.female / totalPaitnets *100 },
            { gender: 'male', area:this.state.statistics.Gender.male / totalPaitnets *100 },
        ];
        let monthlyPatientsPrecentage = Math.ceil(this.state.statistics.MonthlyPatient.count / this.state.statistics.MonthlyPatient.totalPatient * 100)
        let totalPendingAppointment = this.state.statistics.TotalPendingAppointment.count
        let todayPendingAppointmentPrecentage = Math.ceil(this.state.statistics.TodayPendingAppointment.count / this.state.statistics.TodayPendingAppointment.totalPendingAppointment * 100) 
        let acceptedAppointmentsPrecentage = Math.ceil(this.state.statistics.AcceptedAppointment.count / this.state.statistics.AcceptedAppointment.totalPendingAppointment * 100)
        let totalAcceptedAppointments = this.state.statistics.AcceptedAppointmentPerWeek.totalAcceptedAppointments
        const data = [
            { day: 'Su', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Sunday / totalAcceptedAppointments * 100) },
            { day: 'Mo', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Monday / totalAcceptedAppointments * 100) },
            { day: 'Tu', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Tuesday / totalAcceptedAppointments * 100) },
            { day: 'We', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Wednesday / totalAcceptedAppointments * 100) },
            { day: 'Th', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Thursday / totalAcceptedAppointments * 100) },
            { day: 'Fr', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Friday / totalAcceptedAppointments * 100) },
            { day: 'Sa', appointments: Math.ceil(this.state.statistics.AcceptedAppointmentPerWeek.Saturday / totalAcceptedAppointments * 100) },
        ];
        const ErrorAlert = () => {
            return <Alert variant="danger">
                <span className="fa fa-exclamation-triangle me-2"></span>
                {this.props.center.errMess}
            </Alert>
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

                                <button className="btn me-2 mb-2 mb-md-0 text-white" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/appointments`)}>
                                    Pending Appointments
                                </button>
                                <HideForType type={["Nurse"]}>
                                <button className="btn me-2 text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/patients/add`)}>
                                    Add Patients
                                </button>
                                <button className="btn text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/doctors/add`)}>
                                    Add Doctors
                                </button>
                                    </HideForType>
                                    <HideForType type={["Admin"]}>
                                    <button className="btn me-2 text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }} onClick={() => nextPath(`${this.props.match.url}/addAppointments`)}>
                                    Add appointment
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
                                <Card.Header className="bg-primary text-white text-left p-3 pl-4 lead" style={{fontSize : '19px'}}>Accepted Appointments</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className={`c100 ${'p'+acceptedAppointmentsPrecentage} small me-3`}>
                                            <span className="fa fa-calendar-check fa-lg text-primary"></span>
                                            <div className="slice">
                                                <div className="bar"></div>
                                                <div className="fill"></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {this.state.statistics.AcceptedAppointment.count}
                                            </h2>
                                            <p className="lead">Total</p>
                                        </div>
                                        <div className="precentage">
                                            {acceptedAppointmentsPrecentage+'%'}
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
                                        <div className={`c100 ${'p'+monthlyPatientsPrecentage} small me-3`}>
                                            <span className="fa fa-user-injured fa-lg " style={{
                                                color: '#e01447f2'
                                            }}></span>
                                            <div className="slice" >
                                                <div className="bar" style={{
                                                    borderColor: '#e01447f2'
                                                }}></div>
                                                <div className="fill" style={{ borderColor: '#e01447f2'}}></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {this.state.statistics.MonthlyPatient.count}
                                            </h2>
                                            <p className="lead">Monthly</p>
                                        </div>
                                        <div className="precentage">
                                            {monthlyPatientsPrecentage+'%'}
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
                                        <div className={`c100 ${'p'+todayPendingAppointmentPrecentage} small me-3`}>
                                            <span className="fa fa-user-nurse fa-lg" style={{
                                                color: '#182783'
                                            }}></span>
                                            <div className="slice">
                                                <div className="bar" style={{
                                                    borderColor: '#182783'
                                                }}></div>
                                                <div className="fill" style={{borderColor: '#182783'}}></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                {this.state.statistics.TodayPendingAppointment.count}
                                            </h2>
                                            <p className="lead">Today</p>
                                        </div>
                                        <div className="precentage">
                                            {todayPendingAppointmentPrecentage+'%'}
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
                                                                            <div className="fill" style={{borderColor: '#F29339'}}></div>
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
                        <Col className="col-12 col-md-7 mb-3 mb-md-0" >
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
                        <Col className="col-12 col-md-5">
                            <Paper id="circleChart" style={{
                                paddingRight: "68px",
                                paddingLeft: "68px"
                            }}>
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
                                <div style={{
                                    position: "absolute",
                                    top: "44px",
                                    left: 0,
                                    marginLeft: "33px"
                                }}>
                                    <p>
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
                                    </p>
                                    <p>
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
                                    </p>
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
    patients : state.patients
})


export default withRouter(connect(mapStateTopProps)(Home));