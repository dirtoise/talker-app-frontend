import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles.css';
import {Row, Col, Card, Button, Dropdown, DropdownToggle, Spinner, Placeholder, Modal} from 'react-bootstrap';
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const ContactComponent = ({socket, importContactMessages, room, setRoom, enterRoom, messageLoading, setMessageLoading, setMessages}) => {
    const params = useParams();
    const navigate = useNavigate();
    const [logged, authToken, currentUser, loading, setLoading, buttonLoading, setButtonLoading, submitConfirmRequest, submitDenyRequest, submitContactRequest, submitDeleteContact, submitUnarchive] = useOutletContext();
    const {handleSubmit, formState:{errors}} = useForm();
    
    const [show, setShow] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [contactsInfo, setContactsInfo] = useState([]);
    const archiveContact = async (data) => {
        const body = {
            current_username : currentUser,
            contact_username: data.user_name,
            status: "archive",
        }
        const requestOptions = {
            method:"PUT",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(body)
        }
        await fetch(`/contact/${data.user_name}/archive`, requestOptions)
        .then(res => res.json())
        .catch(err => console.log(err))
        setLoading(false);
    };
    const archiveTrigger = async(data) =>{
        setLoading(true);
        handleSubmit(archiveContact(data));
        await importContact({"user_name":params.user_name});
        navigate(`/${params.user_name}/archive`);
    }
    const deleteTrigger = async(data) =>{
        setLoading(true);
        handleSubmit(submitDeleteContact(data));
        await importContact({"user_name":params.user_name});
        window.location.reload();
        setShow(false);
    }
    const getContact = async(user_name) =>{
        const data = await fetch(`/contact/${user_name}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        return data;
    }
    const importContact = async(data) =>{
        if(data.user_name !== currentUser){
            setLoading(true);
            navigate('/error');
            return;
        }
        const fetch = await getContact(data.user_name);
        const contact = await fetch.filter((data)=>data.contact_status === "contact");
        setContacts(contact);
        const contactInfo = [...contact.map((contact)=>contact.contactuser_relationship)];
        setContactsInfo(contactInfo);
        setLoading(false);
    }
    useEffect(()=>{
        try {
            setLoading(true);
            importContact({"user_name":params.user_name});
        } catch(error) {
            setLoading(false);
            console.log(error);
        }
    }, [params]);
    
      return (
        <> 
        <Card className="rounded border-light" style={{ height: '40rem' }}>
            <Card.Header className="border-light">
                {loading ? 
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
                    <a href="/" class="d-flex align-items-center mx-2 link-body-emphasis text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-chat-left-dots-fill" viewBox="0 0 16 16">
                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                        <h4 className="my-1 ms-2">
                        Contacts
                        </h4>
                    </a>
                </>}
            </Card.Header>  
            <Card.Body className="overflow-auto">
                {loading ? 
                    <>
                        <Row>
                            <Col md="auto" className="mx-3 py-2">
                                <Spinner animation="grow" variant="light"/> 
                            </Col>
                            <Col>
                                <Placeholder className="my-2" as="p" animation="glow">
                                    <Placeholder xs={9} bg="light"/>
                                </Placeholder>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="auto" className="mx-3 py-2">
                                <Spinner animation="grow" variant="light"/> 
                            </Col>
                            <Col>
                                <Placeholder className="my-2" as="p" animation="glow">
                                    <Placeholder xs={9} bg="light"/>
                                </Placeholder>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="auto" className="mx-3 py-2">
                                <Spinner animation="grow" variant="light"/> 
                            </Col>
                            <Col>
                                <Placeholder className="my-2" as="p" animation="glow">
                                    <Placeholder xs={9} bg="light"/>
                                </Placeholder>
                            </Col>
                        </Row>
                        <hr />
                    </> 
                    : 
                    <>
                        {contactsInfo.length === 0 ? 
                            <>
                                <div id="no_contact" className="text-center">
                                    <div className="ptC-3"></div>
                                    <div className="ptC-3"></div>
                                    <Col md={12}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-question" viewBox="0 0 16 16">
                                            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                                        </svg>
                                    </Col>
                                    <Col md={12}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-raised-hand" viewBox="0 0 16 16">
                                            <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a1 1 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207"/>
                                            <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                        </svg>
                                    </Col>
                                    <div className="ptC-3"></div>
                                    <Col md={12}>
                                        <h3 className="text-muted">No contacts</h3>
                                    </Col>
                                </div>
                            </>
                            :
                            <>
                                {contactsInfo.map((contact, index) => (
                                    <>
                                        <Row id={`options_${index}`}>
                                            <Col md={2}>
                                                <Dropdown className="h-100" drop={"end"}>
                                                    <DropdownToggle id={'contactdrop_'+index} variant="outline-light" className="h-100" style={{border:'none'}}>
                                                    </DropdownToggle>
                                                    <Dropdown.Menu className="border-light">
                                                        <Dropdown.Item onClick={()=>{archiveTrigger({"user_name":contact.user_name})}} className="py-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-archive me-2" viewBox="0 0 16 16">
                                                                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                                            </svg>
                                                            Archive contact
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>{setShow(true);}} className="py-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash me-2" viewBox="0 0 16 16">
                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                            </svg>
                                                            
                                                            Delete contact
                                                            </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Modal size="sm" centered show={show} onHide={()=>setShow(false)}>
                                                    <Modal.Body>
                                                        <div className="text-center py-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-person-x" viewBox="0 0 16 16">
                                                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708"/>
                                                            </svg>
                                                        </div>
                                                        <h4>
                                                            Remove {contact.user_name} from your contacts?
                                                        </h4>
                                                        <hr />
                                                        <div className="d-grid gap-2 pb-3">
                                                            <Button onClick={()=>{deleteTrigger({"user_name":contact.user_name});}} disabled={buttonLoading} variant="outline-danger">
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
                                            </Col>
                                            <Col md={8}>
                                                <div class="d-grid gap-4">
                                                    <Button id={'contacttoggle_'+index} variant="outline-light" className="text-start position-relative" type="radio" style={{border:'none'}} active={false} onClick={(e)=>{setMessageLoading(true);importContactMessages(contact.user_name);enterRoom({'user_name': contact.user_name,'room':contacts[index].contact_room});}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                                        </svg>
                                                        <span className="px-1">
                                                            {contact.user_name}
                                                        </span>
                                                        <span id={`notif_${contact.user_name}`} >
                                                        </span>
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr/>
                                    </>
                                ))}
                            </>
                        }
                    </>}
            </Card.Body>
        </Card>        
        </>
    )
}
export default ContactComponent