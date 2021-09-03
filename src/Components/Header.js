import React, { Component } from 'react';
import { Navbar, OverlayTrigger, Popover, Nav, Image, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import HideForType from '../helpers/HideForType';
import { logUserOut } from '../redux/Actions/userActions';
import Loading from './Loading';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPopover: false
        }
    }
    render() {
        const url = this.props.match.url
        const nextPath = (path) => {
            this.props.history.push(path)
        }
        if (this.props.patients.isLoading || !this.props.userDate.loggedIn) {
            return <Loading />
        }
        const loadPhoto = (user) => {
            if (user.user.type === "Doctor") {
                if (user.photo === undefined || user.photo === null) {
                    return 'assets/images/doctor.svg'
                }
                else {
                    return user.photo.url
                }
            }
            else if (user.user.type === "Patient" && user.gender === "Male") {
                if (user.photo === undefined || user.photo === null) {
                    return 'assets/images/maleavatar.svg'
                }
                else {
                    return user.photo.url
                }
            }
            else if (user.user.type === "Patient" && user.gender === "Female") {
                if (user.photo === undefined || user.photo === null) {
                    return 'assets/images/femaleavatar.svg'
                }
                else {
                    return user.photo.url
                }
            }
            else if (user.user.type === "Nurse") {
                return 'assets/images/nurse.svg'
            }
            else if (user.user.type === "Admin") {
                return 'assets/images/admin.svg'
            }
        }
        return (
            <Navbar collapseOnSelect expand="md" bg="light" variant="light">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Nav className="ml-auto">
                    <HideForType type={["Nurse"]}>
                        <Nav className="d-none d-md-block">
                            <Nav.Link to="/dashboard/logs" as={NavLink}>
                                <span className="fa fa-history fa-lg" ></span>
                            </Nav.Link>
                        </Nav>
                    </HideForType>
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        show={this.state.showPopover}
                        rootClose
                        onToggle={() => this.state.showPopover ? this.setState({ showPopover: false }) : this.setState({ showPopover: true })}
                        overlay={
                            <Popover  >
                                <Popover.Title as="h3" className="text-center">{this.props.user.user?.username}</Popover.Title>
                                <Popover.Content className="text-center">
                                    <Button variant="link" onClick={() => {
                                        this.setState({ showPopover: false })
                                        nextPath(`${url}/${'settings'}`)
                                    }}>Settings</Button>
                                    <br />
                                    <Button variant="link" onClick={(event) => {
                                        event.preventDefault()
                                        this.props.logUserOut()
                                        this.props.history.push('/dashboard')
                                    }}>Logout</Button>
                                </Popover.Content>
                            </Popover>
                        }>
                        <Image src={loadPhoto(this.props.user)}
                            alt="adminPhoto" className="adminPhoto" width="30" height="32" roundedCircle />
                    </OverlayTrigger>

                </Nav>

                <Navbar.Collapse id="responsive-navbar-nav" >
                    <Nav>
                        <Nav.Link eventKey="1" as="span" className="mt-1">
                            <Link to={`${url}`} className="planeLink" >
                                Dashboard
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="2" as="span" className="mt-1">
                            <Link to={`${url}/doctors`} className="planeLink" >
                                Doctors
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="3" as="span" className="mt-1">
                            <Link to={`${url}/patients`} className="planeLink" >
                                Patients
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="4" as="span" className="mt-1">
                            <Link to={`${url}/clinics`} className="planeLink" >
                                Clinics
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="5" as="span" className="mt-1">
                            <Link to={`${url}/appointments`} className="planeLink" >
                                Apppointments
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="6" as="span" className="mt-1">
                            <Link to={`${url}/calender`} className="planeLink" >
                                Calender
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="7" as="span" className="mt-1">
                            <Link to={`${url}/reviews`} className="planeLink" >
                                Reviews
                            </Link>
                        </Nav.Link>
                        <HideForType type={["Nurse"]}>
                            <Nav.Link eventKey="8" as="span" className="mt-1">
                                <Link to={`${url}/Logs`} className="planeLink" >
                                    Logs
                                </Link>
                            </Nav.Link>
                        </HideForType>
                        <Nav.Link eventKey="9" as="span" className="mt-1">
                            <Link to={`${url}/settings`} className="planeLink" >
                                Settings
                            </Link>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>


            </Navbar>
        );
    }
}

const mapStateToProps = (state) => ({
    patients: state.patients,
    userDate: state.user
})
const mapDispatchToProps = (dispatch) => ({
    logUserOut: () => dispatch(logUserOut())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));