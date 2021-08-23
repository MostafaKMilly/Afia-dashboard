import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { Col, Container, Row, Toast, Image } from 'react-bootstrap'
import ErrorAlert from '../helpers/ErrorAlert';
import { baseUrl } from '../shared/baseUrl';
import Loading from './Loading';
function Logs(props) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [logs, setLogs] = useState([])
    const [logsIsLoading, setLogsIsLoading] = useState(true)
    const [logsErrMess, setLogsErrMes] = useState()

    const getLogs = () => {
        fetch(baseUrl + 'api/log', {
            method: "GET",
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
            .then((logs) => {
                logs.reverse()
                setLogs(logs)
                setLogsIsLoading(false)
            })
            .catch((error) => {
                setLogsErrMes(error.message)
                setLogsIsLoading(false)
            })
    }
    useEffect(() => {
        getLogs()
    }, [])

    if (logsIsLoading) {
        return <Loading />
    }
    if (logsErrMess) {
        return <ErrorAlert messege={logsErrMess} />
    }
    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const logsList = logs.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(logs.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }
    const getColor = (type) => {
        if (type === "Nurse") {
            return (<div className="me-2 bg-primary"
                style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "2px 2px 2px 2px"
                }}></div >)
        }
        else if (type === "Admin") {
            return (<div className="me-2 bg-dark"
                style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "2px 2px 2px 2px"
                }}></div >)
        }
        else if (type === "Patient") {
            return (<div className="me-2 bg-warning"
                style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "2px 2px 2px 2px"
                }}></div >)
        }
        else if (type === "Doctor") {
            return (<div className="me-2 bg-success"
                style={{
                    width: "15px",
                    height: "15px",
                    borderRadius: "2px 2px 2px 2px"
                }}></div >)
        }
        else {
            return <></>
        }
    }
    return (
        <Container>
            <Row className="pb-4">
                <Col md={12} xs={12} className="text-center mt-4 mb-4">
                    <Image src="assets\images\logo (1).svg" width="170" height="170" fluid />
                </Col>
                <Col style={{ textAlign: "-webkit-center" }} className="mt-4">

                    {logsList.map((log) => (
                        <Toast className='text-center'>
                            <Toast.Header closeButton={false}>
                                {getColor(log.type)}
                                <strong className="me-auto">{log.type}</strong>
                                <small className="text-muted">{log.date}</small>
                            </Toast.Header>
                            <Toast.Body>{log.message}</Toast.Body>
                        </Toast>
                    ))}
                    <center style={{ overflow: "auto", maxWidth: "40%", overflowY: "hidden" }} className="mt-4">
                        <div className="text-center">
                            <Pagination className="mb-0">{items}</Pagination>
                        </div>
                    </center>
                </Col>
            </Row>
        </Container>
    );
}

export default Logs;