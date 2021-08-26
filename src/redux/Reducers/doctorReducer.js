import * as ActionTypes from '../Actions/ActionTypes'

export const Doctors = (state = {
    isLoading: true,
    doctors: [],
    errMess: null,
    modelDialogIsOpen: false,
    doctorUpdateErrMess: null
}, action) => {
    switch (action.type) {
        case ActionTypes.SEARCH_DOCTOR:
            let email = action.payload.email
            let name = action.payload.firstName
            let searchRes = state.doctors.slice().filter((doctor) => doctor.email === email || doctor.firstName === name)
            return { ...state, isLoading: false, errMess: null, doctors: searchRes }
        case ActionTypes.LOAD_DOCTORS:
            return { ...state, isLoading: false, errMess: null, doctors: action.payload }
        case ActionTypes.LOADING_DOCTORS:
            return { ...state, isLoading: true, errMess: null, doctors: [] }
        case ActionTypes.DOCTORS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, doctors: [] }
        case ActionTypes.ADD_DOCTOR:
            let doctor = action.payload
            return { ...state, isLoading: false, errMess: null, doctors: state.doctors.concat(doctor) }
        case ActionTypes.DELETE_DOCTOR:
            let index = action.payload
            let arr = state.doctors.filter(doctor => doctor.id !== index)
            return { ...state, isLoading: false, errMess: null, doctors: arr }
        case ActionTypes.UPDATE_DOCTOR_TAG:
            let tag = action.payload
            let doctorIndex = state.doctors.findIndex((doctor) => doctor.doctor.id === tag.doctorId)
            let tempArray = [...state.doctors]
            tempArray[doctorIndex].tag = tag
            return { ...state, doctors: tempArray }
        case ActionTypes.OPEN_DOCTOR_DIALOG:
            return { ...state, modelDialogIsOpen: true }
        case ActionTypes.CLOSE_DOCTOR_DIALOG:
            return { ...state, modelDialogIsOpen: false }
        case ActionTypes.UPDATE_DOCTOR_FAILED:
            return { ...state, doctorUpdateErrMess: action.payload }
        default:
            return state
    }

};
