import { baseUrl } from '../../shared/baseUrl'
import * as ActionTypes from './ActionTypes'


export const loadClinics = (clinics) => ({
    type: ActionTypes.LOAD_CLINICS,
    payload: clinics
})

export const loadingClinics = () => ({
    type: ActionTypes.LOADING_CLINICS
})

export const clinicsFailed = (error) => ({
    type: ActionTypes.CLINICS_FAILED,
    payload: error
})



export const postClinic = (clinic) => ({
    type: ActionTypes.ADD_CLINIC,
    payload: clinic
})


const addclinicPhoto = (id, image) => dispatch => {
    fetch(baseUrl + 'api/clinics/photo/id/' + id, {
        method: "POST",
        headers: {
            'Accept': 'multipart/form-data',
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: image
    })
        .then(res => {
            if (res.ok) {
                console.log("success")
            }
            else {
                let error = new Error(res.statusText)
                error.res = res
                throw error
            }
        })
        .catch((e) => dispatch(addclinicFailed(e.message)))
}

export const addclinicFailed = (payload) => ({
    type: ActionTypes.ADD_CLINIC_FAILED,
    payload
})


export const addClinic = (clinicInfo) => (dispatch) => {
    let clinicInfoObj = { ...clinicInfo }
    delete clinicInfoObj.image
    fetch(baseUrl + 'api/clinics/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(clinicInfoObj)
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
        .then(clinic => {
            dispatch(postClinic(clinic))
            let havePhoto = true
            for (let val of clinicInfo.image.entries()) {
                if (val[1] === "undefined") {
                    havePhoto = false
                }
            }
            if (havePhoto) {
                addclinicPhoto(clinic.id, clinicInfo.image)(dispatch)
            }
            dispatch(fetchClinics())
        })
        .catch(e => dispatch(addclinicFailed(e.message)))
}

export const closeClinicRegisterDialog = () => ({
    type: ActionTypes.CLOSE_CLINIC_FAILED_DIALOG
})

export const fetchClinics = () => (dispatch) => {
    dispatch(loadingClinics())
    fetch(baseUrl + 'api/clinics/all', {
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
        .then(clinics => dispatch(loadClinics(clinics)))
        .catch(e => dispatch(clinicsFailed(e.message)))
}

export const deleteClinic = (id) => ({
    type: ActionTypes.DELETE_CLINIC,
    payload: id
})

export const closeClinicDialog = () => ({
    type: ActionTypes.CLOSE_CLINIC_DIALOG
})

export const openClinicDialog = () => ({
    type: ActionTypes.OPEN_CLINIC_DIALOG
})
