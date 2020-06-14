import React from 'react';
import './First-Page.css';
import Vid from '../../assets/vid5.mp4'


const FirstPage = () => (  
    <div  className="First_Page">
      <video autoPlay muted id="myVideo">
      <source src={Vid} type="video/mp4"/>
      </video>
          <div className="Heading">
            <ul className='title'>
              <li id="_1">Not </li>
              <li id="_2">Your </li>
            </ul>
            <ul>
              <h1 id="_3">Average</h1>
              <h1 id="_4">CODER</h1>
            </ul>
          </div>  
          <div className="First-page-button">  
          <a  href="#Second-page"> ⮟ </a> 
        </div> 
    </div>
);
    

export default FirstPage;

/***       <div className="two-choices">
            <div className="one-choice">
              <a  id="option" href={Resume}>My resume</a>
              <p>Learn more about me</p>
            </div>
              <div className="two-choice">
                <h2 id="option2">About Me</h2>
                <p>Learn more about me</p>
              </div>
        </div> 
        
        
****************************
.two-choices{
  margin-left: 17%;
}

.one-choice{
  margin-top: 9vw;
  padding: 3vw 3vw 3vw 3vw;
  text-align: center;
  border: solid #000000 4px;
  background-color: #c7cec6;
}
.one-choice a:link{
  font-size: 150%; 
  text-align: center;
  line-height: 7em;
  text-decoration: none;
}

.two-choice{
  padding: 3vw;
  text-align: center;
  border: solid #000000 4px;
  background-color: rgb(8, 8, 73);
  color: #eeeeee;
  
}
#option{
  border: 0.5vw solid #000000;
  padding: 2.5vw;
  background-color: #c7cec6;
}
.one-choice:hover #option{
  border:  0.5vw solid #000000;
  border-radius: 50%;
}
#option2{
  border: 0.5vw solid #ffffff;
  padding: 4.5vw;
  background-color: rgb(8, 8, 73);
  color: #eeeeee;
}
.two-choice:hover #option2 {
  border: 0.5vw solid #ffffff;
  border-radius: 50%;
}

        
        
        
        
        
        
        
        
        
        
        
        */