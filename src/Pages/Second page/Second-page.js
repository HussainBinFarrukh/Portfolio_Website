import React from 'react';
import './second-page.styles.css';
import AboutMe from './Secong-page-components/AboutMe';
import MySkills from './Secong-page-components/MySkills';
import WorkExp from './Secong-page-components/Work-Expereice';
import EducationComp from './Secong-page-components/Education.jsx';

const SecondPage = () => {
    
 

return(
<div className="SecondPage">
    <AboutMe/>
    <EducationComp/>
    <MySkills/>
    <WorkExp/>

    <div className="Second-page-button">  
    <a  href="#myVideo"> ⬆ </a> 
    </div>          
</div>
);}

export default SecondPage;