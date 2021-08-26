/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';
import { Row, Container, Col, Image, Button, Table, Modal, FormGroup, FormLabel, Alert, Pagination } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearErrMess, deleteWorkingDay, updateWorkingDay } from '../../redux/Actions/CenterActions';
import { Control, LocalForm } from 'react-redux-form'
import { baseUrl } from '../../shared/baseUrl';
import Loading from '../Loading';
function NurseComponent(props) {
    const [showEditModal, setEditShowModal] = useState(false)
    const [selectedNurse, setSelectedNurse] = useState('')
    const [nurses, setNurses] = useState([])
    const [showAddModal, setAddShowModal] = useState(false)
    const [error, setError] = useState()
    const [isloading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(4)
    const getNurses = () => {
        return fetch(baseUrl + 'api/nurses/', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(response => {
            if (response.ok) {
                return response
            }
            else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
            .then(response => response.json())

    }
    useEffect(() => {
        getNurses().then((nurses) => {
            setNurses(nurses)
            setIsLoading(false)
        }).catch(error => {
            setError(error.message)
            setIsLoading(false)
        })
    }, [])
    const addNurse = (values) => {
        return fetch(baseUrl + 'api/nurses/Signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
        }).then(response => {
            if (response.ok) {
                return response
            }
            else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
            .then(response => response.json())

    }
    const updateNurse = (nurseId, values) => {
        return fetch(baseUrl + 'api/nurses/id/' + nurseId, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
        }).then(response => {
            if (response.ok) {
                return response
            }
            else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
            .then(response => response.json())
    }
    const deleteNurse = (nurseId) => {
        return fetch(baseUrl + 'api/nurses/id/' + nurseId, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        }).then(response => {
            if (response.ok) {
                return response
            }
            else {
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err.message)
            throw error;
        })
            .then(response => response.json())
    }
    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const nursesArray = nurses?.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(nurses?.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }
    const nursesList = nursesArray?.map((nurse) => (
        <tr key={nurse.id}>
            <td>{nurse.username}</td>
            <td>{nurse.email}</td>
            <td><span className="fa fa-edit me-3" onClick={() => {
                setSelectedNurse(nurse.id)
                setEditShowModal(true)
            }} type="button" style={{ color: '#010A43' }}></span>
                <span className="fa fa-trash-alt" type="button" onClick={() => handleDelete(nurse.id)} style={{ color: '#010A43' }}></span>
            </td>
        </tr>
    ))
    const handleEdit = (values) => {
        if (values.username || values.password || values.email) {
            setError(undefined)
            updateNurse(selectedNurse, values).then(() => {
                let tempoArray = [...nurses]
                let i = tempoArray.findIndex((nurse) => nurse.id === selectedNurse)
                tempoArray[i] = { ...tempoArray[i], ...values }
                setNurses(tempoArray)
            })
                .catch(error => {
                    setError(error.message)
                })
            setEditShowModal(false)
        }
    }
    const handleSubmit = (values) => {
        if (values.username === undefined || values.password === undefined || values.email === undefined) {
            return
        }
        setError(undefined)
        values = { ...values, type: "Nurse" }
        addNurse(values).then((nurse) => {
            let tempoArray = [...nurses]
            tempoArray.push(nurse.NurseData)
            setNurses(tempoArray)
        })
            .catch(error => {
                setError(error.message)
            })
        setAddShowModal(false)
    }
    const handleDelete = (nurseId) => {
        deleteNurse(nurseId).then(() => {
            let tempArray = nurses.filter((nurse) => nurse.id !== nurseId)
            setNurses(tempArray)
        })
    }
    /*  const selectedNurseValues = nurses?.filter((nurse) => nurse.id ===selectedNurse)[0]
     let defaultUserName = selectedNurseValues ? selectedNurseValues.username : undefined 
     let defaultEmail = selectedNurseValues ? selectedNurseValues.email : undefined  
  */
    const ErrorAlert = () => {
        if (error) {
            return <Alert variant="danger" className="mt-2 mb-4" style={{
                width: "fit-content",
                margin: "0 auto"
            }} onClose={() => setError(undefined)} dismissible>
                <Alert.Heading>Error !</Alert.Heading>
                {error}
            </Alert>
        }
        else {
            return <></>
        }
    }
    if (isloading) {
        return <Loading />
    }
    return (
        <div>
            <ErrorAlert />
            <Modal show={showEditModal} onHide={() => setEditShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Nurse data</Modal.Title>
                </Modal.Header>
                <LocalForm model="updateForm" onSubmit={handleEdit}>
                    <Modal.Body>
                        <FormGroup className="mb-3" controlId="usernameInput">
                            <FormLabel>Username :</FormLabel>
                            <Control.input type="text" className="form-control" model=".username" />
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="passwordInput">
                            <FormLabel>New password :</FormLabel>
                            <Control.input type="password" className="form-control" model=".password" />
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="emailInput">
                            <FormLabel>Email :</FormLabel>
                            <Control.text type="email" className="form-control" model=".email" />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Update
                        </Button>
                    </Modal.Footer>
                </LocalForm>
            </Modal>
            <Modal show={showAddModal} onHide={() => setAddShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Nurse data</Modal.Title>
                </Modal.Header>
                <LocalForm model="addForm" onSubmit={handleSubmit}>
                    <Modal.Body>
                        <FormGroup className="mb-3" controlId="usernameInput">
                            <FormLabel>Username :</FormLabel>
                            <Control.input type="text" className="form-control" model=".username" />
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="passwordInput">
                            <FormLabel>password :</FormLabel>
                            <Control.input type="password" className="form-control" model=".password" />
                        </FormGroup>
                        <FormGroup className="mb-3" controlId="emailInput">
                            <FormLabel>Email :</FormLabel>
                            <Control.text type="email" placeholder="name@example.com" className="form-control" model=".email" />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </LocalForm>
            </Modal>

            <h5 style={{ fontWeight: 450 }} className="mt-3 ms-3 mb-4">Manage Nurses</h5>
            <Container>
                <Row>
                    <Col className="col-12 text-center mb-3">
                        <div style={{ position: 'relative', width: '132px', margin: '0 auto' }}>
                            <Image roundedCircle width={172} src='.\assets\images\undraw_doctors_hwty.svg'></Image>
                        </div>
                    </Col>
                    <Col className="col-md-12 pe-md-4 pe-0" style={{ marginTop: '35px' }}>
                        <Table hover responsive variant="white">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nursesList}
                            </tbody>
                            {nurses.length === 0 ? <tbody>
                                <tr>
                                    <td colSpan={3}>
                                        {"there are no nurses"}
                                    </td>
                                </tr>
                            </tbody> : <></>}

                        </Table>
                        <center>
                            <Button variant="outline-secondary" onClick={() => setAddShowModal(true)}>Add</Button>
                            <div className="text-center mt-3">
                                <Pagination>{items}</Pagination>
                            </div>
                        </center>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

const mapDispatchTopProps = (dispatch) => ({
    deleteWorkingDay: (day) => dispatch(deleteWorkingDay(day)),
    updateWorkingDay: (day, values) => dispatch(updateWorkingDay(day, values)),
    clearErrMess: () => dispatch(clearErrMess())
})

const mapStateTopProps = (state) => ({
    center: state.center
})

export default withRouter(connect(mapStateTopProps, mapDispatchTopProps)(NurseComponent));