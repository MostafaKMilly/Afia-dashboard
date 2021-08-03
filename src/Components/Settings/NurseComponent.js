import React, { useEffect, useState } from 'react';
import { Row, Container, Col, Image, Form, Button, Table, Modal, FormGroup, FormLabel, Alert } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearErrMess, deleteWorkingDay, updateWorkingDay } from '../../redux/Actions/CenterActions';
import { Control, LocalForm } from 'react-redux-form'
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
function NurseComponent(props) {
    const [showModal, setShowModal] = useState(false)
    const [selectDay, setSelectedDay] = useState('')
    const [nurses, setNurses] = useState([])
    const [error , setError] = useState('')
    const [isloading , setIsLoading] = useState(true)
    const getNurses = () => {
        return fetch(baseUrl + 'api/nurses/', {
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
            setError(error.message)
            setIsLoading(false)
        })
    }
    useEffect(() => {
        getNurses().then((nurses) => {
            setNurses(nurses)
            setIsLoading(false)
        })
    } , [])

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
    const nursesList = nurses?.map((nurse) => (
        <tr key={nurse.id}>
            <td>{nurse.username}</td>
            <td>{nurse.email}</td>
            <td>{nurse.password}</td>
            <td><span className="fa fa-edit me-3" type="button" style={{ color: '#010A43' }}></span>
                <span className="fa fa-trash-alt" type="button" style={{ color: '#010A43' }}></span>
            </td>
        </tr>
    ))
    let emptyMessage
    if (props.center.workingDays.length === 0) {
        emptyMessage = "There are no working days for center"
    }
    const nextPath = (path) => {
        props.history.push(path)
    }
    const handleSubmit = (values) => {
        console.log(selectDay)
        if (values.day === undefined || values.openTime === undefined || values.closeTime === undefined) {
            return
        }
        props.updateWorkingDay(selectDay, values)
        setShowModal(false)
    }
    const ErrorAlert = () => {
        if (props.center.errMess) {
            return <Alert variant="danger" className="mt-2 mb-4" style={{
                width: "fit-content",
                margin: "0 auto"
            }} onClose={() => props.clearErrMess()} dismissible>
                <Alert.Heading>Error !</Alert.Heading>
                {props.center.errMess}
            </Alert>
        }
        else {
            return <></>
        }
    }
    if (isloading) {
        return <Loading/>
    }
    return (
        <div>
            <ErrorAlert />
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit working day</Modal.Title>
                </Modal.Header>
                <LocalForm model="updateForm" onSubmit={handleSubmit}>
                    <Modal.Body>
                        <FormGroup className="mb-3" controlId="dayInput">
                            <Control.select model=".day" name="day" className="form-select" validators={{
                            }}>
                                <option selected>Choose Day</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                            </Control.select>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="startTimeInput">
                            <div className="input-group">
                                <div className="input-group-text">Open Time</div>
                                <Control model=".openTime" type="time" className="form-control" validators={{

                                }} />
                            </div>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="startTimeInput">
                            <div className="input-group">
                                <div className="input-group-text">Close Time</div>
                                <Control model=".closeTime" type="time" className="form-control" validators={{

                                }} />
                            </div>
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </LocalForm>
            </Modal>

            <h5 style={{ fontWeight: 450 }} className="mt-3 ms-3 mb-4">Manage Nurses</h5>
            <Container>
                <Row>
                    <Col className="col-12 text-center mb-3">
                        <div style={{ position: 'relative', width: '132px', margin: '0 auto' }}>
                            <Image roundedCircle width={172} src='.\assets\images\undraw_doctors_hwty.svg'></Image>

                        </div>
                    </Col>
                    <Col className="col-md-12 pe-md-4 pe-0" style={{ marginTop: '35px' }}>
                        <Table hover responsive variant="white">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                               {nursesList}
                            </tbody>
                            {error ? <tbody>
                                <tr>
                                    <td colSpan={4}>
                                        {error}
                                    </td>
                                </tr>
                            </tbody> : <></>}

                        </Table>
                        <center>
                            <Link className="mt-2 btn btn-outline-secondary" to="/dashboard/settings/addWorkingDays">Add</Link>
                        </center>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapDispatchTopProps = (dispatch) => ({
    deleteWorkingDay: (day) => dispatch(deleteWorkingDay(day)),
    updateWorkingDay: (day, values) => dispatch(updateWorkingDay(day, values)),
    clearErrMess: () => dispatch(clearErrMess())
})

const mapStateTopProps = (state) => ({
    center: state.center
})

export default withRouter(connect(mapStateTopProps, mapDispatchTopProps)(NurseComponent));