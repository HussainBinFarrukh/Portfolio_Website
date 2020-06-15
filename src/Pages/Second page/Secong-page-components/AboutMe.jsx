import React from 'react';
import './AboutMe.css';
import Box1 from '../../../assets/AboutMe pics/box1_b.jpg';
import Box2 from '../../../assets/AboutMe pics/box2.jpg';
import Box3 from '../../../assets/AboutMe pics/box3.jpg';
import Box4 from '../../../assets/AboutMe pics/box4.jpg';

import Grad from '../../../assets/AboutMe pics/graduation.png';
import SkillBox from '../../../assets/AboutMe pics/skillScene.png';
import Exp from '../../../assets/AboutMe pics/Exp.png';
import MyStoryP from '../../../assets/AboutMe pics/box1_c.jpg';
import MyStory from './MyStory.js';


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
        <div class="About_Me" >
            <div class="About_Me_Boxes"            >
                <div class="container"
                data-aos="flip-up" data-aos-delay="300" data-aos-easing="ease-in-out " data-aos-duration="20"
                >
                    <img alt="Image" src={Box1} alt="Avatar"/>
                    <div class="overlay">
                    <a class="text" href="#My_Story">MY STORY<img id="MyStoryP" src={MyStoryP} /></a>
                    </div>
                </div>

                <div class="container"
                data-aos="flip-up" data-aos-delay="600" data-aos-easing="ease-in-out " data-aos-duration="20"                >
                    <img alt="Image" src={Box2} alt="Avatar" class="image"/>
                    <div class="overlay">
                        <a class="text" href="#Edu">EDUCATION <img id="Grad" src={Grad} /></a>


                    </div>
                </div>
                <div class="container"
                data-aos="flip-up" data-aos-delay="900" data-aos-easing="ease-in-out " data-aos-duration="20"
                >
                    <img alt="Image" src={Box4} alt="Avatar" class="image"/>
                    <div class="overlay">
                    <a class="text" href="#MySkills">SKILLS <img id="SkillBox" src={SkillBox} /></a>
                    </div>
                </div>
                <div class="container"
                data-aos="flip-up" data-aos-delay="1200" data-aos-easing="ease-in-out " data-aos-duration="20"
                >
                    <img alt="Image" src={Box3} alt="Avatar" class="image"/>
                    <div class="overlay">
                    <a class="text" href="#Exp">EXPERIENCE <img id="ExpBox" src={Exp} /></a>
                    </div>
                    </div>
                    <br id="My_Story"/>
                    
            </div>
       </div>
        {/**************END BOXES**************/}

        <MyStory/>
        <br id="Edu"/>
</div>
</>
)
    }


export default AboutMe;