import * as ActionTypes from '../Actions/ActionTypes'

export const DoctorRegisterStatus = (
    state = {
        isDoctorAdded: null,
        isUserNameValid : true ,
        isEmailValid : true ,
        errMess : []
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_DOCTOR_FAILED:
            return { ...state, isDoctorAdded: false , errMess : state.errMess.concat(action.payload) }
        case ActionTypes.CLEAR_DOCTOR_REGISTER_ERROR_MESSAGES :
            return {...state , errMess : []}
        case ActionTypes.ADD_DOCTOR:
            return { ...state, isDoctorAdded: true }
        case ActionTypes.CLOSE_DOCTOR_FAILED_DIALOG :
            return {...state , isDoctorAdded : null}
        case ActionTypes.DOCTOR_USERNAME_IS_VALID :
            return {...state  , isUserNameValid : true}
        case ActionTypes.DOCTOR_USERNAME_IS_NOT_VALID :
            return {...state  , isUserNameValid : false}
        case ActionTypes.DOCTOR_EMAIL_IS_VALID :
            return {...state  , isEmailValid : true}
        case ActionTypes.DOCTOR_EMAIL_IS_NOT_VALID :
            return {...state  , isEmailValid : false}
        default:
            return state
    }
}