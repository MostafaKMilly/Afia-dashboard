/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-pascal-case */
import React, { useState } from 'react';
import {
    Breadcrumb, Col, Container,
    Row, Button, Image, Media, Pagination, BreadcrumbItem
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useRouteMatch, withRouter } from 'react-router-dom';
import Loading from '../Loading';
import ErrorAlert from '../../helpers/ErrorAlert'
import { deleteClinic } from '../../redux/Actions/ClinicActions';
import { baseUrl } from '../../shared/baseUrl';



function ClinicsSection(props) {
    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const nextPath = (path) => {
        props.history.push(path)
    }
    const { path, url } = useRouteMatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(9)
    const clinics = props.clinics.clinics.map((clinic, index) => (
        <Col xs={12} md={4}>
            <Media as="li" key={clinic.clinic.id} className="m-3">
                <Image height={80} width={80} src={props.clinics.clinics[index].photo !== null ?
                    props.clinics.clinics[index].photo.url : 'assets/images/Doctor-amico.png'} className="d-none d-md-block" roundedCircle />
                <Media.Body className="align-self-center ml-2">
                    <h5>{clinic.clinic.name}</h5>
                    <Button variant="outline-secondary" className="btn-sm" onClick={() => nextPath(`/dashboard/clinics/${clinic.clinic.id}`)}>Detail</Button>
                </Media.Body>
            </Media>
            <span className="fas fa-ellipsis-v clinicOptions"></span>

        </Col>
    ))
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const clinicsList = clinics.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(clinics.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }
    if (props.clinics.isLoading) {
        return <Loading />
    }
    else if (props.clinics.errMess) {
        return (<ErrorAlert messege={props.clinics.errMess} />)
    }
    else {
        return (
            <div className="mt-2">

                <Breadcrumb >
                    <BreadcrumbItem className="pl-3 mt-1" href="#">
                        <Link to={`/dashboard`}>
                            Home
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem className="mr-auto mt-1" active href="#">
                        clinics
                    </BreadcrumbItem>
                    <Button onClick={() => nextPath(`${path}/add`)} style={{
                        "backgroundColor": "#ff2e63f2", "border": "1px solid gray",
                        "marginBottom": "-13px", "marginRight": "7px"
                    }}><span className="fa fa-plus"></span></Button>
                </Breadcrumb>
                <Container fluid >
                    <div className="pageContainer ">
                        <Row className="mb-3">
                            <Col xs={12} className="mt-3 text-center">
                                <h4>Clinics</h4>
                            </Col>
                            <Col xs={12}>
                                <Container fluid className="mb-2 mt-4">
                                    <Row>
                                        {clinicsList}
                                    </Row>
                                </Container>

                            </Col>

                        </Row>
                        <center>
                            <div className="text-center">
                                <Pagination>{items}</Pagination>
                            </div>

                        </center>

                    </div>


                </Container>

            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    clinics: state.clinics
})

const mapDispatchToProps = (dispatch) => ({
    deleteClinic: (id) => dispatch(deleteClinic(id))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClinicsSection));