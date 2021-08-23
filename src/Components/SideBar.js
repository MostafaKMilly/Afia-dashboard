import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useRouteMatch } from 'react-router-dom';

const Sidebar = (props) => {
  let { path, url } = useRouteMatch()
  return (
    <div
      style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}
    >
      <div style={{ "flex": "0 0 auto" }} className="d-none d-md-block">
        <CDBSidebar textColor="#fff" backgroundColor="#ff2e63f2" >

          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <NavLink
              to={`${url}`}
              style={{ color: 'inherit' }}
              className="text-decoration-none"
            >
              AfiaClinic
            </NavLink>
          </CDBSidebarHeader>

          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <NavLink exact to={`${url}`} style={{ color: 'inherit' }} className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to={`${url}/doctors`} style={{ color: 'inherit' }}
                className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="user-nurse">
                  Doctors
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to={`${url}/patients`} style={{ color: 'inherit' }}
                className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="user-injured">
                  Patients
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to={`${url}/clinics`} style={{ color: 'inherit' }}
                className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="clinic-medical" >
                  Clinics
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to={`${url}/appointments`} style={{ color: 'inherit' }}
                className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="calendar-check">
                  Appointments
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to={`${url}/calender`} style={{ color: 'inherit' }}
                className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="calendar-day">
                  Calender
                </CDBSidebarMenuItem>
              </NavLink>
              
            </CDBSidebarMenu>

          </CDBSidebarContent>

          <CDBSidebarFooter>
            {/* <div
              className="sidebar-btn-wrapper"
              style={{
                padding: '20px 5px',
              }}
            >
              
              <img src="/assets/images/logo.png" className="mr-auto d-inline-block align-top" width="40" height="40" alt="logo"></img>
            </div> */}
            <CDBSidebarMenu>
              <NavLink to={`${url}/settings`} style={{ color: 'inherit' }}
                className="text-decoration-none" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="cog">
                  Settings
                </CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarFooter>
        </CDBSidebar>
      </div>
    </div>
  );
};
export default Sidebar;
