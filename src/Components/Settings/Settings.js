import React, { useEffect } from 'react';
import { Breadcrumb, Col, Container, Row, Image, Form, Button } from 'react-bootstrap';
import { Link, Route, withRouter, Switch, NavLink } from 'react-router-dom';
import AddWorkingDays from './AddWorkingDays';
import EditProfile from './EditProfile';
import WorkingDays from './WorkingDays';
import Loading from '../Loading';
import { connect } from 'react-redux';
import { fetchCenterDays } from '../../redux/Actions/CenterActions';
import NurseComponent from './NurseComponent';
import AdminComponent from './AdminComponent';
import HideForType from '../../helpers/HideForType';

function Settings(props) {
    const nextPath = (path) => {
        props.history.push(path)
    }
    useEffect(() => {
        props.fetchCenterDays()
    }, [])
    if (props.center.isLoading) {
        return <Loading />
    }
    return (
        <div className="mt-2">
            <Breadcrumb>
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to="/dashboard">
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active href="#">
                    Settings
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="ps-1 pe-1">
                <Container fluid className="bg-white mt-2 pb-4 pb-md-0" style={{
                    height: 'auto',
                    minHeight : '100vh'
                }}>
                    <Row style={{ height: '-webkit-fill-available' }}>
                        <Col className="col-2 col-md-3 p-0" style={{
                            borderRight: '1px solid #b8bdc2', height: 'auto' ,minHeight : '100vh'
                        }}>
                            <div class="list-group list-group-flush">
                                <NavLink to={props.match.path} exact className="list-group-item list-group-item-action  text-md-left text-center" activeClassName="active">
                                    <span className="fa fa-pencil-alt me-md-4 me-0"></span> <span className="d-md-inline d-none">Edit Profile</span>
                                </NavLink>
                                <NavLink to={`${props.match.path}/workingDays`} exact className="list-group-item list-group-item-action text-md-left text-center" activeClassName="active">
                                    <span className="fa fa-briefcase me-md-4 me-0"></span> <span className="d-md-inline d-none">Working days</span>
                                </NavLink>
                               <HideForType type={["Nurse"]}>
                               <NavLink to={`${props.match.path}/addWorkingDays`} exact className="list-group-item list-group-item-action text-md-left text-center" activeClassName="active">
                                    <span className="fa fa-plus me-md-4 me-0"></span> <span className="d-md-inline d-none">Add Working days</span>
                                </NavLink>
                                <NavLink to={`${props.match.path}/nurses`} exact className="list-group-item list-group-item-action text-md-left text-center" activeClassName="active">
                                    <span className="fa fa-user-nurse me-md-4 me-0"></span> <span className="d-md-inline d-none">Nurses</span>
                                </NavLink>
                                <NavLink to={`${props.match.path}/admins`} exact className="list-group-item list-group-item-action text-md-left text-center" activeClassName="active">
                                    <span className="fa fa-users-cog me-md-4 me-0"></span> <span className="d-md-inline d-none">Admins</span>
                                </NavLink>
                               </HideForType>
                            </div>
                        </Col>
                        <Col className="col-10 col-md-9">
                            <Switch>
                                <Route exact path={`${props.match.path}`} component={() => <EditProfile />} />
                                <Route exact path={`${props.match.path}/addWorkingDays`} component={() => <AddWorkingDays />} />
                                <Route exact path={`${props.match.path}/workingDays`} component={() => <WorkingDays />} />
                                <Route exact path={`${props.match.path}/nurses`} component={() => <NurseComponent />} />
                                <Route exact path={`${props.match.path}/admins`} component={() => <AdminComponent />} />
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>
    );
}

const mapStateToProps = (state) => ({
    center: state.center
})

const mapDispatchToProps = (dispatch) => ({
    fetchCenterDays: () => dispatch(fetchCenterDays())
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));