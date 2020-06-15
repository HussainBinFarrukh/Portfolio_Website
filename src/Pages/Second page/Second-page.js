import React from 'react';
import './second-page.styles.css';
import AboutMe from './Secong-page-components/AboutMe';
import MySkills from './Secong-page-components/MySkills';
import WorkExp from './Secong-page-components/Work-Expereice';
import EducationComp from './Secong-page-components/Education.jsx';
import Footer from '../../components/Footer';

const SecondPage = () => ( 
<div className="SecondPage">
    <AboutMe/>
    <EducationComp/>
    <MySkills/>
    <WorkExp/>
    <Footer/>


</div>
);
export default SecondPage;