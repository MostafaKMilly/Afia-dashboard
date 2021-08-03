import * as ActionTypes from '../Actions/ActionTypes'

export const PatientRegisterStatus = (
    state = {
        isPatientAdded: null,
        isUserNameValid : true ,
        isEmailValid : true ,
        errMess : null
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_PATIENT_FAILED:
            return { ...state, isPatientAdded: false , errMess : action.payload }
        case ActionTypes.ADD_PATIENT:
            return { ...state, isPatientAdded: true }
        case ActionTypes.CLOSE_PATIENT_FAILED_DIALOG :
            return {...state , isPatientAdded : null}
        case ActionTypes.PATIENT_USERNAME_IS_VALID :
            return {...state  , isUserNameValid : true}
        case ActionTypes.PATIENT_USERNAME_IS_NOT_VALID :
            return {...state  , isUserNameValid : false}
        case ActionTypes.PATIENT_EMAIL_IS_VALID :
            return {...state  , isEmailValid : true}
        case ActionTypes.PATIENT_EMAIL_IS_NOT_VALID :
            return {...state  , isEmailValid : false}
        default:
            return state
    }
}