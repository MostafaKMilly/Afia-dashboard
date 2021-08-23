/* eslint-disable react/jsx-pascal-case */
import React, { useState } from 'react';
import { Row, Container, Col, Image, Form, Button, FormLabel, Alert } from 'react-bootstrap';
import { Control, LocalForm, actions, Errors } from 'react-redux-form'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { addCenterWorkingDays, clearErrorMessages } from '../../redux/Actions/CenterActions';

function AddWorkingDays(props) {
    const [workingDaysList, setWoringDaysList] = useState([])
    const [errorMess, setErrorMess] = useState(undefined)
    const [show, setShow] = useState(true)

    const handleSubmit = (items) => {
        let list = [...workingDaysList]
        props.resetForm()
        setErrorMess(undefined)
        if (!items.day || !items.openTime || !items.closeTime) {
            setErrorMess("working day should not be empty")
            return
        }
        if (workingDaysList.filter((workingDay) => workingDay.day === items.day).length !== 0 || items.day === 'Choose Day') {
            setErrorMess("Working day must be unique")
            return
        }
        if (items.openTime > items.closeTime) {
            setErrorMess("open time is greater than close time !")
            return
        }
        list.push(items)
        setWoringDaysList(list)
    }
    const handleSave = () => {
        props.clearErrorMessages()
        props.addCenterWorkingDays(workingDaysList)
        setWoringDaysList([])
    }
    const handleRemove = (i) => {
        let tempList = workingDaysList.filter((_, index) => index !== i)
        setWoringDaysList(tempList)
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
    const list = workingDaysList.map((item, i) => (
        <li key={i} className="mb-4 mt-3 pb-2">
            <span className="fa fa-calendar-day mr-3" style={{ "color": "grey" }}></span>
            {item.day}
            <span className="fa fa-clock ml-4 mr-4" style={{ "color": "grey" }}></span>
            {formatAMPM(item.openTime)}
            <span style={{ "color": "grey" }} className="ml-3 mr-2">{'->'}</span>
            <span className="fa fa-clock ml-4 mr-4" style={{ "color": "grey" }}></span>
            {formatAMPM(item.closeTime)}
            <span className="fa fa-trash-alt ml-4" style={{ "color": "#ff2e63f2" }} type="button" onClick={() => handleRemove(i)}></span>
        </li>
    ))
    const SubmitAlert = () => {
        if (show) {
            if (props.center.success === false) {
                return (
                    <Alert variant="danger" className="mt-2 mb-3" style={{
                        width: "fit-content",
                        margin: "0 auto"
                    }} onClose={() => setShow(false)} dismissible>
                        <Alert.Heading>Error !</Alert.Heading>
                        {props.center.errorsMessges.map((errMess) => <p>{errMess}</p>)}
                    </Alert>
                )
            }
            else if (props.center.success === true) {
                return <Alert className="mt-2 mb-3" variant="success" style={{
                    width: "fit-content",
                    margin: "0 auto"
                }} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>Error !</Alert.Heading>
                    <p>
                        Center working added successfully :)
                    </p>
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
        <div>

            <h5 style={{ fontWeight: 450 }} className="mt-3 ms-3 mb-4">Add Working days</h5>
            <Container>
                <Row>
                    <Col className="col-12 text-center mb-3">
                        <SubmitAlert />
                        <div style={{ position: 'relative', width: '132px', margin: '0 auto' }}>
                            <Image roundedCircle width={148} src='./assets/images/Work time-cuate.svg'></Image>
                        </div>
                    </Col>
                    <Col className="col-md-12 pe-md-4 pe-0" style={{ marginTop: '18px' }}>
                        <Row className="form-group align-items-center">
                            <Col md={12} className="text-center">
                                <div md="auto" className="text-center mb-1">
                                    <p
                                        className="text-danger"
                                    >
                                        {errorMess}

                                    </p>
                                </div>
                                <LocalForm model="workingDaysForm" className="mb-4 mt-2 row row-cols-lg-auto g-3 align-items-center" onSubmit={handleSubmit} style={{ placeContent: 'center' }}>
                                    <div md="auto">
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
                                    </div>
                                    <div md="auto">
                                        <div className="input-group">
                                            <div className="input-group-text">Open Time</div>
                                            <Control model=".openTime" type="time" className="form-control" validators={{

                                            }} />
                                        </div>
                                    </div>
                                    <div md="auto">
                                        <div className="input-group">
                                            <div className="input-group-text">Close Time</div>
                                            <Control model=".closeTime" type="time" className="form-control" validators={{

                                            }} />                                                </div>
                                    </div>
                                    <div md="auto" className="text-center">
                                        <Button variant="outline-secondary" type="submit">Add</Button>
                                    </div>

                                </LocalForm>
                                <div md="auto" className="text-center pt-1">
                                    <ul className="list-unstyled">
                                        {list}
                                    </ul>
                                </div>
                                <div md="auto" className="mt-2">
                                    {workingDaysList.length > 0 ? <Button variant="outline-success" onClick={handleSave}>Save</Button> : <></>}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    center: state.center
})

const mapDispatchToProps = (dispatch) => ({
    resetForm: () => dispatch(actions.reset('workingDaysForm')),
    addCenterWorkingDays: (list) => dispatch(addCenterWorkingDays(list)),
    clearErrorMessages: () => dispatch(clearErrorMessages())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddWorkingDays));