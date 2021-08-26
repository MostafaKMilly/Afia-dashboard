/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Button, Col, FormGroup, FormLabel, Modal, Row } from 'react-bootstrap';
import { Control, LocalForm } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updatePatientDetail } from '../redux/Actions/PatientAction';

function EditPeronalInfoPatient(props) {
    if (!props.patient) {
        return <></>
    }
    const handleSubmit = (values) => {
        let obj = { ...values }
        obj = { ...obj, id: props.patient.patient.id }
        props.updatePatientDetail(obj)
    }
    return (
        <>
            <Modal size="lg" show={props.showModal} onHide={() => props.setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Patient Detail</Modal.Title>
                </Modal.Header>
                <LocalForm onSubmit={(values) => handleSubmit(values)} model="editForm">
                    <Modal.Body>
                        <div className="separator  mb-2">
                            Personal Info
                        </div>
                        <Row>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    First Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".firstName" defaultValue={props.patient.patient.firstName} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Last Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".middleName" defaultValue={props.patient.patient.middleName} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Last Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".lastName" defaultValue={props.patient.patient.lastName} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Gender
                                    :</FormLabel>
                                <Control.select name="gender" model=".gender" className="form-select"
                                    defaultValue={props.patient.patient.gender}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </Control.select>
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Length
                                    :</FormLabel>
                                <Control.text className="form-control" model=".length" defaultValue={props.patient.patient.length} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Weight
                                    :</FormLabel>
                                <Control.text className="form-control" model=".weight" defaultValue={props.patient.patient.weight} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Birthday
                                    :</FormLabel>
                                <Control type="date" className="form-control" model=".birthday" defaultValue={props.patient.patient.birthday} />
                            </FormGroup>
                        </Row>
                        <div className="separator mb-2">
                            Contact Information
                        </div>
                        <Row>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Phone Number
                                    :</FormLabel>
                                <Control.text className="form-control" model=".phone" defaultValue={props.patient.patient.phone} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Home Number
                                    :</FormLabel>
                                <Control type="text" className="form-control" model=".number" defaultValue={props.patient.patient.number} />
                            </FormGroup>
                            <FormGroup className="col-12">
                                <FormLabel>
                                    address
                                    :</FormLabel>
                                <Control.textarea name="address" model=".address"
                                    className="form-control" rows={3} defaultValue={props.patient.patient.address}
                                />                            </FormGroup>
                        </Row>
                        <div className="separator  mb-2">
                            Account Information
                        </div>
                        <Row>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    User Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".user.username" defaultValue={props.patient.patient.user.username} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    New password
                                    :</FormLabel>
                                <Control type="password" model=".user.password" className="form-control" />
                            </FormGroup>
                            <FormGroup className="col-12">
                                <FormLabel>
                                    Email
                                    :</FormLabel>
                                <Control.text className="form-control" model=".user.email" defaultValue={props.patient.patient.user.email} />
                            </FormGroup>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => props.setShowModal(false)}>
                            Close
                        </Button>
                        <Button className="loginBtn" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </LocalForm>
            </Modal>
        </>
    );
}

const mapStateToProps = (state) => ({
    patients: state.patients
})

const mapDispatchToProps = (dispatch) => ({
    updatePatientDetail: (values) => dispatch(updatePatientDetail(values))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPeronalInfoPatient));