import React, { useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles.css';
import { Button, Form, Row, Col, InputGroup, Card, Spinner, Placeholder } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";

const MessageMainComponent = ({currentUser, socket, senderId, messages, specificContact, room, sendMessage, destroyWhenSend, destroyNotif, messageLoading}) => {
    const {register, handleSubmit, trigger, formState:{errors}} = useForm();
    const params = useParams();
    const inputRef = useRef(null);
    const inputRest =  register('user_message', {required:true, maxLength:500, type:'text'});

    const messageEndRef = useRef(null);
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };
    {/** !!! */}
    const submitForm = async (data) => {
        document.getElementById("user_message").value="";
        const currentMessage = data.user_message;
        const body = {
            message : currentMessage,
            type : inputRef.current.type,
            message_sender: currentUser,
            message_sentto: specificContact,
        }
        const requestOptions = {
            method:"POST",
            headers:{
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }
        await fetch(`/message/${params.user_name}/${specificContact}`, requestOptions)
        .then(res => res.json())
        .then(sendMessage({room, currentUser, currentMessage, specificContact}))
        .then(scrollToBottom())
        .catch(err => console.log(err))
    }
    {/** !!! */}
    const handleUserKeyPress = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            destroyWhenSend();
            handleSubmit(submitForm)(); 
        }
    };
    useEffect(() => {
        scrollToBottom();
      }, [messages]);
    return (
        <>
            {specificContact === "" ? (<></>)
            :
                (
                <Card className="rounded border-light" style={{ height: '40rem' }}>
                    <Card.Header className="border-light">
                        {messageLoading ? 
                        <>
                            <Row>
                                <Col md="auto">
                                    <Spinner animation="grow"/> 
                                </Col>
                                <Col>
                                    <Placeholder className="my-1 ms-2" as="p" animation="glow">
                                        <Placeholder xs={4} bg="light"/>
                                    </Placeholder>
                                </Col>
                            </Row>
                        </>
                        :
                        <>
                            <h4 className="my-1 ms-2">
                                {specificContact}
                            </h4>
                        </>}
                    </Card.Header>
                    <Card.Body onClick={()=>{destroyNotif(specificContact)}} className="overflow-auto ">
                        {messageLoading ? 
                        <>
                            <div className="position-absolute start-50 top-50">
                                <Spinner animation="border" variant="light"/>
                            </div>
                        </>
                        :
                        <>
                            {messages.length === 0 ? 
                                <div className="text-center" >
                                    <div id="toDestroy">
                                        <Card.Title id="destroy" className="p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                            </svg>
                                        </Card.Title>
                                        <Card.Text className='fw-light'>
                                            Start your conversation with {specificContact}.
                                        </Card.Text>
                                    </div>
                                    <ul id={`toAppend`} className="list-unstyled">
                                    </ul>
                                </div>
                            : 
                                <div>
                                    <div id='messageBody'>
                                        <ul className="list-unstyled">
                                        {messages.map((message, index) => (
                                            (message.message_sender === senderId) ? 
                                                <li>
                                                    <div className='d-flex justify-content-end w-100 p-1' id={index + '_sender'}>
                                                        <div id={index} className='rounded text-end py-1 px-2 bg-primary fs-6 w-auto text-light' style={{ maxWidth: '50.8%'}}>
                                                            {message.message_message}
                                                        </div>
                                                    </div>
                                                </li>
                                            : 
                                                <li>
                                                    <div className='d-flex justify-content-start w-100 p-1' id={index + '_sentto'}>
                                                        <div id={index} className='rounded text-start py-1 px-2 bg-secondary fs-6 w-auto text-light' style={{ maxWidth: '50.8%'}}>
                                                            {message.message_message}
                                                        </div>
                                                    </div>
                                                </li>
                                        ))}
                                        </ul>
                                    </div>
                                    <div id="messageBodyTwo">
                                        <ul id={`toAppend`} className="list-unstyled">
                                        </ul>
                                    </div>
                                    <div ref={messageEndRef} />
                                </div>
                            }
                        </>}
                    </Card.Body>
                    <Card.Footer className="border-light">
                        <InputGroup id="user_form" className="mb-3">
                            <Button variant='outline-secondary' id="button-img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                </svg>
                            </Button>
                            <Button variant='outline-secondary' id="button-emoji">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                                </svg>
                            </Button>
                            <Form.Control name="user_name" value={currentUser}  {...register('user_name', {type:'text'})} hidden readOnly/>
                            <Form.Control id="user_message" placeholder="Write your message here..." {...inputRest} ref={(e)=> {inputRest.ref(e); inputRef.current = e;}} onKeyUp={handleUserKeyPress}  onClick={()=>{destroyNotif(specificContact)}}/>
                                
                            <Button variant='outline-secondary' onClick={handleSubmit(submitForm)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                                    <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
                                </svg>
                            </Button>
                        </InputGroup>
                    </Card.Footer>
                </Card>

            )}
        </>
    )
}
export default MessageMainComponent