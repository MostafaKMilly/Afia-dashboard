/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import { Col, Container, Row, Toast, Image } from 'react-bootstrap'
import { Control, LocalForm } from 'react-redux-form';
import ErrorAlert from '../helpers/ErrorAlert';
import { baseUrl } from '../shared/baseUrl';
import Loading from './Loading';
function Reviews(props) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [reviews, setReviews] = useState([])
    const [reviewsIsLoading, setReviewsIsLoading] = useState(true)
    const [reviewsErrMess, setReviewsErrMess] = useState()
    const [date, setDate] = useState()
    const [option, setOption] = useState("Select option")

    const getAllReviews = () => {
        fetch(baseUrl + 'api/review/', {
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
            .then((reviews) => {
                reviews.reverse()
                setReviews(reviews)
                setReviewsIsLoading(false)
            })
            .catch((error) => {
                setReviewsErrMess(error.message)
                setReviewsIsLoading(false)
            })
    }
    const getUnreadedReviews = () => {
        setReviewsIsLoading(true)
        fetch(baseUrl + 'api/review/un_readed', {
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
            .then((reviews) => {
                reviews.reverse()
                setReviews(reviews)
                setReviewsIsLoading(false)
            })
            .catch((error) => {
                setReviewsErrMess(error.message)
                setReviewsIsLoading(false)
            })
    }
    const getReadedReviews = () => {
        setReviewsIsLoading(true)
        fetch(baseUrl + 'api/review/readed', {
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
            .then((reviews) => {
                reviews.reverse()
                setReviews(reviews)
                setReviewsIsLoading(false)
            })
            .catch((error) => {
                setReviewsErrMess(error.message)
                setReviewsIsLoading(false)
            })
    }
    const patchReview = (values, reviewId) => {
        return fetch(baseUrl + 'api/review/id/' + reviewId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(values)
        })
            .then(response => {
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
        getAllReviews()
    }, [])

    if (reviewsIsLoading) {
        return <Loading />
    }
    const handleClick = (event) => {
        setCurrentPage(parseInt(event.target.id, 10))
    }
    const lastIndex = currentPage * itemsPerPage
    const firstIndex = lastIndex - itemsPerPage
    const reviewsList = reviews.slice(firstIndex, lastIndex)
    let items = []
    for (let i = 1; i <= Math.ceil(reviews.length / itemsPerPage); i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} id={i} onClick={handleClick}>
                {i}
            </Pagination.Item>
        )
    }

    const handleChangeSelect = (event) => {
        if (event.target.value === "Select option") {
            return
        }
        setReviewsErrMess(undefined)
        setOption(event.target.value)
        setDate('')
        if (event.target.value === "Unreaded reviews") {
            getUnreadedReviews()
        }
        else if (event.target.value === "Readed reviews") {
            getReadedReviews()
        }
    }

    const handleChangeDate = (event) => {
        setReviewsErrMess(undefined)
        setOption("Select option")
        setDate(event.target.value)
        const arr = reviews.filter((review) => review.date === event.target.value)
        if (arr.length === 0) {
            setReviewsErrMess("there are no reviews in this date")
            return
        }
        setReviews(arr)
    }
    const handleGetAllReviews = () => {
        setReviewsErrMess(undefined)
        setOption("Select option")
        setDate('')
        getAllReviews()
    }
    const markAsReaded = (reviewId) => {
        patchReview({ readed: true }, reviewId)
        .then(() => {
            if (option === "Unreaded reviews") {
                getUnreadedReviews()
            }
            else if (option === "Readed reviews") {
                getReadedReviews()
            }
            else {
                let arr = [...reviews]
                let index = reviews.findIndex((review) => review.id === reviewId)
                arr[index] = {...arr[index] , readed :true}
                setReviews(arr)
            }
        })
        .catch((error) => alert(error.message))
       
    }
    const markAsUnReaded = (reviewId) => {
        patchReview({ readed: false }, reviewId)
        .then(() => {
            if (option === "Unreaded reviews") {
                getUnreadedReviews()
            }
            else if (option === "Readed reviews") {
                getReadedReviews()
            }
            else {
                let arr = [...reviews]
                let index = reviews.findIndex((review) => review.id === reviewId)
                arr[index] = {...arr[index] , readed :false}
                setReviews(arr)
            }
        })
        .catch((error) => alert(error.message))
        
    }
    return (
        <Container>
            <Row className="pb-4">
                <Col md={12} xs={12} className="text-center mt-5 mb-4">
                    <Image src="assets\images\undraw_reviews_lp8w.svg" className="mt-1" width="170" height="170" fluid />
                </Col>


                <LocalForm model="dateFilter" className="mt-md-2 mb-md-2">
                    <Row className="justify-content-md-center">
                        <Col className="col-12 col-md-auto mb-2 mb-mb-0">
                            <Control type="date" onChange={handleChangeDate} value={date} model=".date" className="form-control" />
                        </Col>
                        <Col className="col-12 col-md-auto mb-2 mb-mb-0">
                            <Control.select value={option} onChange={handleChangeSelect} className="form-select" model=".options">
                                <option>Select option</option>
                                <option>Unreaded reviews</option>
                                <option>Readed reviews</option>
                            </Control.select>
                        </Col>
                        <Col className="col-12 col-md-1 mt-3 mb-2 mb-md-0 mt-md-0 pe-md-1 align-self-center text-center text-md-left">

                            <button className="submitButton" onClick={handleGetAllReviews}>

                                <span className="fa fa-stream ms-2 me-2 d-inline"></span>All

                            </button>

                        </Col>
                    </Row>
                </LocalForm>

                <Col style={{ textAlign: "-webkit-center" }} className="mt-4 col-12">
                    {!reviewsErrMess ? reviewsList.map((review) => (
                        <Toast className='text-center' key={review.id}>
                            <Toast.Header closeButton={false}>
                                <div className="me-2 bg-warning"
                                    style={{
                                        width: "15px",
                                        height: "15px",
                                        borderRadius: "2px 2px 2px 2px"
                                    }}></div >
                                <strong className="me-auto">{review.patient.firstName + ' ' + review.patient.lastName}</strong>
                                <small className="text-muted mt-1 me-1">{review.date}</small>
                                {
                                    review.readed ? <span className="fa fa-envelope-open ms-2 fa-lg " type="button" onClick={() => markAsUnReaded(review.id)}></span> :
                                    <span className="fa fa-envelope ms-2 fa-lg mt-1" type="button" onClick={() => markAsReaded(review.id)}></span>
                                }
                            </Toast.Header>
                            <Toast.Body>{review.message}</Toast.Body>
                        </Toast>
                    )) : <ErrorAlert messege={reviewsErrMess} />}
                    {!reviewsErrMess ?
                        <center style={{ overflow: "auto", maxWidth: "40%", overflowY: "hidden" }} className="mt-4">
                            <div className="text-center">
                                <Pagination className="mb-0">{items}</Pagination>
                            </div>
                        </center> : <></>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default Reviews;