/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Button, Card, CardGroup, Col, Container, Form, Image, Nav, Navbar, Row } from 'react-bootstrap'
import { Control, LocalForm } from 'react-redux-form';
import { withRouter } from "react-router-dom"
import { HashLink, NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy'

function LandingPage(props) {
    const team = [{
        name: "Abdulaleem Alsayed",
        job: "Kotlin Developer",
        gender: "Male",
        linkedIn: "https://www.linkedin.com/in/abada400022/",
        emailLink: "mailto:abada400022@gmail.com"
    }
        , {
        name: "Humam ALbazzal",
        job: "Kotlin Developer",
        gender: "Male",
        linkedIn: "https://www.linkedin.com/in/homam-al-bazzal-81344a107/",
        emailLink: "mailto:Dolor993@gmail.com"
    }, {
        name: "Sedra Merkhan",
        job: "Kotlin Developer",
        gender: "Female",
        linkedIn: "https://www.linkedin.com/in/sedra-merkhan-03a0821b2/",
        emailLink: "mailto:sedramerkhan@gmail.com"
    }
        ,
    {
        name: "Mostafa Milly",
        job: "Reactjs Developer",
        gender: "Male",
        linkedIn: "https://www.linkedin.com/in/mostafa-kashoul-milly-71453a1a3/"
        , emailLink: "mailto:mostafamilly6@gmail.com"
    }
        , {
        name: "AbdulRahman Armashi",
        job: "Nodejs Developer",
        gender: "Male",
        linkedIn: "https://www.linkedin.com/in/abdulrahman-armashi-83044121b/",
        emailLink: "mailto:abod3e4@gmail.com"
    }
    ]
    const handleSubmitMessage = (values) => {
        if (values.phone || values.name || values.message) {
            window.location.href = 'mailto:mostafamilly6@gmail.com?subject=' + values.name + ' (' + values.phone + ')&body=' + values.message;
        }
    }
    const scrollWithOffset = (el) => {
        const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
        const yOffset = 30;
        window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
    }
    return (
        <div className="landingPage">
            <Navbar collapseOnSelect expand="md" bg="light" fixed="top" className="jusitfy-content-end" variant="light">
                <Container>
                    <Navbar.Brand><Image src="assets\images\logo (1).svg" width="32" height="32" className="brand"></Image></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsiveNavBar" />
                    <Navbar.Collapse id="responsiveNavBar">
                        <Nav className="me-auto text-center" as={Scrollspy} items={['home', 'features', 'team', 'contact']} currentClassName="active" >
                            <Nav.Item>
                                <Nav.Link as="span" eventKey="1" active={false}>
                                    <NavHashLink to="#home" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                        Home
                                    </NavHashLink>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as="span" eventKey="2" active={false}>
                                    <NavHashLink to="#features" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                        Features
                                    </NavHashLink>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as="span" eventKey="3" active={false}>
                                    <NavHashLink to="#team" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                        Team
                                    </NavHashLink>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="d-md-none">
                                <Nav.Link as="span" eventKey="4" active={false}>
                                    <NavHashLink to="#contact" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                        Contact
                                    </NavHashLink>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="d-md-none">
                                <Nav.Link eventKey="5" onClick={() => {
                                    props.history.push('/dashboard')
                                }}>Demo</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Nav as={Scrollspy} items={['contact']} currentClassName="activeContactButton">
                            <div className="d-md-flex d-none me-3">
                                <Button className="btn" variant="outline-secondary"
                                    to="#contact" smooth as={HashLink}>
                                    Contact
                                </Button>
                            </div>
                            <div className="d-md-flex d-none me-2">
                                <button className="btn btn-outline-secondary demoButton" onClick={() => {
                                    props.history.push('/dashboard')
                                }}>
                                    Demo
                                </button>
                            </div>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <header className="page-header gradiant" id="home">
                <Container className="pt-4 pb-4 pb-md-0">
                    <Row className="justify-content-center align-items-center">
                        <Col md="5">
                            <h3>Afia Clinics</h3>
                            <p>Because we care to your customers health , we create afia clinics system with many services to help you with your work in your medical center.</p>
                            <button className="btn btn-primary liveDemoButton" onClick={() => {
                                props.history.push('/dashboard')
                            }}>
                                Live Demo
                            </button>
                        </Col>
                        <Col md="5" className="text-center">
                            <Image src="assets\images\Online Doctor-amico (1).svg" fluid className="p-2 ms-md-5" width="343" height="350" />
                        </Col>
                    </Row>
                </Container>
                <svg xmlns="http://www.w3.org/2000/svg" className="waves" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,96L80,106.7C160,117,320,139,480,144C640,149,800,139,960,122.7C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
            </header>
            <section id="features">
                <section className="mainServices row-content">
                    <Container>
                        <Row className="g-4">
                            <h2 className="text-center">What we offer</h2>
                            <p className="text-center text-muted mt-1" style={{ fontSize: "1.15rem" }}>Our services will be available in android,web platforms <br />here are the most important features we have</p>
                            <Col md="4" className="text-center">
                                <Image src="assets\images\undraw_happy_announcement_ac67.svg" width="210" height="210" fluid></Image>
                                <h3 className="mt-3">Push Notifications</h3>
                                <p className="text-muted ps-4 pe-4" style={{ fontSize: "1.15rem" }}>
                                    We provide notification service for notiify your patients for latest medical news or for any edit occurs in pending appointments
                                </p>
                            </Col>
                            <Col md="4" className="text-center">
                                <Image src="assets\images\undraw_Growing_re_olpi.svg" width="600" height="600" fluid className="pe-4 me-2 mb-3"></Image>
                                <h3 className="mt-3">Statistics</h3>
                                <p className="text-muted ps-4 pe-4" style={{ fontSize: "1.15rem" }}>
                                    We provide effective statistics in your medical center dashboard to get all informations you need about your work and patients.
                                </p>
                            </Col>
                            <Col md="4" className="text-center">
                                <Image src="assets\images\undraw_Hiring_re_yk5n.svg" width="155" height="155" fluid ></Image>
                                <h3 className="mt-3">Reports</h3>
                                <p className="text-muted ps-4 pe-4" style={{ fontSize: "1.15rem" }}>
                                    We provide all reports you need in your medical center such as medical reports for your paitents and patient register informations after create his account.
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="gradiant text-white row-content" style={{ fontSize: "1.18rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="topWaves" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,90.7C640,96,800,96,960,90.7C1120,85,1280,75,1360,69.3L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                    <Container className="pt-4 pb-4 pb-md-0">
                        <Row className="justify-content-center align-items-center">
                            <Col md="5" className="mb-5 ps-5">
                                <h3>Multi platform</h3>
                                <p>Afia clinics have 3 apps , android app for your patients and android app for your doctors , and we create web app to manage your administrative work.</p>
                            </Col>
                            <Col md="7" className="text-center">
                                <Image src="assets\images\devicess.png" fluid className="p-2 ms-md-5" />
                            </Col>
                        </Row>
                    </Container>
                    <svg xmlns="http://www.w3.org/2000/svg" className="bottomWaves" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,90.7C640,96,800,96,960,90.7C1120,85,1280,75,1360,69.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
                </section>
                <section style={{ fontSize: "1.18rem" }} className="row-content">
                    <Container className="pt-4 pb-4 pb-md-0">
                        <Row className="justify-content-center align-items-center">
                            <Col md="7" className="text-center order-md-first order-2">
                                <Image src="assets\images\patientApp.png" height="260" width="260" fluid className="p-2 me-md-5" />
                            </Col>
                            <Col md="5" className="mb-5 order-md-last order-1">
                                <h3>Patient Android App</h3>
                                <p>In the patient application, we offer multiple services, such as the ability to download medical reports , book appointmetns and many more ..</p>
                                <Button variant="outline-secondary">
                                    Soon on Google play <span className="fab fa-google-play ms-2" />
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="gradiant text-white row-content" style={{ fontSize: "1.18rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="topWaves" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,90.7C640,96,800,96,960,90.7C1120,85,1280,75,1360,69.3L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                    <Container className="pt-4 pb-4 pb-md-0 mobViewContainer">
                        <Row className="justify-content-center align-items-center">
                            <Col md="6" className="mb-5">
                                <h3>Doctor Android App</h3>
                                <p>In this application, the doctor can respond to consultations , add medical information during medical session and show schedule appointments.</p>
                                <Button variant="outline-light">
                                    Soon on Google play <span className="fab fa-google-play ms-2" />
                                </Button>
                            </Col>
                            <Col md="6" className="text-center">
                                <Image src="assets\images\doctorApp.png" height="260" width="260" fluid className="p-2 ms-md-5" />
                            </Col>
                        </Row>
                    </Container>
                    <svg xmlns="http://www.w3.org/2000/svg" className="bottomWaves" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,90.7C640,96,800,96,960,90.7C1120,85,1280,75,1360,69.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
                </section>
            </section>
            <section className="row-content" id="team">
                <Container>
                    <Row className="g-4 text-center">
                        <h2 className="text-center">Our Team</h2>
                        <CardGroup style={{ placeContent: "center" }}>
                            {
                                team.map((element) => (
                                    <Col md="4" className="text-center mb-3">
                                        <Card style={{ width: 'auto', margin: "0 auto" }}>
                                            <Card.Body>
                                                <Image roundedCircle fluid src=
                                                    {element.gender === "Male" ? 'assets/images/maleavatar.svg' : 'assets/images/femaleavatar.svg'} width="170px" className="img-fluid mt-4 mb-4" as={Card.Img} />
                                                <Card.Title>{element.name}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{element.job}</Card.Subtitle>
                                                <Card.Link style={{ color: 'inherit' }} className="text-decoration-none" href={element.emailLink}>
                                                    <Image src="assets/images/email.svg" width="24" height="24" />
                                                </Card.Link>
                                                {element.linkedIn ?
                                                    <Card.Link style={{ color: 'inherit' }} className="text-decoration-none" href={element.linkedIn}>
                                                        <Image src="assets/images/linkedin.svg" width="24" height="24" />
                                                    </Card.Link>
                                                    :
                                                    <></>}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </CardGroup>
                    </Row>
                </Container>
            </section>
            <section className="row-content  pb-5 gradiant2" id="contact">
                <svg xmlns="http://www.w3.org/2000/svg" className="contactWaves" viewBox="0 0 1440 320"><path fill="#fff" fill-opacity="1" d="M0,128L60,122.7C120,117,240,107,360,112C480,117,600,139,720,154.7C840,171,960,181,1080,176C1200,171,1320,149,1380,138.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>                <Container>
                    <Row className="align-items-center" style={{ justifyContent: "space-around" }}>
                        <h2 className="text-center">
                            Contact us
                        </h2>
                        <Col className="col-12 col-md-4 offset-md-1">
                            <LocalForm className="ps-2 pe-2" id="contactForm" onSubmit={handleSubmitMessage}>
                                <Form.Group className="mb-3" controlId="nameInput">
                                    <Form.Label>Name:</Form.Label>
                                    <Control type="text" className="form-control" id="nameInput" model=".name" placeholder="Enter your name" name="subject" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="phoneInput">
                                    <Form.Label>Phone:</Form.Label>
                                    <Control type="text" id="phoneInput" model=".phone"
                                        placeholder="Enter your phone" className="form-control" name="phone" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="messageInput">
                                    <Form.Label>Message: </Form.Label>
                                    <Control.textarea model=".message" name="body" className="form-control" id="messageInput" rows="3" />
                                </Form.Group>
                                <Button className="btn btn-primary liveDemoButton" type="submit">
                                    Submit
                                </Button>
                            </LocalForm>
                        </Col>
                        <Col md="5" className="d-none d-md-block">
                            <Image src="assets/images/undraw_contact_us_15o2.svg" fluid />
                        </Col>
                    </Row>
                </Container>
            </section>
            <div className="footer-basic">
                <footer>
                    <div className="social">
                        <a href="mailto:mostafamilly6@gmail.com">
                            <i className="icon ion-email"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/mostafa-kashoul-milly-71453a1a3/">
                            <i className="icon ion-social-linkedin">
                            </i>
                        </a><a href="https://www.facebook.com/mostafamilly14/">
                            <i className="icon ion-social-facebook">
                            </i>
                        </a>
                    </div>
                    <ul className="list-inline footerNavs">
                        <li className="list-inline-item">
                            <HashLink to="#home" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                Home
                            </HashLink>
                        </li>
                        <li className="list-inline-item">
                            <HashLink to="#features" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                Features
                            </HashLink>
                        </li>
                        <li className="list-inline-item"><a href="/dashboard">Demo</a></li>
                        <li className="list-inline-item">
                            <HashLink to="#team" smooth className="planeLink" scroll={el => scrollWithOffset(el)}>
                                Team
                            </HashLink>
                        </li>
                        <li className="list-inline-item">
                            <HashLink to="#contact" smooth className="planeLink">
                                Contact
                            </HashLink>
                        </li>
                    </ul>
                    <p className="copyright">Afia Clinics © {new Date().getFullYear()}</p>
                </footer>
            </div>
        </div >
    );
}

export default withRouter(LandingPage);