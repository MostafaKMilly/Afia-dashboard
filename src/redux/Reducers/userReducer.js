import * as ActionTypes from '../Actions/ActionTypes'

export const User = (state = {
    userData: {},
    loggedIn: false,
    errMess: null,
}, action) => {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return { ...state, loggedIn: true, errMess: null, userData: action.payload }
        case ActionTypes.LOG_OUT:
            localStorage.clear()
            return { ...state, loggedIn: false, userData: {}, errMess: null }
        case ActionTypes.LOG_FAILED:
            return { ...state, loggedIn: false, errMess: action.payload, userData: {} }
        case ActionTypes.FAILED_FETCH_USER_DATA :
            localStorage.clear()
            return { ...state, loggedIn: false, errMess: action.payload, userData: {} }
        case ActionTypes.PATIENTS_FAILED :
            return {...state , errMess : action.payload}
        default:
            return state
    }
}