import React from 'react';
import { Row, Container, Col, Image, Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { baseUrl } from '../../shared/baseUrl';
import HideForType from '../../helpers/HideForType'

function EditProfile(props) {
    const loadPhoto = (user) => {
        if (user.user.type === "Doctor") {
            if (user.photo === undefined || user.photo === null) {
                return 'assets/images/doctor.svg'
            }
            else {
                return user.photo.url
            }
        }
        else if (user.user.type === "Patient" && user.gender === "male") {
            if (user.photo === undefined || user.photo === null) {
                return 'assets/images/maleavatar.svg'
            }
            else {
                return user.photo.url
            }
        }
        else if (user.user.type === "Patient" && user.gender === "female") {
            if (user.photo === undefined || user.photo === null) {
                return 'assets/images/femaleavatar.svg'
            }
            else {
                return user.photo.url
            }
        }
        else if (user.user.type==="Nurse") {
            return 'assets/images/nurse.svg'
        }
        else if (user.user.type ==="Admin") {
            return 'assets/images/admin.svg'
        }
    }
    return (
        <div>
            <h5 style={{ fontWeight: 450 }} className="mt-3 ms-3 mb-4">Edit Profile</h5>
            <Container>
                <Row>
                    <Col className="col-12 text-center">
                        <div style={{ position: 'relative', width: '132px', margin: '0 auto' }}>
                            <Image roundedCircle width={132} src={loadPhoto(props.user.userData)}></Image>
                            <HideForType type={["Nurse" , "Admin"]}>
                                <span className="fa fa-camera" type="button" style={{
                                    position: "absolute",
                                    bottom: "16%",
                                    right: "-2%",
                                }}></span>
                            </HideForType>
                        </div>
                    </Col>
                    <Col className="col-md-12 pe-md-4 pe-0" style={{ marginTop: '35px' }}>
                        <Form>
                            <Form.Row className="mb-4">
                                <Form.Group as={Col} className="pe-4 pe-0 col-md-5">
                                    <Form.Label>
                                        User name
                                        :</Form.Label>
                                    <Form.Control className="form-control" />
                                </Form.Group>
                                <Form.Group as={Col} className="col-md-5">
                                    <Form.Label>
                                        Password
                                        :</Form.Label>
                                    <Form.Control type="password" className="form-control" />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row className="mb-4">
                                <Form.Group as={Col} className="pe-4 pe-0 col-md-5">
                                    <Form.Label>
                                        Email
                                        :</Form.Label>
                                    <Form.Control type="email" className="form-control" />
                                </Form.Group>
                            </Form.Row>
                            <Button variant="outline-secondary">Save</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default withRouter(connect(mapStateToProps)(EditProfile));