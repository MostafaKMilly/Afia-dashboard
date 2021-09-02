import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router';
import { fetchClinics } from '../redux/Actions/ClinicActions';
import { fetchDoctors } from '../redux/Actions/DoctorActions';
import ClinicDetail from './Clinic/ClinicDetail';
import ClinicsSection from './Clinic/ClinicsSection';
import DoctorDetail from './Doctor/DoctorDetail';
import DoctorsSection from './Doctor/DoctorsSection';
import Header from './Header';
import Home from './Home';
import Sidebar from './SideBar';
import DoctorForm from './Doctor/DoctorForm';
import ClinicForm from './Clinic/ClinicForm';
import PatientForm from './Patient/PatientForm';
import PatientsSection from './Patient/PatientsSection';
import { fetchPatients } from '../redux/Actions/PatientAction';
import Appointments from './Appointment/Appointments';
import { autoLogin } from '../redux/Actions/userActions';
import Calender from './calender';
import PatientDetail from './Patient/PatientDetail';
import Settings from './Settings/Settings';
import Loading from './Loading';
import { fetchCenterDays } from '../redux/Actions/CenterActions';
import AppointmentForm from './Appointment/AppointmentForm';
import Logs from './Logs';
import AppointmentsToolKit from './Appointment/AppointmentsToolKit';
import Reviews from './Reviews';

class Dashboard extends Component {
    componentDidMount() {
        this.props.autoLogin()
        this.props.fetchDoctors()
        this.props.fetchClinics()
        this.props.fetchPatients()
        this.props.fetchCenterDays()
    }
    render() {
        const doctorWithId = ({ match }) => {
            if (parseInt(match.params.doctorId)) {
                const doctor = this.props.doctors.doctors.filter((doctor) => {
                    return parseInt(doctor.doctor.id) === parseInt(match.params.doctorId, 10)
                })[0]
                return (
                    <DoctorDetail doctor={doctor}
                    />
                )
            }
            else {
                return <div></div>
            }
        }
        const clinicWithId = ({ match }) => {
            if (parseInt(match.params.clinicId))
                return (
                    <ClinicDetail clinic={this.props.clinics.clinics.filter((clinic) =>
                        clinic.clinic.id === parseInt(match.params.clinicId, 10))[0]} />
                )
            else {
                return <div></div>
            }
        }
        const patientWithId = ({ match }) => {
            if (parseInt(match.params.patientId))
                return (
                    <PatientDetail patient={this.props.patients.patients.filter((patient) =>
                        patient.patient.id === parseInt(match.params.patientId, 10))[0]} />
                )
            else {
                return <div></div>
            }
        }
        if (this.props.clinics.isLoading) {
            return <Loading />
        }
        return (
            <Switch>
                <>
                    <div className="d-flex" style={{ "height": "100vh" }}>
                        <Sidebar />
                        <div className="dash-container">
                            <Header user={this.props.user.userData} />
                            <Route exact path={`${this.props.match.path}/doctors`} component={() => <DoctorsSection />} />
                            <Route exact path={`${this.props.match.path}/clinics`} component={() => <ClinicsSection />} />
                            <Route exact path={`${this.props.match.path}/patients`} component={() => <PatientsSection />} />
                            <Route exact path={`${this.props.match.path}/`} component={Home} />
                            <Route exact path={`${this.props.match.path}/doctors/add`} component={() => <DoctorForm clinics={this.props.clinics} />} />
                            <Route exact path={`${this.props.match.path}/clinics/add`} component={() => <ClinicForm />} />
                            <Route exact path={`${this.props.match.path}/patients/add`} component={() => <PatientForm />} />
                            <Route exact path={`${this.props.match.path}/doctors/:doctorId`} component={doctorWithId} />
                            <Route exact path={`${this.props.match.path}/clinics/:clinicId`} component={clinicWithId} />
                            <Route exact path={`${this.props.match.path}/patients/:patientId`} component={patientWithId} />
                            <Route exact path={`${this.props.match.path}/appointments`} component={() => <Appointments />} />
                            <Route path={`${this.props.match.path}/addAppointments`} component={() => <AppointmentForm />} />
                            <Route exact path={`${this.props.match.path}/calender`} component={() => <Calender />} />
                            <Route path={`${this.props.match.path}/settings`} component={() => <Settings />} />
                            <Route path={`${this.props.match.path}/logs`} component={() => <Logs />} />
                            <Route path={`${this.props.match.path}/reviews`} component={() => <Reviews />} />
                            <Route path={`${this.props.match.path}/appointments/rejected`} component={() => <AppointmentsToolKit type="Rejected" />} />
                            <Route path={`${this.props.match.path}/appointments/done`} component={() => <AppointmentsToolKit type="Done" />} />
                            <Route path={`${this.props.match.path}/appointments/gone`} component={() => <AppointmentsToolKit type="Gone" />} />
                            <Route path={`${this.props.match.path}/appointments/cancelled`} component={() => <AppointmentsToolKit type="Cancelled" />} />
                            <Route path={`${this.props.match.path}/appointments/accepted`} component={() => <AppointmentsToolKit type="Accepted" />} />
                        </div>
                    </div>
                </>
            </Switch>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchClinics: () => { dispatch(fetchClinics()) },
    fetchDoctors: () => { dispatch(fetchDoctors()) },
    autoLogin: () => dispatch(autoLogin()),
    fetchPatients: () => dispatch(fetchPatients()),
    fetchCenterDays: () => dispatch(fetchCenterDays())
})

const mapStateToProps = (state) => ({
    doctors: state.doctors,
    clinics: state.clinics,
    user: state.user,
    patients: state.patients
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
