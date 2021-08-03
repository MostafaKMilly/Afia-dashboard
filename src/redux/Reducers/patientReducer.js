import * as ActionTypes from '../Actions/ActionTypes'

export const Patients = (state = {
    isLoading: true,
    patients: [],
    errMess: null ,
    modelDialogIsOpen : false
}, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_PATIENTS:
            return { ...state, isLoading: false, errMess: null, patients: action.payload }
        case ActionTypes.LOADING_PATIENTS:
            return { ...state, isLoading: true, errMess: null, patients: [] }
        case ActionTypes.PATIENTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, patients: [] }
        case ActionTypes.ADD_PATIENT:
            let patient = action.payload
            return { ...state, isLoading: false, errMess: null,patients: state.patients.concat(patient) }
        case ActionTypes.DELETE_PATIENT:
            let index = action.payload
            let arr = state.patients.filter(patient => patient.id !== index)
            return { ...state, isLoading: false, errMess: null, patients: arr }
        case ActionTypes.OPEN_PATIENT_DIALOG :
            return {...state , modelDialogIsOpen:true}
        case ActionTypes.CLOSE_PATIENT_DIALOG :
            return {...state , modelDialogIsOpen:false}
        default:
            return state
    }
};
