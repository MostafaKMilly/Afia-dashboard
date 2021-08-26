/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Button, Col, FormGroup, FormLabel, Modal, Row } from 'react-bootstrap';
import { Control, LocalForm } from 'react-redux-form';
import { withRouter } from 'react-router-dom';
import { updateDoctorDetail } from '../redux/Actions/DoctorActions';
import { connect } from 'react-redux';

function EditPeronalInfoDoctor(props) {
    if (!props.doctor) {
        return <></>
    }
    const handleSubmit = (values) => {
        let obj = { ...values }
        obj = { ...obj, id: props.doctor.doctor.id }

        props.updateDoctorDetail(obj)
    }
    return (
        <>
            <Modal size="lg" show={props.showModal} onHide={() => props.setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Doctor</Modal.Title>
                </Modal.Header>
                <LocalForm onSubmit={(values) => handleSubmit(values)} model="editForm">
                    <Modal.Body>
                        <div className="separator  mb-2">
                            Doctor Name
                        </div>
                        <Row>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    First Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".firstName" defaultValue={props.doctor.doctor.firstName} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Last Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".lastName" defaultValue={props.doctor.doctor.lastName} />
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
                                <Control.text className="form-control" model=".phoneNumber" defaultValue={props.doctor.doctor.phoneNumber} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    Email
                                    :</FormLabel>
                                <Control type="email" className="form-control" model=".user.email" defaultValue={props.doctor.doctor.user.email} />
                            </FormGroup>
                        </Row>
                        <div className="separator  mb-2">
                            Account Information
                        </div>
                        <Row>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    User Name
                                    :</FormLabel>
                                <Control.text className="form-control" model=".user.username" defaultValue={props.doctor.doctor.user.username} />
                            </FormGroup>
                            <FormGroup as={Col}>
                                <FormLabel>
                                    New password
                                    :</FormLabel>
                                <Control type="password" model=".user.password" className="form-control" />
                            </FormGroup>
                        </Row>
                        <Row>
                            <Row>
                                <FormGroup as={Col}>
                                    <FormLabel>
                                        Sepecialize
                                        :</FormLabel>
                                    <Control className="form-control" model=".sepecialize" defaultValue={props.doctor.doctor.sepecialize} />
                                </FormGroup>
                            </Row>
                            <Row>
                                <FormGroup as={Col}>
                                    <FormLabel>
                                        description
                                        :</FormLabel>
                                    <Control.textarea name="description" model=".description"
                                        className="form-control" rows={3} defaultValue={props.doctor.doctor.description}
                                    />
                                </FormGroup>
                            </Row>
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
    doctors: state.doctors
})

const mapDispatchToProps = (dispatch) => ({
    updateDoctorDetail: (values) => dispatch(updateDoctorDetail(values))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPeronalInfoDoctor));