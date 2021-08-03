import React from 'react';
import { Modal, Form, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addDoctor, closeDoctorDialog } from '../redux/Actions/DoctorActions';
import { actions } from 'react-redux-form';

function ModalDoctor(props) {
    const handleSubmit = (event) => {
        event.preventDefault()
        let requestData = { ...props.data }
        requestData.language = requestData.language.join(',')
        requestData.user = { ...requestData.user, type: props.type }
        requestData.tags = {
            ...requestData.tags,
            check: parseInt(requestData.tags.check),
            review: parseInt(requestData.tags.review),
            consultation: parseInt(requestData.tags.consultation)
        }
        console.log(requestData)
        props.addDoctor(requestData)
        props.resetDoctorForm()
        props.handleClose()
    }
    const workingDaysList = props.data.workingDaysList.map((item, i) => (
        <li key={i} className="mb-4 mt-3">
            <span className="fa fa-calendar-day mr-3" style={{ "color": "grey" }}></span>
            {item.day}
            <span className="fa fa-clock ml-4 mr-4" style={{ "color": "grey" }}></span>
            {item.startTime}
            <span style={{ "color": "grey" }} className="ml-3 mr-2">{'->'}</span>
            <span className="fa fa-clock ml-4 mr-4" style={{ "color": "grey" }}></span>
            {item.endTime}
        </li>
    ))
    return (
        <Modal show={props.doctors.modelDialogIsOpen} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Register</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="separator  mb-2">
                        Doctor Name
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
                                Phone Number
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.phoneNumber} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Email
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.user.email} />
                        </Form.Group>
                    </Form.Row>
                    <div className="separator  mb-2">
                        Account Information
                    </div>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                User Name
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.user.username} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                password
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.user.password} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Clinic
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.clinic} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Sepecialize
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.sepecialize} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                Languages
                                :</Form.Label>
                            <Form.Control plaintext readOnly value={props.data.language.toString()} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>
                                description
                                :</Form.Label>
                            <Form.Control as="textarea" rows={3} plaintext readOnly value={props.data.description} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <div className="separator  mb-3">
                                Working Days Information
                            </div>
                            <ul className="list-unstyled text-center">
                                {workingDaysList}
                            </ul>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <div className="separator  mb-3">
                                Sessions duration Information
                            </div>
                            <ul className="list-unstyled text-center" id="sessionsList">
                               <li>
                                  {'check : ' +props.data.tags.check} 
                               </li>
                               <li>
                                  {'consultation : ' +props.data.tags.consultation} 
                               </li>
                               <li>
                                  {'review : ' +props.data.tags.review} 
                               </li>
                            </ul>
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
    doctors: state.doctors,
    doctorRegisterStatus: state.doctorRegisterStatus
})
const mapDispatchToProps = (dispatch) => ({
    addDoctor: (doctorInfo) => dispatch(addDoctor(doctorInfo)),
    handleClose: () => dispatch(closeDoctorDialog()),
    resetDoctorForm: () => dispatch(actions.reset('doctorForm'))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalDoctor)
