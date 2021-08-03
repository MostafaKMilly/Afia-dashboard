import * as ActionTypes from '../Actions/ActionTypes'

export const Appointments = (state = {
    appointments: [],
    acceptedAppointment : [],
    isLoading: true,
    errMess: null,
    acceptedAppointmentIsLoading : true
}, action) => {
    switch (action.type) {
        case ActionTypes.LOAD_APPOINTMENTS:
            let appointmentArr = action.payload.slice()
            appointmentArr.sort((a,b) => {
                if (a.startTime < b.startTime) {
                    return -1
                }
                if (a.startTime > b.startTime) {
                    return 1
                }
                return 0
            })
            return { ...state, isLoading: false, errMess: null, appointments: appointmentArr }
        case ActionTypes.LOADING_APPOINTMENTS:
            return { ...state, isLoading: true, errMess: null, appointments: [] }
        case ActionTypes.APPOINTMENTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, appointments: [] }
        case ActionTypes.ADD_APPOINTMENT:
            let clinic = action.payload
            return { ...state, isLoading: false, errMess: null, clinics: state.appointments.concat(clinic) }
        case ActionTypes.ACCEPT_APPOINTMENT:
            let index = action.payload
            let newArr = state.appointments.filter(appointment =>appointment.id !== index)
            return { ...state, isLoading: false, errMess: null, appointments: newArr }
        case ActionTypes.LOADING_ACCPETED_APPOINTMENT_DOCTOR  :
            return {...state , acceptedAppointmentIsLoading : true , errMess : null , acceptedAppointment : []}
        case ActionTypes.LOAD_ACCPETED_APPOINTMENT_DOCTOR : 
            return {...state , acceptedAppointmentIsLoading : false , errMess : null , acceptedAppointment : action.payload }
        case ActionTypes.LOAD_ACCEPTED_APPOINTMENT_FAILED :
            return {...state , acceptedAppointmentIsLoading : false , errMess : action.payload , acceptedAppointment : []}
        default:
            return state
    }
};
