import React, { useState} from "react";
import { Navigate } from 'react-router-dom';
import "./Login.css";
import Button from "./components/Button";
import { Link } from "react-router-dom";

const Login = (props) => {

  const setName = props.setName;
  const setType = props.setType;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [navigate, setNavigate] = useState(false);
  const fetchURL = 'http://localhost:8080';
  // const fetchURL = "https://cs467-sandbox.ue.r.appspot.com";
  // const fetchURL = 'https://capstone-animal-adoption-app.wl.r.appspot.com';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(fetchURL + '/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'},
      credentials: 'include',
      body: JSON.stringify({ 
        email,
        password
      })
    });

    const content = await response.json();
    console.log(content.message);
    if (content.message === 'User not found!') {
      alert('User not found!');
    } else if (content.message === 'Invalid password!'){
      alert('Invalid password!');
    } else{
      setNavigate(true);
      setType(content.user.type);
      if (content.user.type === 'Shelter'){
        setName(content.user.shelter_name);
      } else {
        setName(content.user.first_name + ' ' + content.user.last_name);
      }
    }
  }

  if (navigate) {
    return <Navigate to="/" />
  }

  return (
    <div className="App">
      <form className='form'>
        <div className='user'>
            <label>Email: 
            <input className='user-label' type='text' required onChange={e => setEmail(e.target.value)}></input></label>
        </div>
        <div className='password'>
            <label>Password: 
            <input className='password-label' type='password' required onChange={e => setPassword(e.target.value)}></input></label>
        </div>
      <button onClick={handleSubmit}>Submit</button>
    </form>
    </div>
  );
};

export default Login;