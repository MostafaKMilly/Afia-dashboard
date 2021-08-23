import React from 'react';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import {actions } from 'react-redux-form';
import { addPatient, closePatientDialog } from '../redux/Actions/PatientAction';

function ModalPatient(props) {
    const handleSubmit = (event) => {
        event.preventDefault()
        let requestData = {...props.data}
        requestData.user = { ...requestData.user, type: "Patient" }
        console.log(requestData)
        props.addPatient(requestData)
        props.handleClose()
    }
    
    return (
        <Modal show={props.patients.modelDialogIsOpen} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Register</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
            <Modal.Body>
                    <div className="separator  mb-2">
                        Patient Name
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                First Name
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.firstName} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Middle Name :
                                </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.middleName} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Last Name
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.lastName} />
                        </Form.Group>
                    </Form.Row>
                    <div className="separator mb-2">
                        Contact Information
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                address :
                                </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.address} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Phone Number : 
                                </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.phone} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Home Number : 
                                </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.number} />
                        </Form.Group>
                    </Form.Row>
                    <div className="separator  mb-2">
                        Personal Information
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Gender :
                            </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.gender} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                             Birthday :
                            </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.birthday} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                            Length :
                            </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.length} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                            Weight :
                            </Form.Label>
                            <Form.Control plaintext readOnly value={props.data.weight} />
                        </Form.Group>
                    </Form.Row>
                    <div className="separator  mb-2">
                        Account Information
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Email
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.user.email} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                User Name
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.user.username} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Password
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.user.password} />
                        </Form.Group>
                    </Form.Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Edit
                </Button>
                <Button className="loginBtn" type="submit">
                    Save Changes
                </Button>
            </Modal.Footer>
            </Form>
        </Modal>
    );

}

const mapStateToProps = (state) => ({
    patients: state.patients,
    patientRegisterStatus : state.patientRegisterStatus
})
const mapDispatchToProps = (dispatch) => ({
    addPatient: (patientInfo) => dispatch(addPatient(patientInfo)),
    handleClose: () => dispatch(closePatientDialog()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalPatient)
