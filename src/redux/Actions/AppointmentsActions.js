import APPOINTMENTS from '../../shared/appointments'
import { baseUrl } from '../../shared/baseUrl'
import * as ActionTypes from './ActionTypes'


export const loadAppointments = (appointments) => ({
    type: ActionTypes.LOAD_APPOINTMENTS,
    payload: appointments
})

const updateAppointment =(payload) => ({
    type : ActionTypes.UPDATE_APPOINTMENT ,
    payload
})

export const loadingAppointments = () => ({
    type: ActionTypes.LOADING_APPOINTMENTS
})


export const appointmentsFailed = (error) => ({
    type: ActionTypes.APPOINTMENTS_FAILED,
    payload: error
})

export const postAppointment = (appointment) => ({
    type: ActionTypes.ADD_APPOINTMENT,
    payload: appointment
})

const loadAccpetedAppointments = (payload) => ({
    type : ActionTypes.LOAD_ACCEPTED_APPOINTMENTS , 
    payload
})

const LoadAcceptedAppointmentFailed = (payload) => ({
    type : ActionTypes.LOAD_ACCEPTED_APPOINTMENT_FAILED , 
    payload
})

export const clearErrorMessages = (payload) => ({
    type : ActionTypes.CLEAR_APPOINTMENT_ERROR_MESSAGES,
    payload
})

export const acceptAppointment = (id) => ({
    type: ActionTypes.ACCEPT_APPOINTMENT,
    payload: id
})

export const rejectAppointment = (id) => ({
    type: ActionTypes.REJECT_APPOINTMENT,
    payload: id
})

export const deleteAppointment = (payload) => ({
    type : ActionTypes.DELETE_APPOINTMENT , 
    payload
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

export const fetchPendingAppointmentsByDate = (clinicId , date) => (dispatch) => {
    dispatch(loadingAppointments())
    fetch(baseUrl + 'api/appointments/clinicId/' + clinicId+'/date/'+date, {
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

export const changePendingAppointments = (payload) => ({
    type : ActionTypes.CHANGE_PENDING_APPOINTMENTS , 
    payload
})

export const updateAppointmetnsByDate = (doctorId,date) => (dispatch) => {
    dispatch(loadingAppointments())
    fetch(baseUrl + 'api/appointments/doctorId/' + doctorId+'/date/'+date, {
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
    .then(appoitnmetns => dispatch(loadAccpetedAppointments(appoitnmetns)))
    .catch(e => dispatch(LoadAcceptedAppointmentFailed(e.message)))
}

export const updateAcceptAppointment =  (values , appointmentId) => dispatch => {
    fetch(baseUrl + 'api/appointments/id/'+appointmentId , {
        method : "PATCH" , 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify(values)
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
        .then(() => dispatch(updateAppointment({appointmentId , ...values })))
        .catch((error) => console.log(error))
}

export const updateAppointmentToGoneStatus =  (values , appointmentId) => dispatch => {
    fetch(baseUrl + 'api/appointments/id/'+appointmentId , {
        method : "PATCH" , 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify(values)
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
        .then(() => dispatch(deleteAppointment(appointmentId)))
        .catch((error) => console.log(error))
}


export const getAcceptedAppointmentForClinic = (clinicId , date) => dispatch => {
    let requestUrl = date ? baseUrl + 'api/appointments/accepted/clinicId/' + clinicId + '/date=' + date : 
    baseUrl + 'api/appointments/accepted/clinicId/' + clinicId
    fetch(requestUrl ,{
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
    .then(appoitnmetns => dispatch(loadAccpetedAppointments(appoitnmetns)))
    .catch(e => dispatch(LoadAcceptedAppointmentFailed(e.message)))
}

export const clearAccetptedAppointments = () => ({
    type : ActionTypes.CLEAR_ACCPETED_APPOINTMENTS
})