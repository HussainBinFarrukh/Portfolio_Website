import React from 'react';
import './AboutMe.css';
import Box1 from '../../../assets/AboutMe pics/box1.JPG';
import Box2 from '../../../assets/AboutMe pics/box2.jpg';
import Box3 from '../../../assets/AboutMe pics/box3.jpg';
import Box4 from '../../../assets/AboutMe pics/box4.jpg';

import Grad from '../../../assets/AboutMe pics/graduation.png';
import SkillBox from '../../../assets/AboutMe pics/skillScene.png';
import Exp from '../../../assets/AboutMe pics/Exp.png';
import MyStoryP from '../../../assets/AboutMe pics/pp-black.png';


const AboutMe = () => {
return (
<>
    <div id="Second-page" className="Second-page">

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        {/******************Boxes*******************/}
        <div class="About_Me">
            <div class="About_Me_Boxes">
                <div class="container">
                    <img src={Box1} alt="Avatar"/>
                    <div class="overlay">
                    <a class="text">MY STORY<img id="MyStoryP" src={MyStoryP} /></a>
                    </div>
                </div>
                <div class="container">
                    <img src={Box2} alt="Avatar" class="image"/>
                    <div class="overlay">
                        <a class="text">EDUCATION <img id="Grad" src={Grad} /></a>


                    </div>
                </div>
                <div class="container">
                    <img src={Box4} alt="Avatar" class="image"/>
                    <div class="overlay">
                    <a class="text">SKILLS <img id="SkillBox" src={SkillBox} /></a>
                    </div>
                </div>
                <div class="container">
                    <img src={Box3} alt="Avatar" class="image"/>
                    <div class="overlay">
                    <a class="text">EXPERIENCE <img id="ExpBox" src={Exp} /></a>
                    </div>
                </div>
            </div>
       </div>
        {/**************END BOXES**************/}
        <h1 id="Abt">Hi! I'm Hussain</h1>
        <p id="para"> <strong id="strong">‟</strong> I have a Bachelor's degree in Computer Science, Class of 2020 from the University of Southern Mississippi with CGPA 3.66. I aspire to become a Full Stack Web developer. 
        My previous experiences have taught me to leverage technical, analytical, and problem-solving skills to create dynamic, high-speed websites and applications with best code practices.
        <strong id="strong2">  „</strong>
        </p>
</div>
</>
)
    }


export default AboutMe;