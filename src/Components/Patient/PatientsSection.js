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
import { deleteDoctor } from '../../redux/Actions/DoctorActions';
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import {Columns} from '../../helpers/PatientsTableColumns'
import {pageButtonRenderer} from '../../helpers/pageButtonRenderer'

function PatientSection(props) {
    let {path , url } = useRouteMatch()
    const nextPath = (path) => {
        props.history.push(path)
    }
    const [showReset, setShowReset] = useState(false)
    const afterSearch = (newVal) => {
        if (newVal.length === props.patients.patients.length)
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
                                <Button variant="link" onClick={() => nextPath(`${path}/${row.patient.id}`)}>
                                    View
                            </Button>
                                <Button variant="link" onClick={() => props.deletePatient(row.patient.id)}>
                                    Delete
                            </Button>
                                <Button variant="link" onClick={() => nextPath(`${path}/${row.patient.id}`)}>
                                    Edit
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
            Showing { from} to { to} of { size} Results
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
            text: 'All', value: props.patients.patients.length
        }],
        pageButtonRenderer,
    }
    const { SearchBar, ClearSearchButton } = Search;
    const { ExportCSVButton } = CSVExport;

    if (props.patients.isLoading) {
        return <Loading />
    }
    else if (props.patients.errMess) {
        return (<ErrorAlert messege={props.patients.errMess} />)
    }
    else {
        return (
            <div className="mt-2">
                <Breadcrumb >
                    <Breadcrumb.Item className="pl-3" href="#">
                        <Link to="/dashboard">
                            Home
                    </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="mr-auto" active href="#">
                        Patients
                </Breadcrumb.Item>
                </Breadcrumb>
                <Container fluid >
                    <div className="pageContainer">
                        <Row className="mb-4">
                            <Col xs={12} className="mt-3 text-center">
                                <h4>Patients</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <ToolkitProvider
                                    bootstrap4
                                    keyField='id'
                                    data={props.patients.patients}
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
                                                                    placeholder="&#xf002;  Enter Patient Name"

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
                                                <Col xs="auto" className="customBtnGroup">
                                                    <Button className="btn1  mr-2" variant="outline-secondary" onClick={() => nextPath(`${path}/add`)}>
                                                        <span className="fas fa-user-plus"></span>
                                                            Add
                                                    </Button>
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
    deleteDoctor: (id) => dispatch(deleteDoctor(id))
})
const mapStateToProps = (state) => ({
    patients: state.patients
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientSection));