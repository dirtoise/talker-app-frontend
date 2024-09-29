import React, { useEffect, useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles.css';
import { Row, Col, Card, Accordion, Spinner, Placeholder } from 'react-bootstrap';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ContactComponent from "./contact";
import MessageMainComponent from "./messageMain";

const MessageMasterComponent = ({socket}) => {
    const navigate = useNavigate();
    const params = useParams();
    const {register, watch, handleSubmit, trigger, formState:{errors}} = useForm();
    const [logged, authToken, currentUser, loading, setLoading] = useOutletContext();

    const [messages, setMessages] = useState([]);
    const [specificContact, setSpecificContact] = useState([]);
    const [currentId, setCurrentId] = useState();
    const [room, setRoom] = useState("");
    const [roomState, setRoomState] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);

    const inputRef = useRef(null);
    const inputRest =  register('user_message', {required:true, maxLength:500, type:'text'});

    const getUserInfo = async (user_name) => {
        const data = await fetch(`/user/${user_name}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        return data;
    };
    const contactMessages = async (contact_name) => {
        const data = await fetch(`/message/${params.user_name}/${contact_name}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        return data;
    };
    const importContactMessages = async (contact_name) => {
        const data = await contactMessages(contact_name);
        const userData = await getUserInfo(params.user_name);
        setSpecificContact(contact_name);
        setMessages([...data]);
        setCurrentId(userData.user_id);
        setMessageLoading(false);
    };
    const enterRoom = async (data) => {
        setRoom(data.room);
        if (!roomState){
            setRoomState(!roomState);
        }
        await socket.emit("join_room", data);
    }
    const createNewMessage = (messageData) => {
        const messageBody = document.getElementById("toAppend");
        const messageWrapper = document.createElement("div");
        const newMessage = document.createElement("div");
        messageWrapper.id = messages.length + 1 + "_sender";
        messageWrapper.className = messageData.currentUser === currentUser ? "d-flex justify-content-end w-100 p-1": "d-flex justify-content-start w-100 p-1";

        newMessage.id = messages.length + 1;
        newMessage.className = messageData.currentUser === currentUser ? "rounded text-start py-1 px-2 bg-primary fs-6 w-auto text-light": "rounded text-start py-1 px-2 bg-secondary fs-6 w-auto text-light";
        newMessage.style.maxWidth = '50.8%';

        newMessage.appendChild(document.createTextNode(messageData.currentMessage));
        messageWrapper.appendChild(newMessage);
        if(messageBody){
            {/** BELOW DOESNT WORK IF CONTACT IS ??? KNOWN BUG BELOW. MIGHT BE FIXED */}
            messageBody.appendChild(messageWrapper).scrollIntoView({ behavior: 'auto' });
        }
    }
    const sendMessage = async(messageData) => {
        destroyNotif(messageData.specificContact);
        socket.emit('send_message', messageData);
        socket.emit('send_notif', messageData);
    }  
    const destroyWhenSend = async () =>{
        const docu = document.getElementById("toDestroy");
        if(docu){
            docu.replaceChildren();
        }
    }
    const destroyNotif = async (elementID) =>{
        const docu = document.getElementById(`notif_${elementID}`);
        if(docu && docu.hasChildNodes()){
            docu.replaceChildren();
        }
    }
    useEffect(()=>{
        socket.on('join_room', async (data) => {
            setRoom(data.room);
        });
        return ()=>{
            socket.off('join_room');
        }
    })
    useEffect(()=>{
        socket.on('receive_message', (data) => {
        if(room === data.room){ 
                createNewMessage(data);
                destroyWhenSend();
            }
        });
        return ()=>{
            socket.off('receive_message');
        }
    })
    useEffect(()=>{
        socket.on('receive_notif', (data)=>{
            const contactBody = document.getElementById(`notif_${data.user_name}`);
            const createAlert = document.createElement('span');
            const hiddenAlert = document.createElement('span');
            hiddenAlert.setAttribute('class', 'visually-hidden');
            createAlert.setAttribute('class', 'position-absolute top-0 start-0 translate-middle p-2 bg-danger rounded-circle')
            createAlert.appendChild(hiddenAlert);
            if(contactBody){
                destroyNotif(data.user_name);
                contactBody.appendChild(createAlert);
            }
        });
        return ()=>{
            socket.off('receive_notif');
        }
    })
    return (
        <>
            <Row>
                <Col sm={3}>
                    <ContactComponent socket={socket} importContactMessages={importContactMessages} room={room} setRoom={setRoom} enterRoom={enterRoom} messageLoading={messageLoading} setMessageLoading={setMessageLoading} setMessages={setMessages}/>
                </Col>
                {roomState ? 
                    <>
                        <Col sm={6} id="messageMain">
                            <MessageMainComponent currentUser={currentUser} socket={socket} senderId={currentId} messages={messages} specificContact={specificContact} room={room} sendMessage={sendMessage} destroyWhenSend={destroyWhenSend} destroyNotif={destroyNotif} messageLoading={messageLoading}/>
                        </Col>
                        <Col sm={3} id="messageProfile">
                            <Card className="rounded border-light" style={{ height: '40rem' }}>
                                <Card.Body className="overflow-auto">
                                    <div className='text-center p-3'>
                                    {messageLoading ? 
                                        <>
                                            <div className="py-2">
                                                <Spinner animation="grow" variant="light" />
                                            </div>
                                            <Placeholder className="py-2" as="p" animation="glow">
                                                <Placeholder xs={6} bg="light"/>
                                            </Placeholder>
                                            <div className='py-2 w-100'>
                                                <Placeholder as="p" animation="glow">
                                                    <Placeholder xs={11} bg="light"/>
                                                </Placeholder>
                                                <Placeholder as="p" animation="glow">
                                                    <Placeholder xs={11} bg="light"/>
                                                </Placeholder>
                                                <Placeholder as="p" animation="glow">
                                                    <Placeholder xs={11} bg="light"/>
                                                </Placeholder>
                                            </div>
                                        </> 
                                        : 
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                            </svg>
                                            <h3> {specificContact} </h3>
                                            <div className='p-3'>
                                                <div className="list-group list-group-flush rounded w-100">
                                                    <Accordion defaultActiveKey={0} href='#' className="p-3 list-group-item list-group-item-action" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>
                                                                <span className="list-item" id="list-item">
                                                                    Option 1
                                                                </span>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                                aliquip ex ea commodo consequat.
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="1">
                                                            <Accordion.Header>
                                                                <span className="list-item" id="list-item">
                                                                    Option 2
                                                                </span>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                                aliquip ex ea commodo consequat.
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="2">
                                                            <Accordion.Header>
                                                                <span className="list-item" id="list-item">
                                                                    Option 3
                                                                </span>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                                aliquip ex ea commodo consequat.
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                </div>
                                            </div>
                                    </>}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>  
                    </>                             
                :
                    <>
                    </>
                }
            </Row>
        </>
    )
}
export default MessageMasterComponent