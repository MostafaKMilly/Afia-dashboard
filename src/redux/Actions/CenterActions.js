import * as ActionsTypes from './ActionTypes'
import { baseUrl } from '../../shared/baseUrl'

const centerDaysLoading = () => ({
    type : ActionsTypes.LOADING_CENTER_DAYS
})

const loadCenterDays = (payload) => ({
    type : ActionsTypes.LOAD_CENTER_DAYS ,
    payload
})

const loadCenterDaysFailed = (payload) => ({
    type : ActionsTypes.LOAD_CENTER_DAYS_FAILED , 
    payload
})

const AddWorkingDaysFailed = (payload) => ({
    type : ActionsTypes.ADD_WORKING_DAYS_FAILED ,
    payload
})

export const clearErrorMessages = () => ({
    type : ActionsTypes.CLEAR_ERROR_MESSAGES
})

export const addWorkingDays = () => ({
    type : ActionsTypes.ADD_WORKING_DAYS,
})

const deleteWorkingDayObj = (payload) => ({
    type : ActionsTypes.DELETE_WORKING_DAY ,
    payload
})

const updateWorkingDayObj= (payload) => ({
    type : ActionsTypes.UPDATE_WORKING_DAY ,
    payload
})
export const fetchCenterDays = () => dispatch => {
    dispatch(centerDaysLoading())
    fetch(baseUrl + 'api/center/work_days' , {
        method : "GET",
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
    .then(workingDays => dispatch(loadCenterDays(workingDays)))
    .catch (error => dispatch(loadCenterDaysFailed(error.message)))
}


export const addCenterWorkingDays = (workingDaysList) => (dispatch) => {
    Promise.all(workingDaysList.map((workingdayElement) => {
        return fetch(baseUrl + 'api/center/work_days' , {
            method : "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body : JSON.stringify(workingdayElement)
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
        .catch(e => dispatch(AddWorkingDaysFailed(workingdayElement.day +": "+e.message)))
    }))
    .then(() => {
        fetchCenterDays()
        dispatch(addWorkingDays())
    })
    .catch(e => console.log(e))
}


export const deleteWorkingDay = (day) => dispatch => {
    fetch(baseUrl + 'api/center/work_days/day/'+day , {
        method : "DELETE",
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
    .then(() => dispatch(deleteWorkingDayObj(day)))
    .catch (error => dispatch(loadCenterDaysFailed(error.message)))
}

export const clearErrMess = () => ({
    type : ActionsTypes.CLEAR_ERR_MESS
})

export const updateWorkingDay = (day , values) => dispatch => {
    fetch(baseUrl + 'api/center/work_days/day/'+day , {
        method : "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body : JSON.stringify(values)
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
    .then(() => dispatch(updateWorkingDayObj({day , ...values})))
    .catch (error => dispatch(loadCenterDaysFailed(error.message)))
}

