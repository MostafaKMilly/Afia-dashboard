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
import { acceptAppointment, clearAccetptedAppointments, clearErrorMessages, getAcceptedAppointmentForClinic, getAllAcceptedAppointmentsForDoctor, updateAcceptAppointment } from '../redux/Actions/AppointmentsActions'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Loading from './Loading'
import { Alert, Breadcrumb, Button } from 'react-bootstrap';
import { baseUrl } from '../shared/baseUrl';
import ErrorAlert from '../helpers/ErrorAlert';
import {fetchCenterDays} from '../redux/Actions/CenterActions'

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
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
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

  const date = new Date(startDate);
  props = { ...props, onDoubleClick: undefined }
  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell   {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell   {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell   {...props} />;
};

const DayScaleCell = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...props} />;
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
  const selectClinic = (event) => {
    let clinicId = event.target[event.target.selectedIndex].id
    if (clinicId == 0) {
      props.clearAccetptedAppointments()
      return
    }
    setSelectedClinic(clinicId)
    getDoctorsForClinic(clinicId).then(doctors => {
      setDoctorsList(doctors)
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
  useEffect(() => {
    getDoctorsForClinic(1).then(doctors => {
      setDoctorsList(doctors)
      setDoctorsIsLoading(false)
    })
    .catch((error) => {
      setDoctorErrMess(error.message)
      setDoctorsIsLoading(false)
    })
    props.fetchCenterDays()
    props.clearErrorMessages()
  }, [])

  if (props.patients.isLoading||props.clinics.isLoading ||doctorsIsLoading||props.center.isLoading) {
    return <Loading />
  }
  if (props.clinics.errMess || doctorErrMess ||  props.center.errMess) {
    return <ErrorAlert messege={props.clinics.errMess || doctorErrMess || props.center.errMess} />
  }
  const getPatientsName = (patientId) => {
    let patient = props.patients.patients.filter((patient) => patient.patient.id === patientId)[0]
    return patient.patient.firstName + ' ' + patient.patient.lastName
  }
  let clinicSelector = props.clinics.clinics.map((clinic) => (
    <option key={clinic.clinic.id} id={clinic.clinic.id}>{clinic.clinic.name}</option>
  ))
  let array = [...props.center.workingDays].sort((a,b) => {
    if (a.openTime < b.openTime) {
        return -1
    }
    if (a.openTime > b.openTime) {
        return 1
    }
    return 0
})  
  let array2 = [...props.center.workingDays].sort((a,b) => {
    if (a.closeTime > b.closeTime) {
        return -1
    }
    if (a.closeTime < b.closeTime) {
        return 1
    }
    return 0
})  
  console.log(array , array2)
  let openTime = parseInt(array[0].openTime.split(':')[0])
  let endTime =  parseInt(array2[0].closeTime.split(':')[0])
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

  const commitChanges = ({ added, changed, deleted }) => {
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
    props.updateAcceptAppointment(object, appointmentId)
  }
  const ErrorAlert = () => {
    if (props.appointments.errMess) {
        return <Alert variant="danger" className="mt-2 mb-1" style={{
         width: "fit-content",
         margin: "0 auto",
         position : "absolute",
         top: "-1%",
        transform: "translate(-50% , 0)"
        ,left: "50%"
        ,zIndex: 1
     }} dismissible onClose={() => props.clearErrorMessages()}>
         <Alert.Heading>Error !</Alert.Heading>
         {props.appointments.errMess}
     </Alert>
    }
    else {
      return <></>
    }
  }
  return (
    <div className="mt-2 mb-3" style={{position:"relative"}}>
      <ErrorAlert/>
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
              startDayHour={9}
              endDayHour={19}
            />
            <ConfirmationDialog />
            <WeekView
              /* excludedDays={[0, 6]} */
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
              contentComponent={Content}
            />
            <AppointmentForm
              basicLayoutComponent={BasicLayout}
              messages={messages}
              textEditorComponent={TextEditor}
              booleanEditorComponent={BooleanEditorComponent}
            />
            <GroupingPanel />
            <DragDropProvider />
          </Scheduler>
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
  center : state.center
})

const mapDispatchToProps = (dispatch) => ({
  getAcceptedAppointmentForClinic: (clinicId) => dispatch(getAcceptedAppointmentForClinic(clinicId)),
  updateAcceptAppointment: (values, appId) => dispatch(updateAcceptAppointment(values, appId)),
  clearAccetptedAppointments: () => dispatch(clearAccetptedAppointments()),
  fetchCenterDays: () => dispatch(fetchCenterDays()),
  clearErrorMessages : () => dispatch(clearErrorMessages())
})

export default withRouter(connect(mapStateTopProps, mapDispatchToProps)(Calender));