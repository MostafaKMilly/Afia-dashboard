import { actions } from 'react-redux-form'
import { baseUrl } from '../../shared/baseUrl'
import * as ActionTypes from './ActionTypes'

export const addDoctorFailed = (payload) => ({
    type: ActionTypes.ADD_DOCTOR_FAILED,
    payload
})

export const loadDoctors = (doctors) => ({
    type: ActionTypes.LOAD_DOCTORS,
    payload: doctors
})

export const closeRegisterDialog = () => ({
    type: ActionTypes.CLOSE_DOCTOR_FAILED_DIALOG
})

export const loadingDoctors = () => ({
    type: ActionTypes.LOADING_DOCTORS
})

export const doctorsFailed = (error) => ({
    type: ActionTypes.DOCTORS_FAILED,
    payload: error
})


export const doctorUserNameisValid = () => ({
    type: ActionTypes.DOCTOR_USERNAME_IS_VALID
})

export const doctorUserNameisNotValid = () => ({
    type: ActionTypes.DOCTOR_USERNAME_IS_NOT_VALID
})

export const updateDoctorTags = (payload) => ({
    type: ActionTypes.UPDATE_DOCTOR_TAG,
    payload
})

export const checkDoctorUserName = (userName) => dispatch => {
    const obj = {}
    obj.username = userName
    fetch(baseUrl + 'api/checkUserName', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
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
        .then((messege) => dispatch(doctorUserNameisValid()))
        .catch((e) => dispatch(doctorUserNameisNotValid()))
}

export const doctorEmailIsValid = () => ({
    type: ActionTypes.DOCTOR_EMAIL_IS_VALID
})

export const doctorEmailIsNotValid = () => ({
    type: ActionTypes.DOCTOR_EMAIL_IS_NOT_VALID
})

export const checkDoctorEmail = (email) => dispatch => {
    const obj = {}
    obj.email = email
    fetch(baseUrl + 'api/checkEmail', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
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
        .then((messege) => dispatch(doctorEmailIsValid()))
        .catch((e) => dispatch(doctorEmailIsNotValid()))
}

export const postDoctor = (payload) => ({
    type: ActionTypes.ADD_DOCTOR,
    payload
})


/* const addDoctorPhoto = (id , image) => {
    fetch(baseUrl + 'api/doctors/photo/id/'+ id , {
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
} */

export const addTagForDoctor = (doctorId, tags) => {
    fetch(baseUrl + 'api/doctors/tags/id/' + doctorId, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(tags)
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
}
export const clearDoctorErrorMessages = () => ({
    type: ActionTypes.CLEAR_DOCTOR_REGISTER_ERROR_MESSAGES
})

export const addDoctor = (doctorInfo) => (dispatch) => {
    let personaolInfo = { ...doctorInfo }
    delete personaolInfo.clinic
    delete personaolInfo.workingDaysList
    delete personaolInfo.workingDays
    delete personaolInfo.tags
    fetch(baseUrl + 'api/doctors/Signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(personaolInfo)
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
        .then(doctor => {
            dispatch(postDoctor(doctor))
            Promise.all(doctorInfo.workingDaysList.map((workingDay) => {
                workingDay = { ...workingDay, doctorId: doctor.DoctorData.id, startTime: workingDay.startTime + ":00", endTime: workingDay.endTime + ":00" }
                return fetch(baseUrl + 'api/doctors/work_days', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(workingDay)
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
                    .catch(e => dispatch(addDoctorFailed(workingDay.day + ': ' + e.message)))
            }))
            addTagForDoctor(doctor.DoctorData.id, doctorInfo.tags)
            dispatch(actions.reset('doctorForm'))
            dispatch(fetchDoctors())
        })
        .catch(e => dispatch(addDoctorFailed(e.message)))
}

/* const updatedDoctorFailed = (payload) => ({
    type : ActionTypes.UPDATE_DOCTOR_FAILED , 
    payload
})
 */


export const updateDoctorDetail = (values) => dispatch => {
    fetch(baseUrl + 'api/doctors/profile/id/' + values.id, {
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
        .then(() => {
            dispatch(fetchDoctors())
        })
        .catch((error) => alert(error.message))
}

export const deleteDoctor = (id) => (dispatch) => {
    fetch(baseUrl + 'api/doctors/' + id, {
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
        .then(doctors => dispatch(loadDoctors(doctors)))
        .catch(e => dispatch(doctorsFailed(e.message)))
}
export const searchDoctor = (email, firstName) => ({
    type: ActionTypes.SEARCH_DOCTOR,
    payload: {
        email, firstName
    }
})

export const closeDoctorDialog = () => ({
    type: ActionTypes.CLOSE_DOCTOR_DIALOG
})

export const openDoctorDialog = () => ({
    type: ActionTypes.OPEN_DOCTOR_DIALOG
})

export const fetchDoctors = () => (dispatch) => {
    dispatch(loadingDoctors())
    fetch(baseUrl + 'api/doctors/all', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
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
        .then(doctors => dispatch(loadDoctors(doctors)))
        .catch(e => dispatch(doctorsFailed(e.message)))
}
