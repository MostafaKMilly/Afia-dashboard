import APPOINTMENTS from '../../shared/appointments'
import { baseUrl } from '../../shared/baseUrl'
import * as ActionTypes from './ActionTypes'


export const loadAppointments = (appointments) => ({
    type: ActionTypes.LOAD_APPOINTMENTS,
    payload: appointments
})

export const loadingAppointments = () => ({
    type: ActionTypes.LOADING_APPOINTMENTS
})

export const loadingAcceptedAppointment = () => ({
    type: ActionTypes.LOADING_ACCPETED_APPOINTMENT_DOCTOR
})

export const appointmentsFailed = (error) => ({
    type: ActionTypes.APPOINTMENTS_FAILED,
    payload: error
})

export const postAppointment = (appointment) => ({
    type: ActionTypes.ADD_APPOINTMENT,
    payload: appointment
})

const loadAcceptedAppointmentForDoctor = (payload) => ({
    type : ActionTypes.LOAD_ACCPETED_APPOINTMENT_DOCTOR , 
    payload
})

const LoadAcceptedAppointmentFailed = (payload) => ({
    type : ActionTypes.LOAD_ACCEPTED_APPOINTMENT_FAILED , 
    payload
})

export const fetchAppointments = () => (dispatch) => {
    dispatch(loadingAppointments())
    setTimeout(() => dispatch(loadAppointments(APPOINTMENTS)), 2000)
}

export const acceptAppointment = (id) => ({
    type: ActionTypes.ACCEPT_APPOINTMENT,
    payload: id
})

export const fetchPendingAppointments = (clinicId) => (dispatch) => {
    dispatch(loadingAppointments())
    fetch(baseUrl + 'api/appointments/clinicId/' + clinicId, {
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
                let error = new Error("Error " + response.status + ":" + response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
        .then(response => response.json())
        .then(appoitnmetns => dispatch(loadAppointments(appoitnmetns)))
        .catch(e => dispatch(appointmentsFailed(e.message)))
}

export const updateAppointmetns = (doctorId) => (dispatch) => {
    dispatch(loadingAppointments())
    fetch(baseUrl + 'api/appointments/doctorId/' + doctorId, {
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
                let error = new Error("Error " + response.status + ":" + response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
        .then(response => response.json())
        .then(appoitnmetns => dispatch(loadAppointments(appoitnmetns)))
        .catch(e => dispatch(appointmentsFailed(e.message)))
}

export const getAllAcceptedAppointmentsForDoctor = (doctorId) => dispatch => {
    dispatch(loadingAcceptedAppointment())
    return fetch (baseUrl + 'api/appointments/accepted/doctorId/'+doctorId , {
        method : "GET" ,
        headers : {
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
            let error = new Error("Error " + response.status + ":" + response.statusText)
            error.response = response
            throw error
        }
    }, err => {
        let error = new Error(err.message)
        throw error;
    })
    .then(response => response.json())
    .then(appoitnmetns => dispatch(loadAcceptedAppointmentForDoctor(appoitnmetns)))
    .catch(e => dispatch(LoadAcceptedAppointmentFailed(e.message)))
}