import React, {useState, useRef, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { Form, InputGroup, Button, Spinner, ToastContainer, Toast, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from './auth';

const LoginComponent = ({socket}) => {
    const {register, handleSubmit, reset, formState:{errors}} = useForm();
    const navigate = useNavigate();
    
    const userPasswordRef = useRef(null);
    const passwordReveal = () => userPasswordRef.current.type = 'text';
    const passwordCensor = () => userPasswordRef.current.type = 'password';
    const passRest = register("user_password", {required:true, minLength:3, type:'password', value:'',});
    
    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [responseStatus, setResponseStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const submitForm = async (data) => {
        setLoading(true);
        const body = {
            user_name : data.user_name,
            user_password : data.user_password
        }
        const requestOptions = {
            method:"POST",
            headers:{'content-type': 'application/json'},
            body: JSON.stringify(body)
        }
        await fetch('/auth/login', requestOptions)
        .then(res => res.json()
        .then(data => {
            if(data.ok){
                login([data.user_token, data.access_token]);
                socket.connect();
            } else {
                setResponseStatus(data.ok);
                setServerResponse(data.statusText);
                setShow(true);
            }
        }))
        .then(socket.emit('go_online', data.user_name))
        .catch(err => console.log(err));
        navigate('/');
        reset();
        try {
            setLoading(false);
            setShow(true);
        } catch (error){
            setLoading(false);
        }
    };
    const handleUserKeyPress = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(submitForm)(); 
        }
    };
    return (
        <div className="login position-absolute top-50 start-50 translate-middle">
            <Container className="d-flex align-items-center py-4 rounded">
                <div className="mx-auto">
                    <div className="w-100 text-center py-2">
                        <Link to='/' style={{textDecoration:'none'}}>
                        <Button variant="btn btn-transparent w-100 border-0">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                </svg>
                            </div>
                            <div className="display-5 fw-bold">
                                Talker
                            </div>
                        </Button>
                        </Link>
                    </div>
                    <Form>
                        <Card className="w-100 mx-auto border-light">
                            <Card.Body className='grid row-gap-3'>
                                <Form.Group controlId="usernameDetail" className="p-2">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Username" className="border-light" {...register('user_name', {required:true, maxLength:30, type:'text'})}  onKeyUp={handleUserKeyPress}/>
                                    {errors.user_name && 
                                            <Alert key="userRequired" variant="danger" dismissible className="my-2">
                                                <small>Username is required.</small>
                                            </Alert>
                                        }
                                </Form.Group>
                                <Form.Group className="p-2">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control type="password" placeholder="Password" className="border-light" {...passRest} ref={(e)=> {passRest.ref(e); userPasswordRef.current = e;}} onKeyUp={handleUserKeyPress}/>
                                        <Button variant="secondary" className="border-light" onMouseEnter={passwordReveal} onMouseLeave={passwordCensor}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                        </Button>
                                    </InputGroup>
                                    {errors.user_password && 
                                            <Alert key="userRequired" variant="danger" dismissible className="my-2">
                                                <small>Password is required.</small>
                                            </Alert>
                                        }
                                </Form.Group>
                                <Form.Group className="p-2">
                                    <Button className="w-100" variant="secondary" onClick={(e)=>{handleSubmit(submitForm)()}} disabled={loading}>
                                        <>{loading ? (
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        ): <>Log-in</>}
                                        </>
                                        </Button>
                                </Form.Group>
                            </Card.Body>
                            <Card.Footer className="text-center border-light" muted>
                                <small>
                                    Don't have an account? Make one <Link to='/signup'>here</Link>.
                                </small>
                            </Card.Footer>
                        </Card>
                        
                        {show?
                            <ToastContainer position="middle-center">
                                <Toast onClose={()=>{setShow(false);}} delay={5000} autohide bg={responseStatus ? "success-subtle":"danger-subtle"}>
                                <Toast.Header>
                                    <strong className="me-auto">{responseStatus ? <>Notification</>:<>Error</>}</strong>
                                    <small className="text-muted">just now</small>
                                </Toast.Header>
                                <Toast.Body>{serverResponse}</Toast.Body>
                                </Toast>
                            </ToastContainer>
                            : <></>
                        }
                    </Form>
                </div>
            </Container>
        </div>
    )
}
export default LoginComponent
