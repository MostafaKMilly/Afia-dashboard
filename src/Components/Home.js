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
class Home extends Component {
    componentDidMount() {
        this.props.fetchCenterDays()
    }
    render() {
        const data = [
            { day: 'Su', appointments: 2.525 },
            { day: 'Mo', appointments: 3.018 },
            { day: 'Tu', appointments: 3.682 },
            { day: 'We', appointments: 4.440 },
            { day: 'Th', appointments: 5.310 },
            { day: 'Fr', appointments: 6.127 },
            { day: 'Sa', appointments: 6.930 },
        ];
        const dataPieChart = [
            { gender: 'female', area: 25 },
            { gender: 'male', area: 75 },
        ];
        if (this.props.center.isLoading) {
            return <Loading />
        }
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
                                <ErrorAlert/>
                            </Col> :
                            <Col className="col-12 col-md-6 text-center text-md-right">
                          
                                <button className="btn me-2 mb-2 mb-md-0 text-white" style={{ backgroundColor: "#ff2e63f2" }}>
                                    Pending Appointments
                                </button>
                                <button className="btn me-2 text-white mb-2 mb-md-0" style={{ backgroundColor: "#ff2e63f2" }}>
                                    Add Patients
                                </button>
                                <button className="btn text-white" style={{ backgroundColor: "#ff2e63f2" }}>
                                    Add Doctors
                                </button>
                            
    
                            </Col>
    }
                        

                    </Row>
                    <Row className="row-content">
                        <Col className="col-12 col-md-3 mb-3 mb-md-0">
                            <Card>
                                <Card.Header className="bg-primary text-white text-left p-3 pl-4 lead">Appointments</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className="c100 p90 small me-3">
                                            <span className="fa fa-calendar-check fa-lg text-primary"></span>
                                            <div className="slice">
                                                <div className="bar"></div>
                                                <div className="fill"></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                190
                                            </h2>
                                            <p className="lead">Today</p>
                                        </div>
                                        <div className="precentage">
                                            90%
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
                                        <div className="c100 p12 small me-3">
                                            <span className="fa fa-user-injured fa-lg " style={{
                                                color: '#e01447f2'
                                            }}></span>
                                            <div className="slice" >
                                                <div className="bar" style={{
                                                    borderColor: '#e01447f2'
                                                }}></div>
                                                <div className="fill"></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                190
                                            </h2>
                                            <p className="lead">Monthly</p>
                                        </div>
                                        <div className="precentage">
                                            90%
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
                                        <div className="c100 p12 small me-3">
                                            <span className="fa fa-calendar fa-lg " style={{
                                                color: "#F29339"
                                            }}></span>
                                            <div className="slice">
                                                <div className="bar" style={{
                                                    borderColor: '#F29339'
                                                }}></div>
                                                <div className="fill"></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                190
                                            </h2>
                                            <p className="lead">Total</p>
                                        </div>
                                        <div className="precentage">
                                            90%
                                        </div>

                                    </Card.Text>
                                </Card.Body>
                            </Card>

                        </Col>
                        <Col className="col-12 col-md-3 mb-3 mb-md-0">
                            <Card>
                                <Card.Header className="text-white text-left p-3 pl-4 lead" style={{
                                    backgroundColor: "#182783"
                                }}>Doctors</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className="c100 p12 small me-3">
                                            <span className="fa fa-user-nurse fa-lg" style={{
                                                color: '#182783'
                                            }}></span>
                                            <div className="slice">
                                                <div className="bar" style={{
                                                    borderColor: '#182783'
                                                }}></div>
                                                <div className="fill"></div>
                                            </div>
                                        </div>
                                        <div className="text-center cardPrecentageDetail" >
                                            <h2 style={{ fontWeight: 400 }} >
                                                190
                                            </h2>
                                            <p className="lead">Total</p>
                                        </div>
                                        <div className="precentage">
                                            90%
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
    center: state.center
})

const mapDispatchToProps = (dispatch) => ({
    fetchCenterDays: () => dispatch(fetchCenterDays())
})

export default withRouter(connect(mapStateTopProps, mapDispatchToProps)(Home));