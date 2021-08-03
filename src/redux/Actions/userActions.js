import { baseUrl } from '../../shared/baseUrl'
import * as ActionTypes from './ActionTypes'

const setUser = (payload) => ({
    type: ActionTypes.SET_USER,
    payload
})

export const logUserOut = () => ({
    type: ActionTypes.LOG_OUT
})

export const logFailed = (payload) => ({
    type : ActionTypes.LOG_FAILED ,
    payload
})  

export const failedToFetchUserData = (payload) => ({
    type : ActionTypes.FAILED_FETCH_USER_DATA ,
    payload
})

export const fetchUser = (userInfo) => dispatch => {
    fetch(baseUrl + 'api/Signin', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
        .then (response => {
            let token = response.headers.get("x-token").split(" ")[1]
            localStorage.setItem("token", token)
            if (response.ok) {
                return response
            }
            else {
                let error = new Error("Error " + response.status + ":" + response.statusText)
                throw error
            }
        })
        .then(res => res.json())
        .then(data => {
            let object = {}
            if (data.doctor) {
                object = { ...data.doctor }
                object.photo = data.photo
            }
            else {
                object.user = data
            }
            dispatch(setUser(object))
        }).catch(e =>dispatch(logFailed(e.message)))
}


export const signUserUp = (userInfo) => dispatch => {
    fetch(`http://localhost:4000/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(userInfo)
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("token", data.token)
            dispatch(setUser(data.user))
        })
}

export const autoLogin = () => dispatch => {
    fetch(baseUrl + 'api/autoLogin', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then (response => {
            if (response.ok) {
                return response
            }
            else {
                let error = new Error("Error " + response.status + ":" + response.statusText)
                throw error
            }
        })
        .then(res => res.json())
        .then(data => {
            let object = {}
            if (data.doctor) {
                object = { ...data.doctor }
                object.photo = data.photo
            }
            else if (data.patient) {
                object = { ...data.patient }
                object.photo = data.photo
            }
            else {
                object.user = data
            }
            console.log(object)
            dispatch(setUser(object))
        }).catch(e => dispatch (failedToFetchUserData(e.message)))

}