import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Container, Row, Image, Card ,Alert} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
import BootstrapTable from "react-bootstrap-table-next"
import { SESSIONS } from '../../shared/sessions';
import {pageButtonRenderer} from '../../helpers/pageButtonRenderer'
import paginationFactory from 'react-bootstrap-table2-paginator';

function PatientDetail(props) {
    const [cancelledAppointments , setCancelledAppointments] = useState([])
    const [cancelledAppointmentsIsLoading , setCancelledAppointmentsIsLoading] = useState(true)
    const [errMess , setErrMess] = useState()

    useEffect(() => {
        const getCannceledAppoinments = () => {
            fetch(baseUrl + 'api/statistics/canceled_appointments/id/'+props.patient.patient.id , {
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
    },[])
    if (props.patients.isLoading || cancelledAppointmentsIsLoading) {
        return <Loading />
    }
    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total ml-2">
            Showing { from} to { to} of { size} Results
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
            text: 'All', value: 100
        }],
        pageButtonRenderer,
    }
    const sessionsColumns = [{
        dataField: 'id',
        text: 'Id'
    }, {
        dataField: 'doctorName',
        text: 'Doctor Name'
    }, {
        dataField: 'day',
        text: 'Day'
    },
    {
        dataField: 'date',
        text: 'Date'
    }, {
        dataField: 'type',
        text: 'Type'
    },
    ];

    const expandRow = {
        renderer: row => (
            <div>
                <p>Session Detail</p>
            </div>
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
         position : "absolute",
         top: "-1%",
        transform: "translate(-50% , 0)"
        ,left: "50%"
        ,zIndex: 1
     }} dismissible onClose={() =>setErrMess(undefined)}>
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
        <ErrorAlert/>
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
                            <div className="bg-white mb-3">
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
                                <ul class="list-inline ps-3 pe-3 text-center">
                                    <li class="list-inline-item me-2 mb-3">Setamol</li>
                                    <li class="list-inline-item me-2 mb-3">Parasetamol</li>
                                    <li class="list-inline-item me-2 mb-3">Smodwlak</li>
                                    <li class="list-inline-item me-2 mb-3">okteved</li>
                                </ul>
                            </div>
                            <div className="bg-white mt-2">

                            <Card>
                                <Card.Header className="text-white text-left p-3 pl-4 lead" style={{
                                    backgroundColor : '#ec3535'
                                }}>Cancelled Appointments</Card.Header>
                                <Card.Body>
                                    <Card.Text className="d-flex">
                                        <div className="c100 p0 small me-3">
                                            <span className="fa fa-calendar-check fa-lg" style={{
                                                color : "#ec3535"
                                            }}></span>
                                            <div className="slice">
                                                <div className="bar" style={{ borderColor: '#ec3535'}}></div>
                                                <div className="fill" style={{ borderColor: '#ec3535'}}></div>
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
                                        data={SESSIONS}
                                        columns={sessionsColumns}
                                        expandRow={expandRow}
                                        pagination={paginationFactory(options)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    patients: state.patients
})
export default withRouter(connect(mapStateToProps)(PatientDetail));