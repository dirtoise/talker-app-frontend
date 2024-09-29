import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Card, Row, Col, Form, Button, Spinner, Placeholder } from "react-bootstrap";
import { useForm } from "react-hook-form";

const RequestComponent = ({socket}) =>{
    const navigate = useNavigate();
    const params = useParams();
    const {register, watch, handleSubmit, reset, formState:{errors}, setValue} = useForm();
    const [logged, authToken, currentUser, loading, setLoading, buttonLoading, setButtonLoading, submitConfirmRequest, submitDenyRequest, submitContactRequest, submitDeleteContact, submitUnarchive] = useOutletContext();
    const [requestList, setRequestList] = useState([]);
    const [requestedList, setRequestedList] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestedLoading, setRequestedLoading] = useState(false);
    
    const denyTrigger = async (data) =>{
        if(data.type === "request"){
            setRequestLoading(true);
            handleSubmit(submitDenyRequest(data));
            await importRequest({"user_name":params.user_name});
        };
        if(data.type === "requested"){
            setRequestedLoading(true);
            handleSubmit(submitDenyRequest(data));
            await importRequested({"user_name":params.user_name});
        }
    };
    const confirmTrigger = async (data) =>{
        setRequestedLoading(true);
        handleSubmit(submitConfirmRequest(data));
        await importRequested({"user_name":params.user_name});
    }
    const getRequests = async(user_name) =>{
        const data = await fetch(`/request/${user_name}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        return data;
    }
    const importRequest = async(data) =>{
        if(data.user_name !== currentUser){
            setLoading(true);
            navigate('/error');
            return;
        }
        const fetch = await getRequests(data.user_name);
        const fetchRequest = fetch.filter((request)=>request.contact_status === "request");
        const fetchRequestList = [...fetchRequest.map((request)=>request.contactuser_relationship)];
        setRequestList(fetchRequestList);
        setRequestLoading(false);
    }
    const importRequested = async(data) =>{
        setRequestedLoading(true);
        if(data.user_name !== currentUser){
            setLoading(true);
            navigate('/error');
            return;
        }
        const fetch = await getRequests(data.user_name)
        const fetchRequested = fetch.filter((requested)=>requested.contact_status === "requested");
        const fetchRequestedList = [...fetchRequested.map((requested)=>requested.contactuser_relationship)];
        setRequestedList(fetchRequestedList);
        setRequestedLoading(false);
    }
    useEffect(()=>{
        try {
            setRequestLoading(true);
            importRequest({"user_name":params.user_name});
        } catch(error) {
            setRequestLoading(false);
            console.log(error);
        }
    }, [params]);
    useEffect(()=>{
        try {
            setRequestedLoading(true);
            importRequested({"user_name":params.user_name});
        } catch(error) {
            setRequestedLoading(false);
            console.log(error);
        }
    }, [params]);
    return (
        <>
            <Row>
                <Col md={3}>
                <Card className="rounded border-light" style={{ height: '40rem'}}>
                    <Card.Header className="border-light">
                        {requestLoading ? 
                        <>
                            <Row>
                                <Col md="auto">
                                    <Spinner animation="grow" variant="light"/> 
                                </Col>
                                <Col>
                                    <Placeholder className="my-1 ms-2" as="p" animation="glow">
                                        <Placeholder xs={9} bg="light"/>
                                    </Placeholder>
                                </Col>
                            </Row>
                        </>:
                        <>
                        <a href="" class="d-flex align-items-center mx-2 link-body-emphasis text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                            </svg>
                            <h4 className="my-1 ms-2">
                            Sent
                            </h4>
                        </a>
                        </>}
                    </Card.Header>  
                    {requestLoading ? 
                    <>
                        <div className="position-absolute start-50 top-50">
                            <Spinner animation="border" variant="light"/>
                        </div>
                    </>
                    :
                    <>
                        {requestList.length > 0 ?
                            <>
                            <Card.Body className="overflow-auto" >
                                {requestList.map((info, index) => 
                                    <>
                                        <Form id={'request_'+info.user_name}>
                                            <Row>
                                                <Col md={6}>
                                                    <Button variant="outline-light" className="text-start position-relative h-100 w-100" style={{border:'none'}} onClick={()=>{navigate(`/${info.user_name}/profile`)}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                                        </svg>
                                                        <span className="px-1">
                                                            {info.user_name}
                                                        </span>
                                                    </Button>
                                                </Col>
                                                <Col md="auto">
                                                    <Row>
                                                        <Col md="auto">
                                                        <Button id={'requestDel_'+index} variant="outline-light" className="py-3 px-2" style={{border:'none'}} disabled={buttonLoading} onClick={(e)=>denyTrigger({"user_name":info.user_name, "type":"request"})}>

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                                            </svg>
                                                        </Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <hr/>
                                        </Form>
                                    </>
                                )} 
                            </Card.Body>
                            </>
                        : 
                            <>
                                <div className="text-center">
                                    <div className="ptC-3"></div>
                                    <div className="ptC-3"></div>
                                    <Col md={12}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-question" viewBox="0 0 16 16">
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                                        </svg>
                                    </Col>
                                    <Col md={12}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                        </svg>
                                    </Col>
                                    <div className="ptC-3"></div>
                                    <Col md={12}>
                                        <h3 className="text-muted">None sent</h3>
                                    </Col>
                                </div>
                            </>}  
                    </>}
                </Card> 
                </Col>
                <Col md={3}>
                <Card className="rounded border-light" style={{ height: '40rem'}}>
                    <Card.Header className="border-light">
                        {requestedLoading ? 
                        <>
                            <Row>
                                <Col md="auto">
                                    <Spinner animation="grow" variant="light"/> 
                                </Col>
                                <Col>
                                    <Placeholder className="my-1 ms-2" as="p" animation="glow">
                                        <Placeholder xs={9} bg="light"/>
                                    </Placeholder>
                                </Col>
                            </Row>
                        </>:
                        <>
                        <a href="" class="d-flex align-items-center mx-2 link-body-emphasis text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                            </svg>
                            <h4 className="my-1 ms-2">
                            Received
                            </h4>
                        </a>
                        </>}
                    </Card.Header>  
                    {requestedLoading ? 
                    <>
                        <div className="position-absolute start-50 top-50">
                            <Spinner animation="border" variant="light"/>
                        </div>
                    </>
                    :
                    <>
                        {requestedList.length > 0 ?
                        <>
                            <Card.Body className="overflow-auto" >
                                {requestedList.map((info, index) => 
                                <>
                                    <Form id={'requested_'+info.user_name}>
                                        <Row>
                                            <Col md={6}>
                                                <Button variant="outline-light" className="text-start position-relative h-100 w-100" style={{border:'none'}}  onClick={()=>{navigate(`/${info.user_name}/profile`)}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                                    </svg>
                                                    <span className="px-1">
                                                        {info.user_name}
                                                    </span>
                                                </Button>
                                            </Col>
                                            <Col md="auto">
                                                <Row>
                                                    <Col md="auto">
                                                    <Button id={'requestConf_'+index} variant="outline-light" className="py-3 px-2" style={{border:'none'}} disabled={buttonLoading} onClick={(e)=>confirmTrigger({"user_name":info.user_name, "type":"requested"})}>
    
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                                        </svg>
                                                    </Button>
                                                    </Col>
                                                    <Col md="auto">
                                                    <Button id={'requestedDel_'+index} variant="outline-light" className="py-3 px-2" style={{border:'none'}} disabled={buttonLoading} onClick={(e)=>denyTrigger({"user_name":info.user_name, "type":"requested"})}>
   
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                                        </svg>
                                                    </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <hr/>
                                    </Form>
                                </>
                                )}
                            </Card.Body>
                        </>
                        : 
                        <>
                            <div className="text-center">
                                <div className="ptC-3"></div>
                                <div className="ptC-3"></div>
                                <Col md={12}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-question" viewBox="0 0 16 16">
                                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                                    </svg>
                                </Col>
                                <Col md={12}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                        <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                                    </svg>
                                </Col>
                                <div className="ptC-3"></div>
                                <Col md={12}>
                                    <h3 className="text-muted">None received</h3>
                                </Col>
                            </div>
                        </>}  
                    </>}
                </Card> 
                </Col> 
            </Row>
        </>
    )
}
export default RequestComponent