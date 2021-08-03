import React, { useEffect } from 'react';
import {fade, makeStyles, Paper} from '@material-ui/core'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import {getAllAcceptedAppointmentsForDoctor} from '../redux/Actions/AppointmentsActions'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Loading from './Loading'
import { Breadcrumb, Button } from 'react-bootstrap';

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

  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...props} />;
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

const Appointment = ({
  children, style, ...restProps
}) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      backgroundColor: '#2e3c98ed',
      borderRadius: '8px',
    }}
  >
    {children}
  </Appointments.Appointment>
);

function Calender(props) {
  const selectDoctor = (event) => {
    let doctorId = event.target[event.target.selectedIndex].id
    if (doctorId == 0) {
      return
  }
    props.getAllAcceptedAppointmentsForDoctor(doctorId)
  }
  
  if (props.doctors.isLoading ||props.patients.isLoading) {
    return <Loading/>
  }
  const getPatientsName = (patientId) => {
    let patient = props.patients.patients.filter((patient) => patient.patient.id === patientId)[0]
    return patient.patient.firstName + ' ' + patient.patient.lastName
  }
  let doctorSelectors = props.doctors.doctors.map((doctor) => (
      <option key={doctor.doctor.id} id={doctor.doctor.id}>{doctor.doctor.firstName + ' ' + doctor.doctor.lastName}</option>
  ))
  doctorSelectors.unshift(<option key="0" id="0">Select Doctor</option>)
  const currentDate = '2020-07-18';
    const schedulerData = props.appointments.acceptedAppointment.map((appointment) => {
      return ({
         startDate: appointment.date +'T'+appointment.startTime ,endDate: appointment.date +'T'+appointment.endTime,
          title: getPatientsName(appointment.patientId)
      })
    })
    return (
      <div className="mt-2 mb-3">
      <Breadcrumb >
          <Breadcrumb.Item className="pl-3 mt-1" href="#">
              <Link to={`/dashboard`}>
                  Home
              </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="mr-auto mt-1" active href="#">
              Calender
          </Breadcrumb.Item>
          <div style={{ display: '-webkit-inline-box' }} className="mt-3 mt-md-0 SelectionDiv me-auto ms-auto me-md-0 ms-md-0">
              <select type="select" className="form-select w-auto" onChange={selectDoctor} style={{ marginRight: '8px', height: '42px' }}>
                  {doctorSelectors}
              </select>
          </div>
      </Breadcrumb>
      <div className="p-3">
        <Paper>
    <Scheduler
      data={schedulerData}
      height={660}
    >
      <ViewState/>
      <WeekView
        excludedDays={[0, 6]}
        startDayHour={9}
        endDayHour={19}
        timeTableCellComponent={TimeTableCell}
        dayScaleCellComponent={DayScaleCell}
      />
      <Appointments
      appointmentComponent={Appointment}
      />
    </Scheduler>
  </Paper>
  </div>
  </div>
    );
}

const mapStateTopProps = (state) => ({
  appointments : state.appointments ,
  doctors : state.doctors,
  patients : state.patients
})

const mapDispatchToProps = (dispatch) => ({
  getAllAcceptedAppointmentsForDoctor : (doctorId) => dispatch(getAllAcceptedAppointmentsForDoctor(doctorId))
})

export default withRouter(connect(mapStateTopProps , mapDispatchToProps)(Calender));