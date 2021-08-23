import * as ActionsTypes from './ActionTypes'
import { baseUrl } from '../../shared/baseUrl'
import { actions } from 'react-redux-form'

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

export const loadingPatientFile = () => ({
    type : ActionsTypes.LOADING_PATIENT_FILE
})

export const loadingPatientMedicalFile = () => ({
    type : ActionsTypes.LOADING_PATIENT_MEDICAL_FILE
})

export const loadPatientFile = () => ({
    type : ActionsTypes.LOAD_PATIENT_FILE
})

export const loadPatientMedicalFile = () => ({
    type : ActionsTypes.LOAD_PATIENT_MEDICAL_FILE
})

export const loadPatientFileFail = (payload) => ({
    type : ActionsTypes.LOAD_PATIENT_FILE_FAIL ,
    payload 
})

export const loadPatientMedicalFileFail = (payload) => ({
    type : ActionsTypes.LOAD_PATIENT_MEDICAL_FILE_FAILED ,
    payload 
})

const updatePatientFailed = (payload) => ({
    type : ActionsTypes.UPDATE_PATIENT_FAILED , 
    payload
})

export const updatePatientDetail = (values) => dispatch => {
    fetch (baseUrl + 'api/patients/profile/id/'+values.id , {
        method : "PATCH" ,
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
        .then(() => {
            dispatch(fetchPatients())
            getPatientFile(values)(dispatch)
        })
        .catch((error) => alert(error.message))
}

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


const getPatientFile = (patientInfo) => (dispatch) => {
    dispatch(loadingPatientFile())
    fetch (baseUrl + 'api/patients/info_report' , {
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
    .then((response) => response.blob())
    .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${patientInfo.user.username}reportInfo.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        dispatch(loadPatientFile())
    })
    .catch((error) => dispatch(loadPatientFileFail(error.message)))
}

export const getPatientMedicalFile = (patient) => (dispatch) => {
    dispatch(loadingPatientMedicalFile())
    fetch (baseUrl + 'api/report/patientId/'+patient.id , {
        method : "GET" ,
        headers : {
            'Content-Type' : 'application/json' ,
            "Accept": "application/json",
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
    .then((response) => response.blob())
    .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${patient.user.username}-GeneralReport.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        dispatch(loadPatientMedicalFile())
    })
    .catch((error) => dispatch(loadPatientMedicalFileFail(error.message)))
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
        dispatch(actions.reset('patientForm'))
        getPatientFile(patientInfo)(dispatch)
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