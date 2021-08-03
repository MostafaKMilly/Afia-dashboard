import * as ActionTypes from '../Actions/ActionTypes'

export const Clinics = (state = {
    clinics: [],
    isLoading: true,
    errMess: null ,
    modelDialogIsOpen : false ,
    isClinicAdded : null
}, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_CLINICS:
            return { ...state, isLoading: false, errMess: null, clinics: action.payload }
        case ActionTypes.LOADING_CLINICS:
            return { ...state, isLoading: true, errMess: null, clinics: [] }
        case ActionTypes.CLINICS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, clinics: [] }
        case ActionTypes.ADD_CLINIC:
            let clinic = action.payload
            return { ...state, isLoading: false, errMess: null, clinics: state.clinics.concat(clinic) , isClinicAdded: true }
        case ActionTypes.DELETE_CLINIC:
            let index = action.payload
            let newArr = state.clinics.filter(clinic => clinic.id !== index)
            return { ...state, isLoading: false, errMess: null, clinics: newArr }
        case ActionTypes.OPEN_CLINIC_DIALOG :
            return {...state , modelDialogIsOpen:true}
        case ActionTypes.CLOSE_CLINIC_DIALOG :
            return {...state , modelDialogIsOpen:false}
        case ActionTypes.ADD_CLINIC_FAILED:
            return { ...state, isClinicAdded: false , errMess : action.payload }
        case ActionTypes.CLOSE_CLINIC_FAILED_DIALOG :
            return {...state , isClinicAdded : null}
        default:
            return state
    }
};
