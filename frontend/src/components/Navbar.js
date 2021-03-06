import React from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'

const Navbar = (props) => {

    let name = props.name;
    let setName = props.setName;

    let type = props.type;
    let setType = props.setType;

    let menu;
    const fetchURL = 'http://localhost:8080';
    // const fetchURL = 'https://cs467-sandbox.ue.r.appspot.com';
    // const fetchURL = 'https://capstone-animal-adoption-app.wl.r.appspot.com';

    const logout = async() => {
        await fetch(fetchURL + '/api/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'},
            credentials: 'include'
          });
        setName('');
        setType('');
    }

    // not logged in
    if (name === '') {
        menu = (
            <div className="links">
            <Link to="/Login" className='nav-link'>Login</Link>
            <Link to="/Signup" className='nav-link'>Sign Up</Link>
            <Link to="/Admin" className='nav-link'>Admin</Link>
            </div>
        );
    } else if (type === 'Shelter') {    // logged in - shelter
        menu = (
            <div className="links">
            <Link to='/pets/createPetProfile' className='nav-link'>Create</Link>
            <Link to='/sheltermanagement' className='nav-link'>Manage</Link>
            <Link to='/shelterprofile' className='nav-link'>Shelter Profile</Link>
            <Link to="/Login" className='nav-link' onClick={logout}>Logout</Link>
            </div>
        );
    } else if (type === 'User') {    // logged in - user
        menu = (
            <div className="links">
            <Link to="/userprofile" className='nav-link'>User Profile</Link>
            <Link to="/Login" className='nav-link' onClick={logout}>Logout</Link>
            </div>
        );
    } else if (type === 'Admin') {    // logged in - admin
        menu = (
            <div className="links">
            <Link to="/adminView" className='nav-link'>Manage Profiles</Link>
            <Link to="/Login" className='nav-link' onClick={logout}>Logout</Link>
            </div>
        );
    }

    return (
        <div className='navbar'>
            <div className='logo'>
                 <Link to=''>
                     <img src="../../logo/logo.png" alt="" height="40"></img>
                 </Link>            
             </div>
            {menu}
        </div>
    )
}

export default Navbar;
