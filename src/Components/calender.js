import React, { useEffect, useState } from 'react';
import { fade, makeStyles, Paper } from '@material-ui/core'
import { ViewState, EditingState, GroupingState, IntegratedEditing, IntegratedGrouping } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Resources,
  Appointments,
  DayView,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
  DragDropProvider,
  GroupingPanel
} from '@devexpress/dx-react-scheduler-material-ui';
import { acceptAppointment, clearAccetptedAppointments, clearErrorMessages, getAcceptedAppointmentForClinic, getAllAcceptedAppointmentsForDoctor, updateAcceptAppointment, updateAppointmentToGoneStatus } from '../redux/Actions/AppointmentsActions'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Loading from './Loading'
import { Alert, Breadcrumb, Button } from 'react-bootstrap';
import { baseUrl } from '../shared/baseUrl';
import ErrorAlert from '../helpers/ErrorAlert';
import { fetchCenterDays } from '../redux/Actions/CenterActions'
import { actions } from 'react-redux-form';
import jwt from 'jsonwebtoken'

const useStyles = makeStyles(theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.secondary.light, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.light, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.secondary.light, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.07),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.07),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.07),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.secondary.light, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
}));


const TimeTableCell = (props) => {
  const classes = useStyles();
  const { startDate } = props;
  const [validDates , setValidDate] = useState([])
  useEffect(() => {
      if (props.groupingInfo) {
        fetch(baseUrl + 'api/doctors/working_days/id/' + props.groupingInfo[0].id, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              'Accept': "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
      })
          .then(response => {
              if (response.ok) {
                  return response
              }
              else {
                  let error = new Error(response.statusText)
                  error.response = response
                  throw error
              }
          }, err => {
              let error = new Error(err.message)
              throw error;
          })
          .then(response => response.json())
          .then((workingDays) => {
            let dates = workingDays.map((workingDays) => workingDays.date)
            setValidDate(dates)
          })
          .catch((error) => setValidDate([]))
      }
  } ,[])
  const date = new Date(startDate);
  props = { ...props, onDoubleClick: undefined }
  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell   {...props} className={classes.todayCell} />;
  } if (!validDates.includes(date.toISOString().split('T')[0])) {
    return <WeekView.TimeTableCell   {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell   {...props} />;
};

const DayScaleCell = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;
  
  /* if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  }  */return <WeekView.DayScaleCell {...props} />;
};



