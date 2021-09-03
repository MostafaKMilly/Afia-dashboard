/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';
import { Container, Breadcrumb, Button, Row, Col, Image, Modal, FormLabel, Pagination } from 'react-bootstrap'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Loading from '../Loading';
import ErrorAlert from '../../helpers/ErrorAlert'
import { baseUrl } from '../../shared/baseUrl'
import HideForType from '../../helpers/HideForType';
import { actions, Control, LocalForm } from 'react-redux-form';
import EditPeronalInfoDoctor from '../../modals/EditPeronalInfoDoctor';
import { updateDoctorTags } from '../../redux/Actions/DoctorActions';

function DoctorDetail(props) {
    let [todayAppointments, setTodayAppointments] = useState([])
    let [isLoading, setIsLoading] = useState(true)
    let [errorMess, setErrorMess] = useState()
    let [workingDaysList, setWorkingDaysList] = useState([])
    let [workingDayError, setWorkingDayError] = useState()
    let [workingDayIsLoading, setWorkingDayIsLoading] = useState(true)
    let [showModal, setShowModal] = useState(false)
    let [holidays, setHolidays] = useState([])
    let [holidaysIsLoading, setHolidaysIsLoading] = useState(true)
    let [holidaysErrMess, setHolidaysErrMess] = useState()
    let [showHolidayModal, setShowHolidayModal] = useState(false)
    let [currentPage, setCurrentPage] = useState(1)
    let [itemsPerPage, setItemsPerPage] = useState(3)
    let [currentPageWorkingDays, setCurrentPageWorkingDays] = useState(1)
    let [itemsPerPageWorkingDays, setItemsPerPageWorkingDays] = useState(3)
    let [showSessionsDetail, setShowSessionsDetail] = useState(false)
    let [showWorkingDaysModal, setShowWorkingDaysModal] = useState(false)
    let [workingDaysModalErrMess, setWorkingDaysModalErrMess] = useState()

    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
            .then((appointments) => {
                setTodayAppointments(appointments)
                setIsLoading(false)
            })
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
            .then((workingDays) => {
                setWorkingDaysList(workingDays)
                setWorkingDayIsLoading(false)
            })
            .catch(error => {
                setWorkingDayError(error.message)
                setWorkingDayIsLoading(false)
            })

    }
    const getHolidays = (doctorId) => {
        return fetch(baseUrl + 'api/doctors/holidays/id/' + doctorId, {
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
            .then((holidays) => {
                if (holidays) {
                    setHolidays(holidays)
                }
                setHolidaysIsLoading(false)
            })
            .catch(error => {
                setHolidaysErrMess(error.message)
                setHolidaysIsLoading(false)
            })

    }
    const addHoliday = (values) => {
        return fetch(baseUrl + 'api/doctors/holidays', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
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
    }

    /*   const deleteHoliday = (holidayId) => {
          return fetch(baseUrl + 'api/doctors/holidays/id/' + holidayId, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
                  'Accept': "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
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
      } */

    const updateTags = (doctorId, values) => {
        return fetch(baseUrl + 'api/doctors/tags/id/' + doctorId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
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
    }

    const updateWorkingDay = (values, day, workingDayId, doctorId) => {
        return fetch(baseUrl + `api/doctors/work_days/id/${doctorId}/day/${day}/workingDayId/${workingDayId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
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
    }

    const deleteWorkingDay = (workingDayId, doctorId) => {
        return fetch(baseUrl + `api/doctors/work_days/doctorId/${doctorId}/workingDayId/${workingDayId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
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
    }

    const postWorkingDay = (values) => {
        return fetch(baseUrl + 'api/doctors/work_days', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
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
        getDoctorTimeLine(props.doctor.doctor.id, curday())
        getWorkingDay(props.doctor.doctor.id)
        getHolidays(props.doctor.doctor.id)
    }, [])


    const nextPath = (path) => {
        props.history.push(path)
    }
    if (props.doctors.isLoading || props.clinics.isLoading || isLoading || props.patients.isLoading || workingDayIsLoading || holidaysIsLoading) {
        return <Loading />
    }
    else if (props.doctors.errMess) {
        return (<ErrorAlert messege={props.doctors.errMess} />)
    }

    const lastIndexWorkingDays = currentPageWorkingDays * itemsPerPageWorkingDays
    const firstIndexWorkingDays = lastIndexWorkingDays - itemsPerPageWorkingDays
    const handleClickWorkingDays = (event) => {
        setCurrentPageWorkingDays(parseInt(event.target.id, 10))
    }
    let workingDaysListItems = workingDaysList?.length ? workingDaysList.slice(firstIndexWorkingDays, lastIndexWorkingDays).map((workingDay) => (
        <p>
            <span>{workingDay.day + ' : '}</span>
            <span>{formatAMPM(workingDay.startTime) + ' to '}</span>
            <span>{formatAMPM(workingDay.endTime)}</span>
        </p>
    )) : <p>{workingDayError || "there is no working days"}</p>
    let itemsList = []
    for (let i = 1; i <= Math.ceil(workingDaysList?.length / itemsPerPageWorkingDays); i++) {
        itemsList.push(
            <Pagination.Item key={i} active={i === currentPageWorkingDays} id={i} onClick={handleClickWorkingDays}>
                {i}
            </Pagination.Item>
        )
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
    let timeline = !errorMess ? todayAppointments.map((appointment => (
        <div className="timeline-step" key={appointment.id}>
            <div className="timeline-content" data-toggle="popover" data-trigger="hover">
                <div className="inner-circle"></div>
                <p className="h6 mt-3 mb-1">{formatAMPM(appointment.startTime) + ' -> ' + formatAMPM(appointment.endTime)}</p>
                <p className="h6 text-muted mb-0 mb-lg-0">
                    <PatientsName patientId={appointment.patientId} />
                </p>
            </div>
        </div>
    ))) : <p style={{ padding: "50px" }}>{errorMess}</p>
    let clinicId = props.clinics.clinics.filter((clinic) =>
        clinic.clinic.id === parseInt(props.doctor.doctor.clinicId, 10))[0].clinic.id

    const handleSubmitHoliday = (values) => {
        let day = workingDaysList.filter((workingDay) => workingDay.day === daysInWeek[new Date(values.date).getDay()])[0]
        if (values.date && values.date >= new Date().toLocaleDateString('pt-br').split('/').reverse().join('-') && day) {
            let day = daysInWeek[new Date(values.date).getDay()]
            let doctorId = props.doctor.doctor.id
            values = { ...values, day, doctorId }
            addHoliday(values).then((holiday) => {
                let tempArray = [...holidays]
                tempArray.push(holiday)
                setHolidays(tempArray)
                setHolidaysErrMess(undefined)
            })
                .catch(error => {
                    setHolidaysErrMess(error.message)
                })
        }
        else {
            setHolidaysErrMess("holiday is invalid")
        }
    }
    /* const handleDeleteHoliday = (holidayId) => {
        setHolidaysErrMess(undefined)
        deleteHoliday(holidayId).then(() => {
            let tempArray = holidays.filter((holiday) => holiday.id !== holidayId)
            setHolidays(tempArray)
        })
            .catch((error) => {
                setHolidaysErrMess(error.message)
            })
    }
*/
    const handleUpdateWorkingDay = (values , workingDayId) => {
        setWorkingDaysModalErrMess(undefined)
        if (values.endTime < values.startTime || values.endTime === values.startTime) {
            setWorkingDaysModalErrMess("time is invalid")
            return
        }
        let exist = false
        workingDaysList.forEach((workingDay) => {
            if (workingDay.day === values.day && workingDay.id !== workingDayId && workingDay.startTime.slice(0, 5) <= values.startTime && workingDay.endTime.slice(0, 5) >= values.endTime) {
                exist = true
            }
        })
        if (exist) {
            setWorkingDaysModalErrMess("working day is invalid !")
            return
        }
        let obj = { startTime: values.startTime.length === 8 ? values.startTime : values.startTime + ':00', endTime: values.endTime.length === 8 ? values.endTime : values.endTime + ':00' }
        setWorkingDaysModalErrMess(undefined)
        updateWorkingDay(obj, values.day ,workingDayId, props.doctor.doctor.id).then(() => {
            let index = workingDaysList.findIndex((workingDay) => workingDay.id === workingDayId)
            let tempArray = [...workingDaysList]
            tempArray[index] = { ...tempArray[index], startTime: values.startTime, endTime: values.endTime, day: values.day }
            setWorkingDaysList(tempArray)
        })
            .catch((error) => {
                setWorkingDaysModalErrMess(error.message)
            })
    }

    const handleDeleteWorkingDay = (doctorId, workingDayId) => {
        setWorkingDaysModalErrMess(undefined)
        deleteWorkingDay(workingDayId, doctorId).then(() => {
            let tempArray = workingDaysList.filter((workingDay) => workingDay.id !== workingDayId)
            setWorkingDaysList(tempArray)
        })
            .catch((error) => {
                setWorkingDaysModalErrMess(error.message)
            })
    }

    const handleAddWorkingDays = (values) => {
        setWorkingDaysModalErrMess(undefined)
        if (!values.day || !values.endTime || !values.startTime || values.endTime < values.startTime || values.endTime === values.startTime) {
            setWorkingDaysModalErrMess("time is invalid")
            return
        }
        let exist = false
        workingDaysList.forEach((workingDay) => {
            if (workingDay.day === values.day && workingDay.startTime.slice(0, 5) <= values.startTime && workingDay.endTime.slice(0, 5) >= values.endTime) {
                exist = true
            }
        })
        if (exist) {
            setWorkingDaysModalErrMess("working day is invalid !")
            return
        }
        values = { ...values, doctorId: props.doctor.doctor.id, startTime: values.startTime + ":00", endTime: values.endTime + ":00" }
        postWorkingDay(values).then((workingDay) => {
            let tempArr = [...workingDaysList]
            tempArr.push(workingDay)
            setWorkingDaysList(tempArr)
        })
            .catch((error) => {
                setWorkingDaysModalErrMess(error.message)
            })
    }

    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const holidaysList = holidays?.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(holidays?.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }


    const handleUpdateSessionsDuration = (values) => {
        let object = {}
        object.check = parseInt(values.check)
        object.review = parseInt(values.review)
        object.consultation = parseInt(values.consultation)
        updateTags(props.doctor.doctor.id, values).then((tag) => {
            props.updateDoctorTags(tag)
        })
            .catch((error) => {
                setErrorMess(error.message)
            })
    }
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
                                    <HideForType type={["Nurse"]}>
                                        <span className="fa fa-edit fa-lg" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}></span>
                                    </HideForType>
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
                                                <span className="fa fa-phone mr-2"></span> {'0'+props.doctor.doctor.phoneNumber}
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
                                            <div className="timeline-steps aos-init aos-animate">
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
                            <div className="profileEditIcons me-3">
                                <HideForType type={["Nurse"]}>
                                    <span className="fa fa-edit fa-lg" style={{ cursor: "pointer" }} onClick={() => setShowWorkingDaysModal(true)}></span>
                                </HideForType>
                            </div>
                            <Image src="assets/images/undraw_time_management_30iu.svg" className="img-fluid mt-3 mb-3" style={{ "maxWidth": "46%" }} alt={props.doctor.doctor.firstName} />
                            <h4 className="mb-3">Working Days</h4>
                            {workingDaysListItems}
                            <center>
                                <div className="text-center mt-2">
                                    <Pagination>{itemsList}</Pagination>
                                </div>

                            </center>
                        </div>
                        <div className="pe-4 ps-4 pb-4 pt-2 bg-white mt-4 text-center">
                            <div className="profileEditIcons me-3 mt-2">
                                <HideForType type={["Nurse"]}>
                                    <span className="fa fa-edit fa-lg" style={{ cursor: "pointer" }} onClick={() => setShowSessionsDetail(true)}></span>
                                </HideForType>
                            </div>
                            <Image src="assets/images/Blood donation-rafiki.svg" className="img-fluid mt-2 mb-1" style={{ "maxWidth": "48%" }} alt={props.doctor.doctor.firstName} />
                            <h5 className="mb-3">Sessions duration</h5>
                            {props.doctor.tag !== null ?
                                <ul className="list-group list-group-flush gap-0">
                                    <li className="list-group-item border-bottom-0">Check : {props.doctor.tag.check + 'm'}</li>
                                    <li className="list-group-item border-bottom-0">Consultation : {props.doctor.tag.consultation + 'm'}</li>
                                    <li className="list-group-item border-bottom-0">Review : {props.doctor.tag.review + 'm'}</li>
                                </ul>
                                : <p>there are no sessions duration for this doctor</p>}

                        </div>
                        <div className="pe-4 ps-4 pb-2 pt-2 bg-white mt-4 text-center mb-4">
                            <div className="profileEditIcons me-3 mt-2">
                                <HideForType type={["Nurse"]}>
                                    <span className="fa fa-edit fa-lg" style={{ cursor: "pointer" }} onClick={() => setShowHolidayModal(true)}></span>
                                </HideForType>
                            </div>
                            <h5 className="mb-3 mt-3"><span className="fa fa-calendar-day me-2"></span>Holidays</h5>

                            {
                                <ul className="list-group list-group-flush gap-0">
                                    {holidaysList.length ? holidaysList.map((holiday) => (
                                        <li className="list-group-item border-bottom-0" key={holiday.id}>{holiday.day + '  :      ' + holiday.date}</li>
                                    )) : <li className="list-group-item border-bottom-0 text-danger" key={0}>There are no holidays</li>}
                                </ul>
                            }
                            {holidays?.length === 0 ? <></> :
                                <center>
                                    <div className="text-center mt-2">
                                        <Pagination>{items}</Pagination>
                                    </div>

                                </center>
                            }
                        </div>
                    </Col>
                </Row>
            </Container>
            <EditPeronalInfoDoctor showModal={showModal} setShowModal={setShowModal} doctor={props.doctor} />
            <Modal scrollable show={showHolidayModal} onHide={() => setShowHolidayModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Holidays</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Image src="assets\images\Coffee break-rafiki.svg" width="180" height="180" />
                            <h4 className="font-weight-light text-center">Holidays</h4>
                            {holidaysErrMess && holidays.length ? <p className="mt-2 text-danger text-center">{holidaysErrMess}</p> : <></>}
                            {
                                <ul className="list-group list-group-flush gap-0 text-center mt-2 mb-2 ms-0 me-0">
                                    {holidays.length ? holidays.map((holiday) => (
                                        <li className="list-group-item border-bottom-0" key={holiday.id}>{holiday.day + '  :      ' + holiday.date}
                                            {/*  <span className="fa fa-trash-alt fa-lg" style={{
                                                position: "absolute",
                                                right: "21%",
                                                top: "32%",
                                                color: "#FF9D9D",
                                                zIndex: "999",
                                                cursor: "pointer"
                                            }} onClick={() => handleDeleteHoliday(holiday.id)} ></span> */}
                                        </li>
                                    )) : <li className="list-group-item border-bottom-0 text-danger" key={0}>There are no holidays</li>}
                                </ul>
                            }
                            <LocalForm model="holidayForm" className="text-center" onSubmit={handleSubmitHoliday}>
                                <Row style={{ alignItems: "flex-end" }} className="mb-3 mt-3">
                                    <Col className="col-md-2 col-12 text-md-right text-center">
                                        <FormLabel>
                                            Date :
                                        </FormLabel>
                                    </Col>
                                    <Col className="col-md-10 col-12">
                                        <Control type="date" className="form-control" model=".date" />
                                    </Col>
                                </Row>

                                <Button variant="outline-success mt-2 text-center w-auto" type="submit">Add</Button>
                            </LocalForm>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHolidayModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal scrollable show={showSessionsDetail} onHide={() => setShowSessionsDetail(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Sessions duration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Image src="assets/images/Blood donation-rafiki.svg" width="180" height="180" />
                            <h4 className="font-weight-light text-center">Sessions duration</h4>
                            {props.doctor.tag !== null ?
                                <LocalForm model="sessionsDurtation" className="text-center" onSubmit={handleUpdateSessionsDuration}>
                                    <Row style={{ alignItems: "flex-end" }} className="mb-4 mt-3">
                                        <Col className="col-md-2 col-12 text-md-right">
                                            <FormLabel>
                                                Check:
                                            </FormLabel>
                                        </Col>
                                        <Col className="col-md-10 col-12">
                                            <Control.select model=".check" name="check" defaultValue={props.doctor.tag.check} className="form-select" >
                                                <option>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                    <Row style={{ alignItems: "flex-end" }} className="mb-4 mt-3">
                                        <Col className="col-md-3 col-12 text-md-right">
                                            <FormLabel>
                                                Consultation:
                                            </FormLabel>
                                        </Col>
                                        <Col className="col-md-9 col-12">
                                            <Control.select model=".consultation" name="consultation" defaultValue={props.doctor.tag.consultation} className="form-select" >
                                                <option>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                    <Row style={{ alignItems: "flex-end" }} className="mb-4 mt-3">
                                        <Col className="col-md-2 col-12 text-md-right">
                                            <FormLabel>
                                                Review:
                                            </FormLabel>
                                        </Col>
                                        <Col className="col-md-10 col-12">
                                            <Control.select model=".review" name="review" defaultValue={props.doctor.tag.review} className="form-select" >
                                                <option>5</option>
                                                <option>10</option>
                                                <option>15</option>
                                                <option>20</option>
                                                <option>30</option>
                                                <option>35</option>
                                                <option>40</option>
                                            </Control.select>
                                        </Col>
                                    </Row>

                                    <Button variant="outline-success " className=" mt-2 text-center w-auto" type="submit">Save changes</Button>
                                </LocalForm>
                                :
                                <p className="mt-4 text-danger text-center">there are no sessions duration for this doctor</p>
                            }
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSessionsDetail(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" scrollable show={showWorkingDaysModal} onHide={() => setShowWorkingDaysModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit working days</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>

                            <Image src="assets/images/undraw_time_management_30iu.svg" width="180" height="180" />
                            <h4 className="font-weight-light text-center mt-3 mb-4">Working days</h4>
                            {workingDaysModalErrMess ? <p className="mt-2 mb-3 text-danger text-center">{workingDaysModalErrMess}</p> : <></>}
                            {workingDaysList?.length ? workingDaysList.map((workingDay) => (
                                <LocalForm onSubmit={(values) => handleUpdateWorkingDay(values , workingDay.id)} className="text-center" key={workingDay.id}>

                                    <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                        <Control.select model=".day" name="day" disabled className="form-select" defaultValue={workingDay.day}>
                                            <option>Saturday</option>
                                            <option>Sunday</option>
                                            <option>Monday</option>
                                            <option>Tuesday</option>
                                            <option>Wednesday</option>
                                            <option>Thursday</option>
                                            <option>Friday</option>
                                        </Control.select>
                                    </div>
                                    <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                        <div className="input-group">
                                            <Control model=".startTime" type="time" defaultValue={workingDay.startTime} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                        <div className="input-group">
                                            <Control model=".endTime" type="time" defaultValue={workingDay.endTime} className="form-control" />                                                </div>
                                    </div>
                                    <div className="d-md-inline-block w-auto mb-3">

                                        <button className="fa fa-sync-alt fa-lg me-4 submitButton" type="submit" style={{ color: "#5b50aa" }}></button>
                                        <button className="fa fa-trash-alt fa-lg submitButton" type="button" onClick={() => handleDeleteWorkingDay(props.doctor.doctor.id, workingDay.id)} style={{ color: "#ff2e63" }}></button>
                                    </div>


                                </LocalForm>

                            )) : <p className="mt-4 text-danger text-center" key={0}>There are no working days</p>}

                            <LocalForm onSubmit={(values) => handleAddWorkingDays(values)} className="text-center" style={{ marginTop: "70px" }}>

                                <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                    <Control.select model=".day" name="day" className="form-select" defaultValue="Saturday" >
                                        <option>Saturday</option>
                                        <option>Sunday</option>
                                        <option>Monday</option>
                                        <option>Tuesday</option>
                                        <option>Wednesday</option>
                                        <option>Thursday</option>
                                        <option>Friday</option>
                                    </Control.select>
                                </div>
                                <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                    <div className="input-group">
                                        <Control model=".startTime" type="time" className="form-control" />
                                    </div>
                                </div>
                                <div className="d-md-inline-block w-auto mb-3 me-md-3">
                                    <div className="input-group">
                                        <Control model=".endTime" type="time" className="form-control" />
                                    </div>
                                </div>
                                <div className="d-md-inline-block w-auto mb-3">

                                    <Button variant="outline-success" type="submit pb-1">Add</Button>
                                </div>


                            </LocalForm>

                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowWorkingDaysModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

const mapStateToProps = (state) => ({
    doctors: state.doctors,
    clinics: state.clinics,
    patients: state.patients
})

const mapDispatchToProps = (dispatch) => ({
    changeClinicId: (id) => dispatch(actions.change('editForm.clinicId', id)),
    updateDoctorTags: (tags) => dispatch(updateDoctorTags(tags))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorDetail));