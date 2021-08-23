import React, { useEffect, useState } from 'react';
import { Button, Col, FormLabel, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import ErrorAlert from '../../helpers/ErrorAlert';
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';

function AppointmentAvailableTimes(props) {
    const [availableTimes , setAvailableTimes] = useState([])
    const [availableTimesIsLoading , setAvailableTimesIsLoading] = useState(true)
    const [activeTimeButton , setActiveTimeButton] = useState()
    const [tagsIsLoading , setTagsIsLoading] = useState(true)
    const [adderValue , setAdderValue] = useState()

    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    useEffect(() => {
        const getAvailableTimes = (date , day , doctorId) => {
            fetch(baseUrl + `api/appointments/empty_time/doctorId/${doctorId}/day/${day}/date/${date}` , {
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
            .then ((availableTimes) => {
                setAvailableTimes(availableTimes)
                setAvailableTimesIsLoading(false)
            })
            .catch((error) => {
                props.setErrMess(error.message)
                setAvailableTimesIsLoading(false)   
            })
        }
        getAvailableTimes(props.appointmentForm.date , daysInWeek[new Date(props.appointmentForm.date).getDay()] 
        , props.appointmentForm.doctorId )

        const getDoctorTag = () => {
            fetch(baseUrl +'api/doctors/tags/id/'+props.appointmentForm.doctorId , {
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
            .then ((tags) => {
                for (let property in tags) {
                    if (property === props.appointmentForm.type.toLowerCase()) {
                        setAdderValue(tags[property])
                    }
                }
                setTagsIsLoading(false)
            })
            .catch((error) => {
                props.setErrMess(error.message)
                setTagsIsLoading(false)   
            })
        }
        getDoctorTag()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    function addMinutes(time, minsToAdd) {
        function D(J){ return (J<10? '0':'') + J;};
        var piece = time.split(':');
        var mins = piece[0]*60 + +piece[1] + +minsToAdd;
      
        return D(mins%(24*60)/60 | 0) + ':' + D(mins%60);  
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

    const submitAppointment = (obj) => {
        return fetch(baseUrl + 'api/appointments' , {
            method : "POST" , 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify(obj)
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

    const handleSubmit = () => {
        let obj = {}
        obj.clinicId = props.appointmentForm.clinicId
        obj.doctorId = props.appointmentForm.doctorId
        obj.patientId = props.appointmentForm.patientId
        obj.day = daysInWeek[new Date(props.appointmentForm.date).getDay()]
        obj.date = props.appointmentForm.date
        obj.type = props.appointmentForm.type
        obj.status = "Pending"
        obj.description = props.appointmentForm.description
        obj.startTime = activeTimeButton
        obj.endTime = addMinutes(activeTimeButton , adderValue)
        submitAppointment(obj).then(() => {
            props.resetForm()
            props.changeSuccessMessage("Appointment reversed successfully")
            setActiveTimeButton(undefined)
            nextPath('/dashboard/addAppointments')
        })
        .catch((error) => {
            props.setErrMess(error.message)
        })
    }

    if (!props.appointmentForm.date || !props.appointmentForm.doctorId ||
         !props.appointmentForm.patientId ||
         !props.appointmentForm.clinicId || !props.appointmentForm.description) {
        return (<ErrorAlert messege="please add basic appointment info :)" color="white" />)
    }
    if (availableTimesIsLoading || tagsIsLoading) {
        return <Loading/>
    }
    const nextPath = (path) => {
        props.history.push(path)
    }
    let disabled = activeTimeButton ? false : true 

    const availableTimesList =[]
    availableTimes.forEach((obj) => {
        let currentTime = obj.startTime
        while (addMinutes(currentTime , adderValue) < obj.endTime) {
            availableTimesList.push(currentTime)
            currentTime = addMinutes(currentTime , adderValue)
        }
    })
    
    return (
        <Col md={12}>
            <Row className="form-group g-2 mt-3" >
                <Col md={2}>
                    <FormLabel>
                        Available times :
                    </FormLabel>
                </Col>
                <Col md={10}>
                    <div className="timesContainer ">
                        {availableTimesList.map((time , index) => (
                            <Button className={activeTimeButton ===time ? 'active m-2' : 'm-2'} variant="outline-secondary" onClick={() => setActiveTimeButton(time)}  key={index}>{formatAMPM(time)}</Button>
                        ))}
                    </div>
                </Col>
            </Row>
            <Row className="form-group">
                <Col md={{ size: 10, offset: 2 }}>
                    <Button className="btn6 me-2" type="submit" onClick={() => nextPath(`/dashboard/addAppointments`)}>
                        Back
                    </Button>
                    <Button className="btn2" type="submit" disabled={disabled} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </Col>
    );
}

const mapStateToProps = (state) => ({
    appointmentForm: state.appointmentForm
})

const mapDispatchToProps = (dispatch) => ({
    resetForm: () => dispatch(actions.reset('appointmentForm')),
    changeSuccessMessage : (value) => dispatch(actions.change('appointmentForm.successMessage' , value))
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AppointmentAvailableTimes));