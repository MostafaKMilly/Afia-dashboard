import * as ActionsTypes from './ActionTypes'
import { baseUrl } from '../../shared/baseUrl'

const patientsLoading = () => ({
    type : ActionsTypes.LOADING_PATIENTS
}) 
const loadPatients = (payload) => ({
    type : ActionsTypes.LOAD_PATIENTS , 
    payload
})

const patientsFailed = (payload) => ({
    type : ActionsTypes.PATIENTS_FAILED,
    payload 
})

export const closePatientRegisterDialog = () => ({
    type : ActionsTypes.CLOSE_PATIENT_FAILED_DIALOG
})

export const addPatientFailed = (payload) => ({
    type : ActionsTypes.ADD_PATIENT_FAILED ,
    payload
})


export const patientUserNameisValid = () => ({
    type : ActionsTypes.PATIENT_USERNAME_IS_VALID
}) 

export const patientUserNameisNotValid = () => ({
    type : ActionsTypes.PATIENT_USERNAME_IS_NOT_VALID
}) 

export const checkPatientUserName = (userName) => dispatch => {
    const obj = {}
    obj.username = userName
    fetch (baseUrl + 'api/checkUserName' , {
        method : "POST" , 
        body : JSON.stringify(obj) ,
        headers : {
            'Content-Type' : 'application/json' ,
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
    .then(res => res.json())
    .then ((messege) => dispatch(patientUserNameisValid()))
    .catch ( (e) => dispatch(patientUserNameisNotValid()))
}


export const patientrEmailIsValid = () => ({
    type : ActionsTypes.PATIENT_EMAIL_IS_VALID
}) 

export const patientEmailIsNotValid = () => ({
    type : ActionsTypes.PATIENT_EMAIL_IS_NOT_VALID
}) 

export const checkPatientEmail = (email) => dispatch => {
    const obj = {}
    obj.email = email
    fetch (baseUrl + 'api/checkEmail' , {
        method : "POST" , 
        body : JSON.stringify(obj) ,
        headers : {
            'Content-Type' : 'application/json' ,
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
    .then(res => res.json())
    .then ((messege) => dispatch(patientrEmailIsValid()))
    .catch ( (e) => dispatch(patientEmailIsNotValid()))
}


export const postPatient = (payload) => ({
    type: ActionsTypes.ADD_PATIENT,
    payload
})


const addPatientPhoto = (id , image) => {
    fetch(baseUrl + 'api/patients/photo/id/'+ id , {
        method : "POST" ,
        body : image ,
        headers : {
            'Accept' : 'multipart/form-data'
        },
        credentials : 'include'
    })
    .then(res => {
        if (res.ok) {
            console.log("success")
        }
        else {
            console.log("failed")
        }
    })
}


export const addPatient = (patientInfo) => (dispatch) => {
    fetch(baseUrl + 'api/patients/Signup' , {
        method : "POST" ,
        headers : {
            'Content-Type' : 'application/json' ,
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify(patientInfo)
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
    .then(res => res.json())
    .then(patient => {
        dispatch(postPatient(patient))
        dispatch(fetchPatients())
    })
    .catch(e => dispatch(addPatientFailed(e.message)))
}

export const fetchPatients = () => dispatch => {
    dispatch(patientsLoading())   
    fetch(baseUrl + 'api/patients/all', {
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
        .then(patients => dispatch(loadPatients(patients)))
        .catch(e => dispatch(patientsFailed(e.message)))
}


export const deletePatient = (id) => (dispatch) => {
    fetch(baseUrl + 'api/patients/' + id, {
        method: "DELETE",
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
        .then(patients => dispatch(loadPatients(patients)))
        .catch(e => dispatch(patientsFailed(e.message)))
}


export const closePatientDialog = () => ({
    type: ActionsTypes.CLOSE_PATIENT_DIALOG
})

export const openPatientDialog = () => ({
    type: ActionsTypes.OPEN_PATIENT_DIALOG
})