const Content = (({
  children, appointmentData, classes, ...restProps
}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    {/* <Button className="btn-sm">Add session detail</Button> */}
  </AppointmentTooltip.Content>
));

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'titleTextEditor') {
    props = { ...props, readOnly: true }
    return <AppointmentForm.TextEditor {...props} />;
  }
  if (props.type === 'multilineTextEditor') {
    return null
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BooleanEditorComponent = (props) => {
  if (props.label === "All Day" || props.label === "Repeat") {
    return null
  }
  return <AppointmentForm.BooleanEditor {...props} />
}

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onDescriptionFieldChange = (nextValue) => {
    onFieldChange({ description: nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <AppointmentForm.Label
        text="Description"
        type="title"
      />
      <AppointmentForm.TextEditor
        value={appointmentData.description}
        onValueChange={onDescriptionFieldChange}
        placeholder="Description field"
        multiline
        readOnly
      />
    </AppointmentForm.BasicLayout>
  );
};

function Calender(props) {
  const messages = {
    commitCommand: 'ُEdit',
    detailsLabel: 'Patient name',
    moreInformationLabel: '',
  }
  const [selectedClinic, setSelectedClinic] = useState()
  let [doctorsList, setDoctorsList] = useState([])
  const [doctorsIsLoading, setDoctorsIsLoading] = useState(true)
  const [doctorErrMess, setDoctorErrMess] = useState()

  const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const selectClinic = (event) => {
    let clinicId = event.target[event.target.selectedIndex].id
    if (clinicId == 0) {
      props.clearAccetptedAppointments()
      setSelectedClinic(undefined)
      return
    }
    setSelectedClinic(clinicId)
    getDoctorsForClinic(clinicId).then(doctors => {
      setDoctorErrMess(undefined)
      setDoctorsList(doctors)
    })
      .catch((error) => {
        setDoctorErrMess(error.message)
      })
    props.getAcceptedAppointmentForClinic(clinicId)
  }
  const getDoctorsForClinic = (clinicId) => {
    return fetch(baseUrl + 'api/doctors/clinic/' + clinicId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response
        }
        else {
          let error = new Error("Error " + response.status + ":" + response.statusText)
          error.response = response
          throw error
        }
      }, err => {
        let error = new Error(err.message)
        throw error;
      })
      .then(response => response.json())

  }

const getWorkingDay = (doctorId) => {
  return fetch(baseUrl + 'api/doctors/working_days/id/' + doctorId, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          'Accept': "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
  })
      .then(response => {
          if (response.ok) {
              return response
          }
          else {
              let error = new Error(response.statusText)
              error.response = response
              throw error
          }
      }, err => {
          let error = new Error(err.message)
          throw error;
      })
      .then(response => response.json())
}
  useEffect(() => {
    getDoctorsForClinic(props.clinics.clinics[0]?.clinic?.id).then(doctors => {
      setDoctorsList(doctors)
      setDoctorsIsLoading(false)
    })
      .catch((error) => {
        setDoctorErrMess(error.message)
        setDoctorsIsLoading(false)
      })
    props.fetchCenterDays()
    props.clearErrorMessages()
    props.getAcceptedAppointmentForClinic(props.clinics.clinics[0]?.clinic?.id)
  }, [])

  if (props.patients.isLoading || props.clinics.isLoading || doctorsIsLoading || props.center.isLoading) {
    return <Loading />
  }

  const getPatientsName = (patientId) => {
    let patient = props.patients.patients.filter((patient) => patient.patient.id === patientId)[0]
    return patient.patient.firstName + ' ' + patient.patient.lastName
  }
  let clinicSelector = props.clinics.clinics.map((clinic) => (
    <option key={clinic.clinic.id} id={clinic.clinic.id}>{clinic.clinic.name}</option>
  ))

  const weekHolidays = []
  const workingDays = props.center.workingDays.map((workingDays) => workingDays.day)
  daysInWeek.forEach((day) => {
    if (!workingDays.includes(day)) {
      weekHolidays.push(daysInWeek.indexOf(day))
    }
  })

  let array = [...props.center.workingDays].sort((a, b) => {
    if (a.openTime < b.openTime) {
      return -1
    }
    if (a.openTime > b.openTime) {
      return 1
    }
    return 0
  })
  let array2 = [...props.center.workingDays].sort((a, b) => {
    if (a.closeTime > b.closeTime) {
      return -1
    }
    if (a.closeTime < b.closeTime) {
      return 1
    }
    return 0
  })
  let openTime = parseInt(array[0]?.openTime.split(':')[0])
  let endTime = parseInt(array2[0]?.closeTime.split(':')[0])

  const schedulerData = props.appointments.acceptedAppointment.map((appointment) => {
    return ({
      startDate: appointment.date + 'T' + appointment.startTime, endDate: appointment.date + 'T' + appointment.endTime,
      title: getPatientsName(appointment.patientId), id: appointment.id, description: appointment.description,
      doctorId: appointment.doctorId
    })
  })
  const doctorsInstances = doctorsList.map((doctor) => ({
    text: doctor.doctor.firstName + ' ' + doctor.doctor.lastName,
    id: doctor.doctor.id
  }))
  const resources = [{
    fieldName: 'doctorId',
    title: 'Doctor',
    instances: doctorsInstances
  }]
  const grouping = [{
    resourceName: 'doctorId',
  }]

  const getValidDates = (doctorId) => {
    return fetch(baseUrl + 'api/doctors/working_days/id/' + doctorId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
        .then(response => response.json())
}
  const commitChanges = ({ added, changed, deleted }) => {
    props.clearErrorMessages()
    if (changed) {
      let object = {}
      let appointmentId
      let daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      for (let i in changed) {
        appointmentId = i
      }
      if (changed[appointmentId].startDate) {
        let date = new Date(changed[appointmentId].startDate).toISOString()
        object.date = date.split('T')[0]
        let startTime = new Date(changed[appointmentId].startDate).toTimeString().split(' ')[0]
        object.startTime = startTime
        object.day = daysInWeek[new Date(object.date).getDay()]
      }
      if (changed[appointmentId].endDate) {
        let date = new Date(changed[appointmentId].endDate).toISOString()
        let endTime = new Date(changed[appointmentId].endDate).toTimeString().split(' ')[0]
        object.endTime = endTime
      }
      if (changed[appointmentId].doctorId) {
        object.doctorId = changed[appointmentId].doctorId
      }

      let index = props.appointments.acceptedAppointment.findIndex((appointment) => appointment.id === parseInt(appointmentId))
      let appointment = {...props.appointments.acceptedAppointment[index]}
      if (object.startTime) {
        appointment = {...appointment , startTime : object.startTime}
      }
      if (object.endTime) {
        appointment = {...appointment , endTime : object.endTime}
      }
      if (object.doctorId) {
        appointment = {...appointment , doctorId : object.doctorId}
      }
      getWorkingDay(appointment.doctorId).then((workingDays) => {
          let valid = false
          console.log(workingDays , appointment)
          workingDays.forEach((workingDay) => {
            if(workingDay.day === object.day && object.date === workingDay.date && appointment.startTime >= workingDay.startTime && appointment.endTime <= workingDay.endTime) {
              valid = true
              return
            }
          })

          if (!valid) {
            let error = new Error("time is invalid please check doctor working times")
            throw error
          }
          props.updateAcceptAppointment(object, appointmentId)
      })
      .catch((error) => {
        props.setErrorMessages(error.message)
      })
    }
    if (deleted) {
      let object = { status: "Gone" }

      props.updateAppointmentToGoneStatus(object, deleted)
    }
  }
  const ErrorAlertComponents = () => {
    if (props.appointments.errMess) {
      return <Alert variant="danger" className="mt-2 mb-1" style={{
        width: "fit-content",
        margin: "0 auto",
        position: "absolute",
        top: "-1%",
        transform: "translate(-50% , 0)"
        , left: "50%"
        , zIndex: 1
      }} dismissible onClose={() => props.clearErrorMessages()}>
        <Alert.Heading>Error !</Alert.Heading>
        {props.appointments.errMess}
      </Alert>
    }
    else {
      return <></>
    }
  }

  let token = jwt.verify(localStorage.getItem("token"), 'clinic')
  let allowUpdate = token.type === "Nurse" ? true : false

  return (
    <div className="mt-2 mb-3" style={{ position: "relative" }}>
      <ErrorAlertComponents />
      <Breadcrumb >
        <Breadcrumb.Item className="pl-3 mt-1" href="#">
          <Link to={`/dashboard`}>
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="mr-auto mt-1" active href="#">
          Calender
        </Breadcrumb.Item>
        <div style={{ display: 'contents' }} className="mt-3 mt-md-0 SelectionDiv me-auto ms-auto me-md-0 ms-md-0">
          <select type="select" className="form-select w-auto" onChange={selectClinic} style={{ marginRight: '8px', height: '42px' }}>
            {clinicSelector}
          </select>
        </div>
      </Breadcrumb>
      <div className="p-3">
        <Paper>
          {props.clinics.errMess || doctorErrMess || props.center.errMess ?
          <ErrorAlert messege={props.clinics.errMess || doctorErrMess || props.center.errMess} color="white" />
          : 
          <Scheduler
          data={schedulerData}
          height={660}
        >
          <ViewState
            defaultCurrentViewName="Week"
          />
          <EditingState
            onCommitChanges={commitChanges}
          />
          <IntegratedEditing />
          <GroupingState
            grouping={grouping}
          /* groupOrientation={() => "Vertical"} */
          />
          <DayView
            startDayHour={openTime}
            endDayHour={endTime}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
            cellDuration={15}
          />
          <ConfirmationDialog />
          <WeekView
            excludedDays={weekHolidays}
            startDayHour={openTime}
            endDayHour={endTime}
            timeTableCellComponent={TimeTableCell}
            dayScaleCellComponent={DayScaleCell}
            
          />
          <Toolbar />
          <ViewSwitcher />
          <DateNavigator />
          <TodayButton />
          <Appointments
          />
          <Resources
            data={resources}
            mainResourceName="doctorId"
          />

          <IntegratedGrouping />


          <AppointmentTooltip
            showCloseButton
            showOpenButton
            showDeleteButton = {token.type === "Admin" ? false : true}
            contentComponent={Content}
          />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            messages={messages}
            textEditorComponent={TextEditor}
            booleanEditorComponent={BooleanEditorComponent}
            readOnly={token.type === "Admin" ? true : false}
          />
          <GroupingPanel />
          <DragDropProvider 
          allowDrag={() => allowUpdate}
          allowResize={() => allowUpdate}
          />
        </Scheduler>  
          }
        </Paper>
      </div>
    </div>
  );
}

const mapStateTopProps = (state) => ({
  appointments: state.appointments,
  doctors: state.doctors,
  patients: state.patients,
  clinics: state.clinics,
  center: state.center
})

const mapDispatchToProps = (dispatch) => ({
  getAcceptedAppointmentForClinic: (clinicId) => dispatch(getAcceptedAppointmentForClinic(clinicId)),
  updateAcceptAppointment: (values, appId) => dispatch(updateAcceptAppointment(values, appId)),
  updateAppointmentToGoneStatus: (values, appId) => dispatch(updateAppointmentToGoneStatus(values, appId)),
  clearAccetptedAppointments: () => dispatch(clearAccetptedAppointments()),
  fetchCenterDays: () => dispatch(fetchCenterDays()),
  clearErrorMessages: () => dispatch(clearErrorMessages(null)),
  setErrorMessages : (error) => dispatch(clearErrorMessages(error))
})

export default withRouter(connect(mapStateTopProps, mapDispatchToProps)(Calender));