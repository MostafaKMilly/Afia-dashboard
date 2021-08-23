/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Container, Breadcrumb, Button, Row, Col, FormLabel, Alert } from 'react-bootstrap'
import { connect } from 'react-redux';
import { Control, Form, Errors, actions } from 'react-redux-form';
import { Link, withRouter } from 'react-router-dom';
import { closeClinicRegisterDialog, openClinicDialog, postClinic } from '../../redux/Actions/ClinicActions';
import { useHistory } from "react-router-dom";
import ModalClinic from "../../modals/ModalClinic"
import Loading from '../Loading';

function ClinicForm(props) {
    const required = (value) => value && value.length
    const isChar = (val) => {
        for (let i of val) {
            if (i === ' ')
                continue
            if (!isNaN(Number(i))) {
                return false
            }
        }
        return true
    }
    let history = useHistory()
    const handleSubmit = (values) => {
        props.openModelDialog()
    }
    const ErrorAlert = () => {
        if (props.clinics.isClinicAdded === false) {
            return (
                <Alert variant="danger" className="addingAlert" onClose={() => props.closeRegisterDialog()} dismissible>
                    <Alert.Heading>
                        Error
                    </Alert.Heading>
                    <p>
                        {props.clinics.addClinicFailedErrMess}
                    </p>
                </Alert>
            )
        }
        else if (props.clinics.isClinicAdded) {
            return (
                <Alert variant="success" className="addingAlert " onClose={() => props.closeRegisterDialog()} dismissible>
                    <Alert.Heading>
                        Success
                    </Alert.Heading>
                    <p>
                        Clinic adding successfully into database
                    </p>
                </Alert>)
        }
        else {
            return <></>
        }

    }
    if (props.clinics.isLoading) {
        return <Loading />
    }
    return (
        <div className="mt-2">
            <ModalClinic data={props.clinicForm} />
            <Breadcrumb >
                <Breadcrumb.Item className="pl-3" href="#">
                    <Link to={`/dashboard`}>
                        Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    <Link to={`/dashboard/clinics`}>Clinics</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active className="mr-auto" href="#">
                    Add Clinic
                </Breadcrumb.Item>
                <Button className="d-md-inline-block d-none" onClick={() => { props.resetForm(); props.closeRegisterDialog() }} style={{
                    "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                    "marginBottom": "-13px", "marginRight": "18px"
                }}><span className="fa fa-trash-alt"></span></Button>
            </Breadcrumb>
            <Container fluid >
                <div className="pageContainer">
                    <Row className="mb-4">
                        <Col md={12} className="mb-4">
                            <h5>Add Clinic</h5>
                        </Col>
                        <ErrorAlert />
                        <Col md={12}>
                            <Form model="clinicForm" className="p-4" onSubmit={(values) => handleSubmit(values)}>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>Name : </FormLabel>
                                    </Col>
                                    <Col >
                                        <Control.text name="name" model=".name" className="form-control"
                                            placeholder="Enter Clinic Name" validators={{
                                                required, isChar
                                            }} />
                                        <Errors
                                            className="text-danger" model=".name" show="touched" messages={{
                                                required: 'Required ',
                                                isChar: "Must be char ",
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={2}>
                                        <FormLabel>Image : </FormLabel>
                                    </Col>
                                    <Col>
                                        <Control.file name="image" model=".image" accept="image/*" multiple={false}
                                            className="form-control"
                                            onChange={(event) => {
                                                const formData = new FormData()
                                                const file = event.target.files[0]
                                                formData.append('Photo', file)
                                                props.ChangeImage(formData)
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={{ size: 10, offset: 2 }}>
                                        <Button className="btn2" type="submit">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Form >
                        </Col>
                    </Row>

                </div>
            </Container>
        </div>

    );
}

const mapStateToProps = (state) => ({
    clinicForm: state.clinicForm,
    clinics: state.clinics
})

const mapDispatchToProps = (dispatch) => ({
    addClinic: (ClinicInfo) => dispatch(postClinic(ClinicInfo)),
    openModelDialog: () => dispatch(openClinicDialog()),
    resetForm: () => dispatch(actions.reset('clinicForm')),
    ChangeImage: (image) => dispatch(actions.change('clinicForm.image', image)),
    closeRegisterDialog: () => dispatch(closeClinicRegisterDialog()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClinicForm))