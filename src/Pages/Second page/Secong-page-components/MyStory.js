import React from 'react';
import './MyStory.css'
import MyStoryImg from '../../../assets/try/IMG_20180316_1616501.jpg';

const MyStory = () => (
<>

    <div     
    className="MyStory"
        data-aos="fade-right"
        data-aos-delay="50"
        data-aos-easing="ease-in"
        data-aos-duration="1000" 
    >
        
        <div className="MyStoryImg">
            <img alt="Image" id="MyStoryImg" src={MyStoryImg}/>
        </div>   
        
        <div className="RightSide">

            <div className="MyStoryInfo">
            <h1 id="Abt">Inspiration</h1>
            <p id="para"> <strong id="strong">‟</strong> Cowards Never Start, The Weak Never Finish, Winners Never Quit." A powerful statement by my childhood inspiration - Tony Stark. 
            As a teenager, when I watched Marvel's Ironman movies, something about Tony Stark's character stuck with me. Whether it was the Ironman suit or the artificially intelligent system, Jarvis, I found myself getting captivated by Tony Stark's futuristic ideas.  I began questioning whether I was doing enough to achieve the one goal that had defined my life: transforming ideas into reality.
            <strong id="strong2">„</strong>
            </p>
            </div>


            <div className="MS-Box1">
                <div className="MyStoryInfo">
                    <h1 id="Abt">Interests</h1>
                    <p id="para"> <strong id="strong">‟</strong> My favorite hobby as a kid was disabling laptops and electronics into parts. Ever since I was a child, I have been obsessed with understanding the intricacies of a computer's operation. Whether it was my old Pentium 4 desktop or PlayStation gaming console, how it all worked was a question that used to vex me day and night.
                    <strong id="strong2">„</strong>
                    </p>
                </div>
            </div>
            <div className="MS-Box1">
                <div className="MyStoryInfo">
                    <h1 id="Abt">Motivation</h1>
                    <p id="para"> <strong id="strong">‟</strong> We live in a world where technology has dominated the economy and allows business organizations to harness that plethora of data in creative ways to produce valuable insights that can change our way of living, thinking, and working. I want to pursue a career in Web development so that I can become part of this process. It is a dedication attested to by the focus and energy I have put into my research and work experience.
                    <strong id="strong2">„</strong>
                    </p>
                </div>
            </div>

            <div className="MS-Box1">
                <div className="MyStoryInfo">
                    <h1 id="Abt1">Values</h1>
                    <ul id="lpara">
                    <li id="par">Innovation     </li>
                    <li id="par"> Growth        </li>
                    <li id="par"> Passion       </li>                   
                    <li id="par"> Team Player   </li>                   
                    <li id="par"> Empathy       </li>
                    </ul>
                </div>
            </div>

        </div>


    </div>
</>
    );

export default MyStory;


/*
<div className="MS-Box1">
<div className="MyStoryInfo">
    <h1 id="Abt">Inspiration</h1>
    <p id="para"> <strong id="strong">‟</strong> Cowards Never Start, The Weak Never Finish, Winners Never Quit." A powerful statement by my childhood inspiration - Tony Stark. 
    As a teenager, when I watched Marvel's Ironman movies, something about Tony Stark's character stuck with me. Whether it was the Ironman suit or the artificially intelligent system, Jarvis, I found myself getting captivated by Tony Stark's futuristic ideas.  I began questioning whether I was doing enough to achieve the one goal that had defined my life: transforming ideas into reality.
    
    <strong id="strong2">„</strong>
    </p>
</div>
</div>

*/