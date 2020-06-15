import React from 'react';
import './Education.css';
import USMLOGO from './../../../assets/AboutMe pics/USMLogo.png';
import CAMLOGO from './../../../assets/AboutMe pics/CamLogo.png';

const EducationComp = () => {

return(
<div className="EducationSec" >
    <h1 id="EduTitle">EDUCATION</h1>
    <div className="USMInfo">
        <div>
            <img alt="logo" id="USMLOGO" src={USMLOGO}/>
        </div>
        <div className="USMInfoText">
            <ul id="USM-T">
                <li id="USM-T-L">UNIVERSITY OF SOUTHERN MISSISSIPPI</li>
                <li id="USM-T-L-S">Aug 2016 to May 2020</li>
                <li id="USM-T-L2">Bachelor of Science (Computer Science)	</li>
                <li id="USM-T-L-S">Hattiesburg, MS</li>
                <li id="USM-T-L3">GPA 3.67</li>
            </ul>
            <p id="USM-p1">Southern Miss was a truly invaluable experience in my journey. My professors and peers challenged my skills and motivated me to grow through class projects and coding competitions. My involvement in USM's tech-related initiatives disciplined my inventive muscle, sparked my fascination with web development, and increased my endurance to adversity. Over these past four years, my love for computer science has only developed stronger through rigorous study of its nuts and bolts.
            </p>
        </div>
    </div>

    <div className="CAMInfo">
        <div>
            <img alt="logo" id="CAMLOGO" src={CAMLOGO}/>
        </div>
        <div className="USMInfoText">
        <ul id="CAM-T">
            <li id="CAM-T-L">ROOTS IVY INTERNATIONAL</li>
            <li id="CAM-T-L-S">Aug 2014 to May 2016</li>
            <li id="CAM-T-L2">A level (Physics, Mathematics, Computer Science)</li>
            <li id="CAM-T-L-S">Faisalabad, Pakistan</li>
            <li id="CAM-T-L3">GPA 3.8</li>
        </ul>
        <p id="CAM-p1">Roots Ivy showed me what I was passionate about and gifted me with a desire for knowledge. My time in the student council holding annual events helped me polish my organizational skills. My experience heading the science society showed me the qualities of a great leader and stretched my comfort zone.	
        </p>
    </div>
    </div>



</div>
);}

export default EducationComp;