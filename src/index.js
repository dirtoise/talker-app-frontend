import React, {useState, useEffect} from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client';
import LoginComponent from './components/login';
import SignupComponent from './components/signup';
import ErrorComponent from './components/error.js';
import MainComponent from './components/main/main.js';
import ProfileComponent from './components/main/profile.js';
import MessageMasterComponent from './components/main/message/messageMaster.js';
import SearchMasterComponent from './components/main/search/searchMaster.js';
import RequestComponent from './components/main/request.js';
import ArchiveComponent from './components/main/archive.js';
import { useAuth } from './components/auth.js';

const port = process.env.PORT || 5000;
const socket = io('http://localhost:'+ port, {
  autoConnect:false,
  cors: {
    origin: 'http://localhost:'+ port,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  connectionStateRecovery:{
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  }})

function App() {
  const [data, setData] = useState([{}])
  const [logged, session] = useAuth();
  useEffect(()=>{
    socket.on('connect', () => {
      console.log(`connected`);
    });
    return ()=>{
      socket.off('connect', ()=>{
        console.log(`connected`);
      });
    }
  })  
  useEffect(()=>{
    socket.on('disconnect', (data) => {
      console.log(`disconnecting`);
    });
    return ()=>{
      socket.off('disconnect', (data)=>{
        console.log(`disconnecting`);
      });
    }
  })
  useEffect(()=>{    
    if(logged && !socket.connected){
      socket.connect();
      socket.emit('go_online', session[0]);
    };
    return ()=>{
      socket.off('connect', ()=>{
        console.log(`connect ${socket.id}`);
      });
    }
  });
  return (
    <Router>
      <Routes>
          <Route path='/' element={<MainComponent socket={socket} logged={logged} session={session}/>}>
            <Route path='/:user_name/profile' element={<ProfileComponent socket={socket} />} />
            <Route path='/:user_name/messages' element={<MessageMasterComponent socket={socket}/>} />
            <Route path='/search' element={<SearchMasterComponent socket={socket}/>} />
            <Route path='/:user_name/requests'  element={<RequestComponent socket={socket}/>} />
            <Route path='/:user_name/archive' element={<ArchiveComponent socket={socket}/>} />
          </Route>
          <Route path='/login' element={<LoginComponent socket={socket}/>}/>
          <Route path='/signup' element={<SignupComponent socket={socket}/>}/>
          <Route path='/error' element={<ErrorComponent socket={socket}/>}/>
      </Routes>
    </Router>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
