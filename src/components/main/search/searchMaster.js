import React, {useState, useEffect} from "react";
import { Form, Spinner } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import SearchMainComponent from "./searchMain";

const SearchMasterComponent = ({socket}) => {
    const [logged, authToken, currentUser, loading, setLoading] = useOutletContext();

    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState("");

    const searchUserList = userList.filter((user) =>{
        if(search !== ""){
            return user.user_name.toLowerCase().includes(search.toLowerCase());
        }
    });
    const getUser = async() =>{
        const data = await fetch("/user/users")
        .then(res=>res.json())
        .catch(err=>console.log(err));
        return data;
    }
    const importUser = async() =>{
        const fetch = await getUser();
        setUserList([...fetch]);
        setLoading(false);
    }
    useEffect(() =>{
        try {
            setLoading(true);
            importUser();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }, [socket])
    return(
        <>
            {loading ? 
                <>
                    <div className="position-absolute start-50 top-50">
                        <Spinner animation="border" variant="light"/> 
                    </div>
                </>
            :
            <>
                <div className="col-md-3">
                    <Form className="py-2">
                        <Form.Control value={search} className="border-light" onChange={(event)=>{setSearch(event.target.value)}} placeholder="Search user..."/>
                    </Form>
                    <SearchMainComponent authToken={authToken} item={searchUserList} setLoading={setLoading}/>
                </div>
            </>}
        </>
    )
}
export default SearchMasterComponent