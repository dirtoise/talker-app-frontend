import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles.css';
import { Button, Row, Col, Form, InputGroup, Card, OverlayTrigger, Tooltip, Spinner, Modal} from 'react-bootstrap';
import { useOutletContext, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";

const ProfileComponent = ({socket}) => {
    const params = useParams();
    const {register, watch, handleSubmit, reset, formState:{errors}, setValue} = useForm();
    const [logged, authToken, currentUser, loading, setLoading, buttonLoading, setButtonLoading, submitConfirmRequest, submitDenyRequest, submitContactRequest, submitDeleteContact, submitUnarchive] = useOutletContext();
    const [profileInfo, setProfileInfo] = useState([]);
    const [profileContact, setProfileContact] = useState([]);
    const [profileState, setProfileState] = useState("");
    const [show, setShow] = useState(false);
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          {props}
        </Tooltip>
        );
    const profileButtonState = () =>{
        if(profileState === "request"){
            return(
                <>
                    <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Cancel request')}>
                    <Button variant="outline-danger" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => {setProfileState("");handleSubmit(submitDenyRequest({"user_name":params.user_name}));}}>
                        {buttonLoading ? 
                        <>
                            <Spinner animation="border" variant="light" size="sm"/> 
                        </>
                        :<>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
                        </svg>
                        </>}
                    </Button>
                    </OverlayTrigger>
                </>)
        }else if(profileState === "requested"){
            return(
                <>
                    <Row>
                        <Col>
                            <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Accept request')}>
                            <Button variant="outline-success" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => {setProfileState("contact");handleSubmit(submitConfirmRequest({"user_name":params.user_name}));}}>
                                {buttonLoading ? 
                                <>
                                    <Spinner animation="border" variant="light" size="sm"/> 
                                </>
                                :
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                </svg>
                                </>}
                            </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Deny request')}>
                            <Button variant="outline-danger" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => {setProfileState("");handleSubmit(submitDenyRequest({"user_name":params.user_name}));}}>
                                {buttonLoading ? 
                                <>
                                    <Spinner animation="border" variant="light" size="sm"/> 
                                </>
                                :
                                <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                </svg>
                                </>}
                            </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </>)
        } else if(profileState === "archive"){
            return(
                <>
                    <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Unarchive user')}>
                    <Button variant="outline-secondary" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => {setProfileState("contact");handleSubmit(submitUnarchive({"user_name":params.user_name}));}}>
                    {buttonLoading ? 
                    <>
                        <Spinner animation="border" variant="light" size="sm"/> 
                    </>
                    :
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
                            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        </>}
                    </Button>
                    </OverlayTrigger>
                </>
            )
        } else if(profileState === "blocked"){
            return(
                <>
                    <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Unblock user')}>
                    <Button variant="outline-danger" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => setProfileState("")}>
                        {buttonLoading ? 
                        <>
                            <Spinner animation="border" variant="light" size="sm"/> 
                        </>
                        :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ban" viewBox="0 0 16 16">
                                <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/>
                            </svg>
                        </>}
                    </Button>
                    </OverlayTrigger>
                </>
            )
        } else if(profileState === "contact"){
            return(
                <>
                    <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Remove contact')}>
                    <Button variant="outline-secondary" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => {setShow(true);}}>
                    {buttonLoading ? 
                    <>
                        <Spinner animation="border" variant="light" size="sm"/> 
                    </>
                    :
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-dash" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                        </svg>
                    </>}
                    </Button>
                    </OverlayTrigger>
                    
                    <Modal size="sm" centered show={show} onHide={()=>setShow(false)}>
                        <Modal.Body>
                            <div className="text-center py-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-person-x" viewBox="0 0 16 16">
                                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708"/>
                                </svg>
                            </div>
                            <h4>
                                Remove {params.user_name} from your contacts?
                            </h4>
                            <hr />
                            <div className="d-grid gap-2 pb-3">
                                <Button onClick={()=>{setProfileState("");handleSubmit(submitDeleteContact({"user_name":params.user_name}));setShow(false);}} disabled={buttonLoading} variant="outline-danger">
                                {buttonLoading ?
                                    <>
                                        <Spinner animation="border" variant="light" size="sm"/> 
                                    </>
                                    :
                                    <>
                                        Confirm
                                    </>}
                                </Button>
                            </div>
                            <div className="d-grid gap-2">
                                <Button onClick={()=>{setShow(false);}} variant="outline-light">Close</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            )
        } else {
            return(
                <>
                    <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Add as contact')}>
                    <Button variant="outline-primary" className="py-1 mx-1" disabled={buttonLoading} onClick={(e) => {setProfileState("request");handleSubmit(submitContactRequest({"user_name":params.user_name}));}}>
                        {buttonLoading ? 
                        <>
                            <Spinner animation="border" variant="light" size="sm"/> 
                        </>
                        :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                            </svg>
                        </>}
                    </Button>
                    </OverlayTrigger>
                </>
            )
        }
    }
    const getProfile = async(user_name) =>{
        const data = await fetch(`/user/${user_name}`)
        .then(res=>res.json())
        .catch(err=>console.log(err))
        return data;
    }
    const importProfile = async(user_name) =>{
        const fetch = await getProfile(user_name);
        setProfileInfo([fetch]);
    }
    const getRequestConfirm = async(user_name, other_user_name) =>{
        const data = await fetch(`/contact/confirm/${user_name}/${other_user_name}`)
        .then(res=>res.json())
        .catch(err=>console.log(err))
        return data;
    }
    const importRequestConfirm = async(user_name, other_user_name) =>{
        const fetch = await getRequestConfirm(user_name, other_user_name);
        let status = "";
        console.log(fetch);
        if(fetch.length > 0){
            status = fetch[0].contact_status;
        }
        setProfileContact(fetch);
        setProfileState(status);
        setLoading(false);
    }
    useEffect(()=>{
        try {      
            setLoading(true); 
            importProfile(params.user_name);
            importRequestConfirm(currentUser, params.user_name)
        } catch(error) {
            setLoading(false);
            console.log(error);
        }
        }, [params]);
    return(
        <>
            <div className="position-absolute top-50 start-50 translate-middle">
                {loading ? 
                <>
                    <Spinner animation="border" variant="light"/> 
                </>
                :
                <>
                    <Row>
                        <Col className="text-center py-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" fill="currentColor" class="bi bi-person-badge-fill" viewBox="0 0 16 16">
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z"/>
                            </svg>
                        </Col>
                        <Col>
                            <Form>
                                <Card className="border-light w-100 mx-auto">
                                    <Card.Body className='grid row-gap-3'>
                                        <Row>
                                            <Col className="text-start">
                                                {currentUser === params.user_name ? 
                                                <></>:
                                                <>
                                                {profileButtonState()}
                                                </>}
                                            </Col>
                                            <Col className="text-end">
                                                {currentUser === params.user_name ? 
                                                <>                                                                
                                                <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Edit profile')}>
                                                <Button variant="outline-secondary" className="py-1 mx-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                    </svg>
                                                </Button>
                                                </OverlayTrigger>

                                                <OverlayTrigger placement="right" delay={{ show:250, hide: 0 }} overlay={renderTooltip('Delete profile')}>
                                                <Button variant="outline-danger" className="py-1 mx-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                                    </svg>
                                                </Button>
                                                </OverlayTrigger>
                                                </>:<></>}
                                            </Col>
                                        </Row>
                                        {profileInfo && 
                                        <>
                                        {profileInfo.map((info,index) => (
                                            <>
                                                <Row className="p-2">
                                                    <Form.Group as={Col} controlId="usernameDetail">
                                                        <Form.Label>Username</Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className="border-light">@</InputGroup.Text>
                                                            <Form.Control type="text" className="border-light" value={info.user_name} placeholder="Username..." name="user_name" readOnly/>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    {currentUser === params.user_name ? 
                                                    <>
                                                    <Form.Group as={Col} controlId="emailDetail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control type="email" className="border-light" value={info.user_email} placeholder="Sample@mail.com..." name="user_email" readOnly/>
                                                    </Form.Group>
                                                    </>:<></>}
                                                </Row>
                                                <Row className="p-2">
                                                    <Form.Group as={Col} controlId="firstnameDetail">
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control type="text" className="border-light" placeholder="Firstname..." value={info.user_firstname} name="user_firstname" readOnly/>
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="lastnameDetail">
                                                        <Form.Label>Last Name</Form.Label>
                                                        <Form.Control type="text" className="border-light" placeholder="Lastname..." value={info.user_lastname} name="user_lastname" readOnly/>
                                                    </Form.Group>
                                                </Row>
                                                
                                                {currentUser === params.user_name ? 
                                                <>
                                                <Form.Group controlId="addressDetail" className="p-2">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control type="text" className="border-light" placeholder="Address..." value={info.user_lastname} name="user_address" readOnly/>
                                                </Form.Group>
                                                </>:<></>}
                                            </>
                                        ))}</>}
                                    </Card.Body>
                                </Card>
                            </Form>
                        </Col>
                    </Row>
                </>}
            </div>
        </>
    )
}
export default ProfileComponent;
