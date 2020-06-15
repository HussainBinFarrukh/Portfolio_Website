import React from 'react';
import {Link} from 'react-router-dom';
import './NavBar.styles.css';
import image from '../assets/DSC_0190.jpg';
import sig from '../assets/sig-white.png';




const NavBar = () => {
    return(
    <div className='header'>
    
    <a  href="https://hussainbinfarrukh.github.io/Portfolio_Website/">
    <img className='logo-container' src={image} alt="Logo" />
    </a>

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