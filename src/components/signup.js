import React, {useState, useRef, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { Form, InputGroup, Button, Row, Col, Card, Alert, Toast, ToastContainer, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const SignupComponent = ({socket}) => {
    const {register, watch, handleSubmit, reset, formState:{errors}} = useForm();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [responseStatus, setResponseStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordReveal = () => userPasswordRef.current.type = 'text';
    const confirmPasswordReveal = () => confirmPasswordRef.current.type = 'text';
    const passwordCensor = () => userPasswordRef.current.type = 'password';
    const confirmPasswordCensor = () => confirmPasswordRef.current.type = 'password';
    const userPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const passRest = register("user_password", {required:true, minLength:3, type:'password', value:'' });
    const confRest = register('password_confirm', {required:true, minLength:3, type:'password'});

    const submitForm = async (data) => {
        setLoading(true);
        if (data.user_password === data.password_confirm) {
            const body = {
                user_name : data.user_name,
                user_email : data.user_email,
                user_password : data.user_password,
                user_firstname : data.user_firstname,
                user_lastname : data.user_lastname,
                user_address : data.user_address
            }  
            const requestOptions = {
                method:"POST",
                headers:{
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)
            }
            await fetch('/auth/signup', requestOptions)
            .then(res => res.json())
            .then(data => {setResponseStatus(data.ok);setServerResponse(data.message)})
            .then(reset())
            .catch(err => console.log(err))
        } else {
            setServerResponse("Password doesn't match.");
        }
        try {
            setLoading(false);
            setShow(true);
        } catch (error){
            setLoading(false);
        }
    };
    const checkNavigate = () =>{
        if(responseStatus){
            navigate('/login');
        };
    };
    const handleUserKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(submitForm)(); 
        }
    };
    return (
        <>
            <main className="d-flex align-items-center py-2 rounded">
                <div className="mx-auto">
                    <div className="rounded border border-light">
                        <Col md={12}>
                            <div className="w-100 text-center py-2">
                                <Link to='/' style={{textDecoration:'none'}}>
                                <Button variant="btn w-100 border-0">
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
                        </Col>
                        <Col md={12}>
                            <Form>
                                <Card className="w-100 border-0">
                                    <Card.Body className='grid row-gap-3'>
                                        {loading ? 
                                        <>  
                                            <div className="text-center">
                                            <h4>Processing information...</h4>
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                            </div>
                                        </>:
                                        <>
                                        <Row className="p-2">
                                            <Form.Group as={Col} controlId="usernameDetail">
                                                <Form.Label>Username</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text className="border-light">@</InputGroup.Text>
                                                    <Form.Control type="text" placeholder="sample username" name="user_name" className="border-light" {...register('user_name', {required:true, maxLength:30, type:'text'})} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                                </InputGroup>
                                                {errors.user_name && 
                                                        <Alert key="userRequired" variant="danger" dismissible className="my-2">
                                                            <small>Username is required.</small>
                                                        </Alert>
                                                    }
                                                
                                                {errors.user_name?.type==="maxLength" && 
                                                        <Alert key="userMax" variant="danger" dismissible className="my-2">
                                                            <small>Max characters should be 30.</small>
                                                        </Alert>
                                                    }
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="emailDetail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="sample@mail.com" name="user_email" className="border-light" {...register('user_email', {required:true, type:'email'})} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                                {errors.user_email && 
                                                        <Alert key="emailRequired" variant="danger" dismissible className="my-2">
                                                            <small>Valid email is required.</small>
                                                        </Alert>
                                                    }
                                            </Form.Group>
                                        </Row>
                                        <Form.Group controlId="passwordDetail" className="p-2">
                                            <Form.Label>Password</Form.Label>
                                            <InputGroup>
                                                <Form.Control type="password" placeholder="sample password" className="border-light" {...passRest} ref={(e)=> {passRest.ref(e); userPasswordRef.current = e;}} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                                <Button variant="secondary" className="border-light" onMouseEnter={passwordReveal} onMouseLeave={passwordCensor}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                                    </svg>
                                                </Button>
                                            </InputGroup>
                                            {errors.user_password && 
                                                    <Alert key="passwordRequired" variant="danger" dismissible className="my-2">
                                                        <small>Password is required.</small>
                                                    </Alert>
                                                }
                                                
                                            {errors.user_password?.type==="minLength" && 
                                                    <Alert key="passwordMin" variant="danger" dismissible className="my-2">
                                                        <small>Minimum characters should be 3.</small>
                                                    </Alert>
                                                }
                                        </Form.Group>
                                        <Form.Group controlId="repasswordDetail" className="p-2">
                                            <Form.Label>Password Confirm</Form.Label>
                                            <InputGroup>
                                                <Form.Control type="password" placeholder="password confirm" className="border-light" {...confRest} ref={(e)=> {confRest.ref(e); confirmPasswordRef.current = e;}} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                                <Button variant="secondary" className="border-light" onMouseEnter={confirmPasswordReveal} onMouseLeave={confirmPasswordCensor}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                                    </svg>
                                                </Button>
                                            </InputGroup>
                                            {errors.user_password && 
                                                    <Alert key="passwordConfirmRequired" variant="danger" dismissible className="my-2">
                                                        <small>Password is required.</small>
                                                    </Alert> 
                                                }
                                                
                                            {errors.user_password?.type==="minLength" && 
                                                    <Alert key="passwordConfirmMin" variant="danger" dismissible className="my-2">
                                                        <small>Minimum characters should be 3.</small>
                                                    </Alert>
                                                }
                                        </Form.Group>
                                        <Row className="p-2">
                                            <Form.Group as={Col} controlId="firstnameDetail">
                                            <Form.Label>First Name</Form.Label>
                                                <Form.Control type="text" placeholder="sample firstname" className="border-light" name="user_firstname" {...register('user_firstname', {type:'text'})} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="lastnameDetail">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control type="text" placeholder="sample lastname" className="border-light" name="user_lastname" {...register('user_lastname', {type:'text'})} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                            </Form.Group>
                                        </Row>
                                        <Form.Group controlId="addressDetail" className="p-2">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" placeholder="sample address" className="border-light" name="user_address" {...register('user_address', {type:'text'})} onKeyUp={(e)=>handleUserKeyPress(e)}/>
                                        </Form.Group>
                                        </>}
                                        <Form.Group className="p-2">
                                            <Button variant='secondary' className="w-100" onClick={()=>{handleSubmit(submitForm)()}} disabled={loading}>
                                                <>{loading ? (
                                                    <Spinner animation="border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </Spinner>
                                                ): <>Create account</>}
                                                </>
                                            </Button>
                                        </Form.Group>
                                    </Card.Body>
                                    {loading ? <></>:
                                    <>
                                    <Card.Footer className="text-center" muted>
                                        <small>
                                            Already have an account? Log-in <Link to='/login'>here</Link>.
                                        </small>
                                    </Card.Footer>
                                    </>}
                                </Card>

                                {show?
                                    <ToastContainer position="middle-center">
                                        <Toast onClose={()=>{checkNavigate();setShow(!show);}} delay={5000} autohide bg={responseStatus ? "success-subtle":"danger-subtle"}>
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
                        </Col>
                    </div>
                </div>
            </main>
        </>
    )
}
export default SignupComponent
