import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Doctors } from './Reducers/doctorReducer'
import { Clinics } from './Reducers/clinicReducer'
import { User } from './Reducers/userReducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { Patients } from './Reducers/patientReducer'
import {Appointments} from './Reducers/appointmentReducer'
import { createForms } from 'react-redux-form'
import { intialDotorForm } from './Forms/doctorform'
import { intialClinicForm } from './Forms/clinicForm'
import { DoctorRegisterStatus } from './Reducers/doctorRegisterStatus'
import { PatientRegisterStatus } from './Reducers/patientRegisterStatus'
import { intialPatientForm } from './Forms/patientForm'
import { Center } from './Reducers/centerReducer'
import { intialApppointmentForm } from './Forms/appointmentForm'
export const configureStore = () => {
    const store = createStore(
        combineReducers({
            doctors: Doctors,
            clinics: Clinics,
            user: User,
            patients : Patients ,
            appointments : Appointments,
            center : Center,
            doctorRegisterStatus : DoctorRegisterStatus,
            patientRegisterStatus : PatientRegisterStatus, 
            ...createForms ({
                doctorForm : intialDotorForm ,
                clinicForm : intialClinicForm,
                patientForm : intialPatientForm,
                appointmentForm : intialApppointmentForm
            })
        }),
        applyMiddleware(thunk , logger) 
    );
    return store
}