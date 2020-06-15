import React from 'react';
import './Footer.css';
import fb from '../assets/Social/facebook.png';
import Insta from '../assets/Social/instagram.png';
import Discord from '../assets/Social/discord.png';
import GitHub from '../assets/Social/git.png';
import linkedin from '../assets/Social/linkedin.png';
import Sigi from '../assets/sig.png';



const Footer = () => (
<>     

    <div className="Second-page-button">  
       <a  href="#myVideo"> ⬆ </a> 
    </div>  
        

    <div id="Contact-page" className="Footer">   
      
        <div className="Contact-Container">
           <div class="shade">
                 <div class="blackboard">
                    <div class="form">
                    <p id="C-M-T"> 
                        <label > Contact Me </label>
                    </p>
                    <p>
                        <label>Email: hussain.13@live.com</label>
                    </p>
                    <p>
                        <label>Phone: +1 (601)-549-5317</label>
                    </p>
                    <img id="Sigi" src={Sigi} alt="sig"/>
                    </div>
                </div>
            </div>    

           <div className="L-I-Box">
                <div class="LI-profile-badge"  data-version="v1" data-size="large" data-locale="en_US" data-type="horizontal" data-theme="dark" data-vanity="hussain-bin-farrukh"><a class="LI-simple-link" href='https://www.linkedin.com/in/hussain-bin-farrukh?trk=profile-badge' target="_blank">Hussain Bin Farrukh</a></div>
            </div>
        </div>

    <div className="Second-page-button">  
       <a  href="#myVideo"> ⬆ </a> 
    </div>  
    <div className="Social">
    <a href="https://www.facebook.com/hussainbinfarukh/" target="_blank"><img alt="Image" id="S-Logo" src={fb}/> </a>
    <a href="https://www.instagram.com/hussainbinfarrukh/" target="_blank"><img alt="Image" id="S-Logo" src={Insta} /> </a>
    <a href="https://github.com/HussainBinFarrukh" target="_blank"><img alt="Image" id="S-Logo" src={GitHub} /> </a>
    <a href="https://discord.gg/tsYetb" target="_blank"><img alt="Image" id="S-Logo" src={Discord} /> </a>
    <a href="https://www.linkedin.com/in/hussain-bin-farrukh/" target="_blank"><img alt="Image" id="S-Logo" src={linkedin} /> </a>
  
    
    </div>    
    <small id="Copyright"> HUSSAIN BIN FARRUKH &copy; </small>
    </div>

    
  </>  );

export default Footer;
