import * as ActionTypes from '../Actions/ActionTypes'

export const Center = (state = {
    isLoading: true,
    workingDays: [],
    errMess: null,
    isWorkingDaysAdded: null,
    success : null,
    errorsMessges : []
}, action) => {
    switch (action.type) {
        case ActionTypes.LOADING_CENTER_DAYS:
            return { ...state, isLoading: true, workingDays: [], errMess: null , success:null}
        case ActionTypes.LOAD_CENTER_DAYS:
            return { ...state, workingDays: action.payload, isLoading: false, isWorkingDaysAdded: true, errMess: null }
        case ActionTypes.LOAD_CENTER_DAYS_FAILED:
            return { ...state, workingDays: [], isLoading: false, isWorkingDaysAdded: false, errMess: action.payload }
        case ActionTypes.ADD_WORKING_DAYS:
            let successTemp = state.errorsMessges.length ===0 ? true : false
            return { ...state, isLoading: false, isWorkingDaysAdded: true,success : successTemp, errMess: null }
        case ActionTypes.ADD_WORKING_DAYS_FAILED:
            return { ...state,success : false, errorsMessges: state.errorsMessges.concat(action.payload) }
        case ActionTypes.CLEAR_ERROR_MESSAGES : 
            return {...state , errorsMessges : []}
        case ActionTypes.CLEAR_ERR_MESS : 
            return {...state , errMess : null}
        case ActionTypes.DELETE_WORKING_DAY: 
            let newWorkingDay = state.workingDays.filter((workingDay) => workingDay.day !==action.payload)
            return {...state , workingDays : newWorkingDay}
        case ActionTypes.UPDATE_WORKING_DAY :
            let index =state.workingDays.findIndex((workingDay) => workingDay.day === action.payload.day)
            let newWorkingDayArr = [...state.workingDays]
            newWorkingDayArr[index] = {...newWorkingDayArr[index] , ...action.payload}
            return {...state , workingDays : newWorkingDayArr}
        default:
            return state
    }

};
