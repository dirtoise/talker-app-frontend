import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Card, Row, Col, Form, Dropdown, DropdownToggle, Button, Spinner, Placeholder } from "react-bootstrap";
import { useForm } from "react-hook-form";

const ArchiveComponent = ({socket}) =>{
    const [logged, authToken, currentUser, loading, setLoading, buttonLoading, setButtonLoading, submitConfirmRequest, submitDenyRequest, submitContactRequest, submitDeleteContact, submitUnarchive] = useOutletContext();
    const [archiveList, setArchiveList] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const { handleSubmit } = useForm();
    const unarchiveTrigger = async (data) =>{
        setLoading(true);
        handleSubmit(submitUnarchive(data));
        await importArchive({"user_name":params.user_name});
        navigate(`/${params.user_name}/messages`);
    }
    const getArchive = async(user_name) =>{
        const data = await fetch(`/contact/${user_name}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        return data;
    }
    const importArchive = async(data) =>{
        if(data.user_name !== currentUser){
            setLoading(true);
            navigate('/error');
            return;
        }
        const fetch = await getArchive(data.user_name);
        const archive = await fetch.filter((data)=>data.contact_status === "archive");
        const archiveList = [...archive.map((archive)=>archive.contactuser_relationship)];
        setArchiveList(archiveList);
        setLoading(false);
    }
    useEffect(()=>{
        try {
            setLoading(true);
            importArchive({"user_name":params.user_name});
        } catch(error) {
            setLoading(false);
            console.log(error);
        }
    }, [params]);
    return (
        <>
            <Col md={3}>
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
                            </>
                            :
                            <>
                            <a href="/" class="d-flex align-items-center mx-2 link-body-emphasis text-decoration-none" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                                    <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"/>
                                </svg>
                                <h4 className="my-1 ms-2">
                                Archived Contacts
                                </h4>
                            </a>
                        </>}
                    </Card.Header>  
                    <Card.Body className="overflow-auto" >
                        {loading ? 
                        <>
                            <div className="position-absolute start-50 top-50">
                                <Spinner animation="border" variant="light"/>
                            </div>
                        </>
                        :
                        <>
                            {archiveList.length > 0 ? 
                                <>
                                    {archiveList.map((info, index) => 
                                        info.user_name === currentUser ? (<></>):
                                    (
                                        <Form>
                                            <Row>
                                                <Col md={2}>
                                                    <Dropdown className="h-100" drop={"end"}>
                                                        <DropdownToggle id={'contactdrop_'+index} variant="outline-light" className="h-100" style={{border:'none'}}>
                                                        </DropdownToggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item className="py-2" onClick={()=>{unarchiveTrigger({"user_name":info.user_name})}}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-archive me-2" viewBox="0 0 16 16">
                                                                    <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                                                </svg>
                                                                Unarchive contact
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                                <Col md={8}>
                                                    <div class="d-grid gap-4">
                                                        <Button id={'contacttoggle_'+index} variant="outline-light" className="text-start position-relative" style={{border:'none'}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                                            </svg>
                                                            <span className="px-1">
                                                                {info.user_name}
                                                            </span>
                                                            <span id={`notif_${info.user_name}`} >
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr/>
                                        </Form>
                                    ))}
                                </>:
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                                                <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"/>
                                            </svg>
                                        </Col>
                                        <div className="ptC-3"></div>
                                        <Col md={12}>
                                            <h3 className="text-muted">Nothing archived</h3>
                                        </Col>
                                    </div>
                                </>}
                        </>}
                    </Card.Body>
                </Card> 
            </Col>    
        </>
    )
}
export default ArchiveComponent