import React from 'react';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addClinic, closeClinicDialog } from '../redux/Actions/ClinicActions';
import {actions } from 'react-redux-form';

function ModalClinic(props) {
    const handleSubmit = (event) => {
        event.preventDefault()
        let requestData = {...props.data}
        const formData = new FormData()
        formData.append('Photo' , requestData.image[0])
        requestData.image = formData
        console.log(requestData)
        props.addClinic(requestData)
        props.resetClinicForm()
        props.handleClose()
    }
    return (
        <Modal show={props.clinics.modelDialogIsOpen} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Register</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
            <Modal.Body>
                    <div className="separator  mb-2">
                        Clinic Name
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Clinic Name
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.name} />
                        </Form.Group>
                    </Form.Row>
                    <div className="separator  mb-2">
                        Account Information
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Image
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.image[0]?.name} />
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
    clinics: state.clinics
})
const mapDispatchToProps = (dispatch) => ({
    handleClose: () => dispatch(closeClinicDialog()),
    resetClinicForm : () => dispatch(actions.reset('clinicForm')),
    addClinic : (clinicInfo) => dispatch(addClinic(clinicInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalClinic)
