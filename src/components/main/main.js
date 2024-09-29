import React, { useEffect, useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles.css';
import { Container } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../auth';
import SideBarComponent from "./sidebar";
import LoginComponent from "../login";

const MainComponent = ({socket, logged, session}) => {

    const navigate = useNavigate();
    const [mainClass, setMainClass] = useState('main');
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const [spanDisplay, setSpanDisplay] = useState('none');
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const handleViewSidebar = () => {
        setSideBarOpen(!sidebarOpen);
        spanDisplay === 'none' ? setSpanDisplay('block') : setSpanDisplay('none');
        mainClass === 'main' ? setMainClass('main open') : setMainClass('main');
    };
    const logoutTrigger = () => {
        logout();
        socket.disconnect();
        navigate('/login');
    };
    {/** FOR PROFILE - SENDING REQUEST TO CURRENT USER PROFILE*/}
    const submitContactRequest = async (data) => {
        setButtonLoading(true);
        const body = {
            current_username : session[0],
            contact_username: data.user_name,
        }
        const requestOptions = {
            method:"POST",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${session[1]}`
            },
            body: JSON.stringify(body)
        }
        await fetch(`/request/${data.user_name}`, requestOptions)
        .then(res => res.json())
        .catch(err => console.log(err))
        setButtonLoading(false);
    };
    {/** FOR REQUEST - DENYING OR CONFIRMING REQUEST*/}
    const submitDenyRequest = async (data) =>{
        setButtonLoading(true);
        const body = {
            current_username : session[0],
            contact_username: data.user_name,
        }
        const requestOptions = {
            method:"DELETE",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${session[1]}`
            },
            body: JSON.stringify(body)
        }
        await fetch(`/request/${session[0]}`, requestOptions)
        .then(res => res.json())
        .catch(err => console.log(err))
        setButtonLoading(false);
    };
    const submitConfirmRequest = async (data) =>{
        setButtonLoading(true);
        const body = {
            current_username : session[0],
            contact_username: data.user_name,
            status: "contact",
        }
        const requestOptions = {
            method:"PUT",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${session[1]}`
            },
            body: JSON.stringify(body)
        }
        await fetch(`/request/${session[0]}`, requestOptions)
        .then(res => res.json())
        .catch(err => console.log(err))
        setButtonLoading(false);
    };
    {/** FOR ARCHIVE - UNARCHIVE CONTACT*/}
    const submitUnarchive = async (data) =>{
        setButtonLoading(true);
        const body = {
            current_username : session[0],
            contact_username: data.user_name,
            status: "contact",
        }
        const requestOptions = {
            method:"PUT",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${session[1]}`
            },
            body: JSON.stringify(body)
        }
        await fetch(`/request/${session[0]}`, requestOptions)
        .then(res => res.json())
        .catch(err => console.log(err))
        setButtonLoading(false);
    };
    {/** FOR CONTACT - DELETE CONTACT*/}
    const submitDeleteContact = async (data) => {
        setButtonLoading(true);
        const body = {
            current_username : session[0],
            contact_username: data.user_name,
        }
        const requestOptions = {
            method:"DELETE",
            headers:{
                'content-type': 'application/json',
                'Authorization': `Bearer ${session[1]}`
            },
            body: JSON.stringify(body)
        }
        await fetch(`/contact/${data.user_name}`, requestOptions)
        .then(res => res.json())
        .catch(err => console.log(err))
        setButtonLoading(false);
    }
    return (
        <Container>
            {(logged) ? 
            <>
                <div class='ptC-2'></div>
                    <SideBarComponent 
                        token={session[0]} 
                        socket={socket} 
                        sidebarOpen={sidebarOpen} 
                        spanDisplay={spanDisplay} 
                        handleViewSidebar={handleViewSidebar} 
                        logoutTrigger={logoutTrigger} 
                        loading={loading} 
                        setLoading={setLoading} 
                    />
                    <div className={mainClass}>
                        <Outlet context=
                        {[  logged, 
                            session[1], 
                            session[0], 
                            loading, 
                            setLoading, 
                            buttonLoading,
                            setButtonLoading,
                            submitConfirmRequest,
                            submitDenyRequest,
                            submitContactRequest,
                            submitDeleteContact,
                            submitUnarchive
                        ]}/>
                    </div>
                <div class='ptC-3'></div>
            </> 
            :
            <>
                <LoginComponent socket={socket}/>
            </>}
        </Container>
    )
}
export default MainComponent