import React, { useEffect, useState } from 'react';
import { Row, Container, Col, Image, Button, Table, Alert } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Control, LocalForm } from 'react-redux-form'
import { baseUrl } from '../../shared/baseUrl';
import HideForType from '../../helpers/HideForType';
import Loading from '../Loading';

function CenterHolidays(props) {
    const [showModal, setShowModal] = useState(false)
    const [selectedHoliday, setSelectedHoliday] = useState()
    const [errMess, setErrMess] = useState()
    const [holidays, setHolidays] = useState([])
    const [holidaysIsLoading, setHolidaysisLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [addHolidayFailedErrMess, setAddHolidayFailedErrMess] = useState()
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const getCenterHolidays = () => {
        fetch(baseUrl + 'api/center/holidays', {
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
            .then((holidays) => {
                setHolidays(holidays)
                setHolidaysisLoading(false)
            })
            .catch((error) => {
                setErrMess(error.message)
                setHolidaysisLoading(false)
            })
    }
    const addHoliday = (values) => {
        fetch(baseUrl + 'api/center/holidays', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
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
            .then((holiday) => {
                const tempList = [...holidays]
                tempList.unshift(holiday)
                setHolidays(tempList)
            })
            .catch((error) => {
                setAddHolidayFailedErrMess(error.message)
            })
    }
    /*  const updateHoliday = (values) => {
         fetch(baseUrl + 'api/center/holidays/id/' + values.id, {
             method: "PATCH",
             headers: {
                 "Content-Type": "application/json",
                 'Accept': "application/json",
                 "Authorization": `Bearer ${localStorage.getItem("token")}`
             },
             body: JSON.stringify(values)
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
             .then(() => {
                 const tempList = [...holidays]
                 const index = tempList.findIndex((holiday) => holiday.id === values.id)
                 tempList[index] = values
                 setHolidays(tempList)
             })
             .catch((error) => {
                 setErrMess(error.message)
             })
     } */

    useEffect(() => {
        getCenterHolidays()
    }, [])
    if (holidaysIsLoading) {
        return <Loading />
    }

    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const holidaysList = holidays.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(holidays.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }

    const holidaysItems = holidaysList.map((holiday) => (
        <tr key={holiday.id}>
            <td>{holiday.day}</td>
            <td>{holiday.date}</td>
            {/*  <HideForType type={["Nurse"]}>
                <td><span className="fa fa-edit me-3" type="button" onClick={() => {
                    setSelectedHoliday(holiday.id)
                    setShowModal(true)
                }} style={{ color: '#010A43' }}></span>
                </td>
            </HideForType> */}
        </tr>
    ))
    let emptyMessage
    if (holidays.length === 0) {
        emptyMessage = "There are no holidays for center"
    }

    /* const handleChange = (values) => {
        if (values.day === undefined || values.date === undefined) {
            return
        }
        setShowModal(false)
        let obj = { ...values, id: selectedHoliday }
        updateHoliday(obj)
    } */
    const handleSubmit = (values) => {
        setAddHolidayFailedErrMess(undefined)
        setErrMess(undefined)
        if (!values.date || values.date < new Date().toLocaleDateString('pt-br').split('/').reverse().join('-')) {
            setAddHolidayFailedErrMess("Date is invalid")
            return
        }
        let holiday = holidays.filter((holiday) => holiday.date === values.date)[0]
        if (holiday) {
            setAddHolidayFailedErrMess("Holiday must be unique")
            return
        }
        let obj = { ...values, day: daysInWeek[new Date(values.date).getDay()] }
        addHoliday(obj)
    }
    const ErrorAlert = () => {
        if (errMess) {
            return <Alert variant="danger" className="mt-2 mb-4" style={{
                width: "fit-content",
                margin: "0 auto"
            }} onClose={() => setErrMess(undefined)} dismissible>
                <Alert.Heading>Error !</Alert.Heading>
                {errMess}
            </Alert>
        }
        else {
            return <></>
        }
    }
    return (
        <div>
            <ErrorAlert />
            {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit center holiday</Modal.Title>
                </Modal.Header>
                <LocalForm model="updateForm" onSubmit={handleChange}>
                    <Modal.Body>
                        <FormGroup className="mb-3" controlId="dayInput">
                            <div className="input-group">
                                <div className="input-group-text">Day</div>
                                <Control.select model=".day" name="day" className="form-select" defaultValue={defaultDay}>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                </Control.select>
                            </div>
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="dateInput">
                            <div className="input-group">
                                <div className="input-group-text">Date</div>
                                <Control type="date" model=".date" type="date" defaultValue={defaultDate} className="form-control" />
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
            </Modal> */}

            <h5 style={{ fontWeight: 450 }} className="mt-3 ms-3 mb-4">Center Holidays</h5>
            <Container>
                <Row>
                    <Col className="col-12 text-center mb-3 mt-2">
                        <div style={{ position: 'relative', width: '132px', margin: '0 auto' }}>
                            <Image width={160} src='assets\images\undraw_at_home_octe.svg'></Image>

                        </div>
                    </Col>
                    <HideForType type={["Nurse"]}>

                        <Col className="col-12 text-center  mt-2">

                            <LocalForm onSubmit={(values) => handleSubmit(values)} className="text-center" style={{ marginTop: "70px" }}>
                                {addHolidayFailedErrMess ? <p className="text-center text-danger mt-2">{addHolidayFailedErrMess}</p> : <></>}

                                {/* <div className="d-md-inline-block w-auto mb-3 me-md-3">
        <Control.select model=".day" name="day" className="form-select" defaultValue="Saturday" >
            <option>Saturday</option>
            <option>Sunday</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
        </Control.select>
    </div> */}
                                <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                    <div className="input-group">
                                        <Control model=".date" type="date" className="form-control" />
                                    </div>
                                </div>

                                <div className="d-md-inline-block w-auto mb-3">

                                    <Button variant="outline-success mb-1" type="submit ">Add</Button>
                                </div>


                            </LocalForm>
                        </Col>
                    </HideForType>

                    <Col className="col-md-12 pe-md-4 mb-4 pe-0" style={{ marginTop: '35px' }}>
                        <Table hover responsive variant="white">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Date</th>
                                    {/* <HideForType type={["Nurse"]}>
                                        <th>Actions</th>
                                    </HideForType> */}
                                </tr>
                            </thead>
                            <tbody>
                                {holidaysItems}
                            </tbody>
                            {emptyMessage ? <tbody>
                                <tr>
                                    {/* <HideForType type={["Nurse"]}> */}
                                    <td colSpan={2}>
                                        {emptyMessage}
                                    </td>
                                    {/* </HideForType> */}
                                    {/* <HideForType type={["Admin"]}>
                                        <td colSpan={2}>
                                            {emptyMessage}
                                        </td>
                                    </HideForType> */}
                                </tr>
                            </tbody> : <></>}

                        </Table>
                        <center>
                            <div className="text-center">
                                <Pagination>{items}</Pagination>
                            </div>

                        </center>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}



export default withRouter((CenterHolidays));