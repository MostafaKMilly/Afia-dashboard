import React, { Component } from 'react';
import { Navbar, OverlayTrigger, Popover, Nav, Image, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { logUserOut } from '../redux/Actions/userActions';
import { baseUrl } from '../shared/baseUrl';
import Loading from './Loading';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPopover : false
        }
    }
    render() {
        const url = this.props.match.url
        
        const nextPath = (path) => {
            this.props.history.push(path)
        }
        if (this.props.patients.isLoading) {
            return <Loading />
        }
        const loadPhoto = (user) => {
            if (user.user.type ==="Admin" || user.user.type ==="Doctor") {
                if (user.photo ===undefined || user.photo===null) {
                    return 'assets/images/doctor.svg'
                }
                else {
                    return  user.photo.url
                }
            }
            else if (user.user.type ==="Patient" && user.gender ==="male") {
                if (user.photo ===undefined || user.photo===null) {
                    return 'assets/images/maleavatar.svg'
                }
                else {
                    return  user.photo.url
                }
            }
            else if (user.user.type ==="Patient" && user.gender ==="female") {
                if (user.photo ===undefined || user.photo===null) {
                    return 'assets/images/femaleavatar.svg'
                }
                else {
                    return  user.photo.url
                }
            }
            else {
                if (user.photo ===undefined || user.photo===null) {
                    return 'assets/images/nurse.svg'
                }
                else {
                    return  user.photo.url
                }
            }
        }
        return (
            <Navbar collapseOnSelect expand="md" bg="light" variant="light">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Nav className="ml-auto">
                    <Nav className="d-none d-md-block">
                        <Nav.Link href="#" className="" as="span">
                            <span className="fa fa-comments fa-lg" ></span>
                        </Nav.Link>
                    </Nav>
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        show={this.state.showPopover}
                        onToggle={() => this.state.showPopover ? this.setState({showPopover : false}) : this.setState({showPopover : true})  }
                        overlay={
                            <Popover  >
                                <Popover.Title as="h3" className="text-center">{this.props.user.user.username}</Popover.Title>
                                <Popover.Content className="text-center">
                                    <Button variant="link" onClick={() =>{
                                         this.setState({showPopover : false})
                                         nextPath(`${url}/${'settings'}`)
                                    }}>Settings</Button>
                                    <br />
                                    <Button variant="link" onClick={(event) => {
                                        event.preventDefault()
                                        this.props.logUserOut()
                                        window.location.reload()
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
                        <Nav.Link eventKey="1" as="span">
                            <Link to={`${url}`} className="planeLink" >
                                Dashboard
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="2" as="span">
                            <Link to={`${url}/doctors`} className="planeLink" >
                                Doctors
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="3" as="span">
                            <Link to={`${url}/patients`} className="planeLink" >
                                Patients
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="4" as="span">
                            <Link to={`${url}/clinics`} className="planeLink" >
                                Clinics
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="5" as="span">
                            <Link to={`${url}/appointments`} className="planeLink" >
                                Apppointments
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="6" as="span">
                            <Link to={`${url}/calender`} className="planeLink" >
                                Calender
                            </Link>
                        </Nav.Link>
                        <Nav.Link eventKey="7" as="span">
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
    patients: state.patients
})
const mapDispatchToProps = (dispatch) => ({
    logUserOut: () => dispatch(logUserOut())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));