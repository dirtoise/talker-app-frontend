import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { Spinner } from 'react-bootstrap';

const ErrorComponent = ({socket}) =>{
    const [loading, setLoading] = useState();
    useEffect(()=>{
        if(loading){
            setLoading(false);
        };
    }, []);
    return(
        <>
            <div className="position-absolute start-50 top-50">
            {loading ? 
            <>
                <Spinner animation="border" variant="light"/> 
            </>
            :
            <>
                <h4>ERROR</h4>
            </>}
            </div>
        </>
    )
}
export default ErrorComponent