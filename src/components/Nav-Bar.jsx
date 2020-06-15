import React from 'react';
import {Link} from 'react-router-dom';
import './NavBar.styles.css';
import image from '../assets/DSC_0190.jpg';
import sig from './sig-white.png';




const NavBar = () => {
    return(
    <div className='header'>
    
    <Link  to="/">
    <img className='logo-container' src={image} alt="Logo" />
    </Link>

    <img alt="logo" className='logo-container1' src={sig}/>
    <h1 className="Name">HUSSAIN  BIN  FARRUKH</h1>


        <div className='options'>
                <a className='option' href="#Second-page">
                About
                </a>
                <a className='option' href="#Contact-page">
                Contact
               </a>
        </div>   
    </div>
    );
}
export default NavBar;