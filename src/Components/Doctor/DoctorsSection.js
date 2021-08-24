/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import {
    Breadcrumb, Col, Container,
    Row, Button, OverlayTrigger, Popover
} from 'react-bootstrap';
import { Link, useRouteMatch, withRouter } from 'react-router-dom';
import Loading from '../Loading';
import { connect } from 'react-redux';
import ErrorAlert from '../../helpers/ErrorAlert'
import { deleteDoctor, searchDoctor } from '../../redux/Actions/DoctorActions';
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import { Columns } from '../../helpers/DoctorsTableColumns'
import { pageButtonRenderer } from '../../helpers/pageButtonRenderer'
import HideForType from '../../helpers/HideForType';
import EditPeronalInfoDoctor from '../../modals/EditPeronalInfoDoctor';

function DoctorsSection(props) {
    let { path, url } = useRouteMatch()
    let [showModal, setShowModal] = useState(false)
    let [selectedDoctor, setSelectedDoctor] = useState()

    const nextPath = (path) => {
        props.history.push(path)
    }
    const [showReset, setShowReset] = useState(false)
    const afterSearch = (newVal) => {
        if (newVal.length === props.doctors.doctors.length)
            setShowReset(false)
        else {
            setShowReset(true)
        }
    }
    const actionsFormatter = (cell, row) => {
        return (
            <OverlayTrigger
                trigger="click"
                placement="top"
                key={row.id}
                overlay={
                    <Popover >
                        <Popover.Content>
                            <div>
                                <Button variant="link" onClick={() => nextPath(`${path}/${row.doctor.id}`)}>
                                    View
                                </Button>
                            </div>
                        </Popover.Content>
                    </Popover>
                }>
                <span className="fas fa-ellipsis-v"></span>
            </OverlayTrigger>
        )
    };
    const columns = Columns(actionsFormatter)
    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total ml-2">
            Showing {from} to {to} of {size} Results
        </span>
    );
    const options = {
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        disablePageTitle: true,
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '25', value: 25
        }, {
            text: '50', value: 50
        }, {
            text: '100', value: 100
        }, {
            text: 'All', value: props.doctors.doctors.length
        }],
        pageButtonRenderer,
    }
    const { SearchBar, ClearSearchButton } = Search;
    const { ExportCSVButton } = CSVExport;

    if (props.doctors.isLoading) {
        return <Loading />
    }
    else if (props.doctors.errMess) {
        return (<ErrorAlert messege={props.doctors.errMess} />)
    }
    else {

        return (
            <div className="mt-2">
                <EditPeronalInfoDoctor showModal={showModal} setShowModal={setShowModal} doctor={selectedDoctor} />
                <Breadcrumb >
                    <Breadcrumb.Item className="pl-3" href="#">
                        <Link to="/dashboard">
                            Home
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="mr-auto" active href="#">
                        Doctors
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Container fluid >
                    <div className="pageContainer">
                        <Row className="mb-4">
                            <Col xs={12} className="mt-3 text-center">
                                <h4>Doctors</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <ToolkitProvider
                                    bootstrap4
                                    keyField='id'
                                    data={props.doctors.doctors}
                                    columns={columns}
                                    search={{ afterSearch }}
                                >
                                    {props => (
                                        <div>
                                            <Row className="mb-3">
                                                <Col xs={12} sm>
                                                    <Container flow>
                                                        <Row>
                                                            <Col xs={12} sm>
                                                                <SearchBar {...props.searchProps}
                                                                    className="searchBox"
                                                                    placeholder="&#xf002;  Enter Doctor Name"

                                                                />
                                                            </Col>
                                                            {showReset ? <Col xs="auto" style={{
                                                                "position": "absolute",
                                                                "right": "0",
                                                                "margin-right": "25px"
                                                            }}
                                                            >
                                                                <ClearSearchButton {...props.searchProps} />
                                                            </Col>
                                                                : <div></div>}
                                                        </Row>
                                                    </Container>
                                                </Col>
                                                <Col xs="auto" className="customBtnGroup" >
                                                    <HideForType type={["Nurse"]}>
                                                        <Button className="btn1  mr-2" variant="outline-secondary" onClick={() => nextPath(`${path}/add`)}>
                                                            <span className="fas fa-user-plus"></span>
                                                            Add
                                                        </Button>
                                                    </HideForType>
                                                    <ExportCSVButton {...props.csvProps} className="btn2 text-white">
                                                        Export CSV
                                                    </ExportCSVButton>

                                                </Col>
                                            </Row>
                                            <BootstrapTable {...props.baseProps}
                                                hover bordered={false}
                                                wrapperClasses="table-responsive"
                                                noDataIndication="Table is Empty"
                                                pagination={paginationFactory(options)}
                                            />
                                        </div>
                                    )}
                                </ToolkitProvider>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteDoctor: (id) => dispatch(deleteDoctor(id)),
    searchDoctor: (email, firstName) => dispatch(searchDoctor(email, firstName))
})
const mapStateToProps = (state) => ({
    doctors: state.doctors
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorsSection));