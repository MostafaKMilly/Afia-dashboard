import * as ActionTypes from '../Actions/ActionTypes'

export const Appointments = (state = {
    appointments: [],
    acceptedAppointment: [],
    isLoading: true,
    errMess: null,
    acceptedAppointmentIsLoading: true
}, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_APPOINTMENTS:
            let appointmentArr = action.payload.slice()
            appointmentArr.sort((a, b) => {
                if (a.startTime < b.startTime) {
                    return -1
                }
                if (a.startTime > b.startTime) {
                    return 1
                }
                return 0
            })
            return { ...state, isLoading: false, errMess: null, appointments: appointmentArr, acceptedAppointment: [] }
        case ActionTypes.CHANGE_PENDING_APPOINTMENTS : 
            return {...state , appointments : action.payload }
        case ActionTypes.LOADING_APPOINTMENTS:
            return { ...state, isLoading: true, errMess: null, appointments: [], acceptedAppointment: [] }
        case ActionTypes.APPOINTMENTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, appointments: [], acceptedAppointment: [] }
        case ActionTypes.ADD_APPOINTMENT:
            let clinic = action.payload
            return { ...state, isLoading: false, errMess: null, clinics: state.appointments.concat(clinic) }
        case ActionTypes.ACCEPT_APPOINTMENT:
            let index = action.payload
            let newArr = state.appointments.filter(appointment => appointment.id !== index)
            return { ...state, isLoading: false, errMess: null, appointments: newArr }
        case ActionTypes.REJECT_APPOINTMENT:
            let Arrindex = action.payload
            let tempArray = state.appointments.filter(appointment => appointment.id !== Arrindex)
            return { ...state, isLoading: false, errMess: null, appointments: tempArray }

        case ActionTypes.LOAD_ACCEPTED_APPOINTMENTS:
            return { ...state, acceptedAppointmentIsLoading: false, errMess: null, acceptedAppointment: action.payload }
        case ActionTypes.LOAD_ACCEPTED_APPOINTMENT_FAILED:
            return { ...state, acceptedAppointmentIsLoading: false, errMess: action.payload, acceptedAppointment: [] }
        case ActionTypes.UPDATE_APPOINTMENT:
            let appointmentId = action.payload.appointmentId
            let objIndex = state.acceptedAppointment.findIndex((appointment) => appointment.id === parseInt(appointmentId))
            let tempoArray = [...state.acceptedAppointment]
            if (action.payload.date) {
                tempoArray[objIndex].date = action.payload.date
            }
            if (action.payload.startTime) {
                tempoArray[objIndex].startTime = action.payload.startTime
            }
            if (action.payload.endTime) {
                tempoArray[objIndex].endTime = action.payload.endTime
            }
            if (action.payload.doctorId) {
                tempoArray[objIndex].doctorId = action.payload.doctorId
            }
            return { ...state, acceptedAppointment: tempoArray }
        case ActionTypes.DELETE_APPOINTMENT:
            let arrInd = action.payload
            let tempooArray = state.acceptedAppointment.filter(appointment => appointment.id !== arrInd)
            return { ...state, acceptedAppointment: tempooArray }
        case ActionTypes.CLEAR_ACCPETED_APPOINTMENTS:
            return { ...state, acceptedAppointment: [] }
        case ActionTypes.CLEAR_APPOINTMENT_ERROR_MESSAGES:
            let err = action.payload ? action.payload : null
            return { ...state, errMess: err }
        default:
            return state
    }
};
