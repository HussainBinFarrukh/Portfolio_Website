import React from 'react';
import './Work-Exp.css';
import TrioSSS from '../../../assets/AboutMe pics/TrioSSS.png';
import PPB from '../../../assets/AboutMe pics/PBBbcode.3a850139.gif';
import TCS from '../../../assets/AboutMe pics/TCS.png';
import ResLife from '../../../assets/AboutMe pics/ResLife.jpg';
import HC from '../../../assets/AboutMe pics/HC1.jpg';
import Resume from '../../../assets/Resume.pdf';
import DownloadIcon from '../../../assets/Social/download.png';

const WorkExp = () => {
return (
<div id="WEX" className="WEX">        
<br id="Exp"/>
<br/>
<br/><br/>
<br/><br/>
<br/>
      <h1 className="W-E">WORK EXPERIENCE</h1>
      
<div className="Download"><a id="Download" href={Resume}><img alt="Image" id="DownloadLogo" src={DownloadIcon}/> My Resume</a>
</div>
    <div className="workExp">

    <div className="WE-Box" id="WE-Box1" data-aos="flip-left" data-aos-delay="300" data-aos-easing="ease-in" data-aos-duration="300"> 
        <div className="Circle1"></div>
            <div className="Exp-Title">
              <h2 id="Exp-Name">Computer Science Tutor</h2> <span id="Exp-date">Jan 2019 to May 2020</span>
              <h3 id="Exp-Name2">TRIO Student Support Services</h3> <span id="Exp-date2">Hattiesburg, MS</span>
            </div>
              <p className="Exp-Text" id="Exp-text">‟I helped fellow students achieve their full academic potential by preparing a customized lesson plan for each student based on their learning styles. I taught programming languages and monitored each student's progress throughout the year.  This experience taught me the importance of providing value to others. "
              </p>
        </div>

        <div className="WE-Box" id="WE-Box1-2">
        <img alt="Image" className="TrioSSS" src={TrioSSS} />
        </div>
        <div className="WE-Box" id="WE-Box3">
            <div className="Circle2"></div>
            <img alt="Image" className="PBB" src={PPB} />

        </div>        

        <div className="WE-Box" id="WE-Box4" data-aos="flip-right" data-aos-delay="300" data-aos-easing="ease-in-out-back " data-aos-duration="300">
            <div className="Exp-Title">
                <h2 id="Exp-Name">PayByBarcode</h2> <span id="Exp-date">Mar 2020 to May 2020</span>
                <h3 id="Exp-Name2">Personal Project</h3> 
            </div>
                <p id="Exp-text2">Inspired by the social distancing guidelines due to Covid-19, I wanted to create a contactless payment method for small businesses (e.g., Barbershops) that do not have credit card machines.
                </p>
        </div>  

        <div className="WE-Box" id="WE-Box5" data-aos="flip-right" data-aos-delay="300" data-aos-easing="ease-in-out " data-aos-duration="300">            
        <div className="Circle3"></div>
            <div className="Exp-Title3">
                <h2 id="Exp-Name">Web Developer Intern</h2> <span id="Exp-date">June 2018 to Aug 2018</span>
                <h3 id="Exp-Name2">The City School</h3> <span id="Exp-date2">Faisalabad, Pakistan</span>
            </div>
                <p id="Exp-text">I designed and developed a user-friendly website that included an optimized checkout page that increased user clicks by over 20%. I also trained over 15 staff members in internal functions, including steps on how to independently make minor updates and changes. Lastly, my job also required me to fix bugs from existing web pages and implement enhancements that significantly improved performance. This internship influenced me to encircle myself with individuals who pushed me to my limits.
                </p>
        </div>

        <div className="WE-Box" id="WE-Box2">
        <img alt="Image" className="TCS" src={TCS} />

        </div>
        <div className="WE-Box" id="WE-Box3">
            <div className="Circle4"></div>
            <img alt="Image" className="ResLife" src={ResLife} />

        </div>        

        <div className="WE-Box" id="WE-Box6" data-aos="flip-left" data-aos-delay="300" data-aos-easing="ease-in-out " data-aos-duration="300">
            <div className="Exp-Title">
                <h2 id="Exp-Name">IT Support & Desk Assistant</h2> <span id="Exp-date">Jan 2018 to Dec 2018</span>
                <h3 id="Exp-Name2">University of Southern Mississippi</h3> <span id="Exp-date2">Hattiesburg, MS</span>
            </div>
                <p id="Exp-text">I provided customer service and technical support to more than 200 residents. I contributed to positive results and smooth flow of daily operations through the organization, prioritization, and follow-through of crucial projects. The trust my supervisor and residents placed in me significantly boosted my confidence. The customer-oriented nature of this job taught me the importance of empathy
                </p>
        </div>    
        
        <div className="WE-Box" id="WE-Box7" data-aos="flip-right" data-aos-delay="300" data-aos-easing="ease-in-out " data-aos-duration="300">            
        <div className="Circle5"></div>
            <div className="Exp-Title">
                <h2 id="Exp-Name">Front End Designer</h2> <span id="Exp-date">May 2016 to Jan 2017</span>
                <h3 id="Exp-Name2">Haute Cuisine</h3> <span id="Exp-date2">Faisalabad, Pakistan</span>
            </div>
                <p id="Exp-text">I was the sole front end developer for Haute Cuisine
                Restaurant, one of Pakistan's most abundant eateries, in which I aided in the design and implementation of the application's user interface. I also documented and helped in the refactoring source code and utilizing visual effects and multimedia presentations to deliver
                design insights. It was a valuable experience and prepared me well for my next vocation, which was more exacting.
                </p>
      </div>
       
        <div className="WE-Box" id="WE-Box">
        <img alt="Image" className="HC" src={HC} />
        </div>        
    </div>

    
</div>)
    }


export default WorkExp;
