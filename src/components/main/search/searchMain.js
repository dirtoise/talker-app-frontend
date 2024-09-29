import React, {useState, useEffect} from "react";
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchMainComponent = ({socket, authToken, item, setLoading}) => {
    const navigate = useNavigate();
    return(
        <>
            <hr/>
            <ul class="list-group list-group-flush rounded w-100">
                {item.map((user)=>(
                    <li id={user.user_name} class='py-3 list-group-item list-group-item-action border-bottom-0'>
                        <div onClick={()=>{navigate(`/${user.user_name}/profile`);setLoading(true);}} data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                            <Row>
                                <Col md="auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                    </svg>
                                </Col>
                                <Col md="auto">
                                    <span class="list-item" id='list-item'>
                                        {user.user_name}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </li>
                ))}
            </ul> 
        </>
    )
}
export default SearchMainComponent
