import * as ActionTypes from '../Actions/ActionTypes'

export const PatientRegisterStatus = (
    state = {
        isPatientAdded: null,
        isUserNameValid: true,
        isEmailValid: true,
        errMess: null,
        isFileLoading: null,
        patientFileErrMess: null,
        isMedicalFileLoading: null,
        medicalFileErrMess: null
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.ADD_PATIENT_FAILED:
            return { ...state, isPatientAdded: false, errMess: action.payload }
        case ActionTypes.ADD_PATIENT:
            return { ...state, isPatientAdded: true }
        case ActionTypes.CLOSE_PATIENT_FAILED_DIALOG:
            return { ...state, isPatientAdded: null }
        case ActionTypes.PATIENT_USERNAME_IS_VALID:
            return { ...state, isUserNameValid: true }
        case ActionTypes.PATIENT_USERNAME_IS_NOT_VALID:
            return { ...state, isUserNameValid: false }
        case ActionTypes.PATIENT_EMAIL_IS_VALID:
            return { ...state, isEmailValid: true }
        case ActionTypes.PATIENT_EMAIL_IS_NOT_VALID:
            return { ...state, isEmailValid: false }
        case ActionTypes.LOADING_PATIENT_FILE:
            return { ...state, isFileLoading: true, patientFileErrMess: null }
        case ActionTypes.LOAD_PATIENT_FILE:
            return { ...state, isFileLoading: false, patientFileErrMess: null }
        case ActionTypes.LOAD_PATIENT_FILE_FAIL:
            return { ...state, isFileLoading: false, patientFileErrMess: action.payload }
        case ActionTypes.LOADING_PATIENT_MEDICAL_FILE:
            return { ...state, isMedicalFileLoading: true, medicalFileErrMess: null }
        case ActionTypes.LOAD_PATIENT_MEDICAL_FILE:
            return { ...state, isMedicalFileLoading: false, medicalFileErrMess: null }
        case ActionTypes.LOAD_PATIENT_MEDICAL_FILE_FAILED:
            return { ...state, isMedicalFileLoading: false, medicalFileErrMess: action.payload }
        case ActionTypes.RESET_PATIENT_FILE_ERR_MESS:
            return { ...state, patientFileErrMess: null }
        default:
            return state
    }
}