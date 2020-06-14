import React from 'react';
import './Education.css';
import USMLOGO from './../../../assets/AboutMe pics/USMLogo.png';
import CAMLOGO from './../../../assets/AboutMe pics/CamLogo.png';

const EducationComp = () => {

return(
<div className="EducationSec">
    <h1 id="EduTitle">EDUCATION</h1>
    <div className="USMInfo">
        <div>
            <img id="USMLOGO" src={USMLOGO}/>
        </div>
        <div className="USMInfoText">
            <p>Minim nulla ad officia dolor. Dolore do consectetur cillum minim consectetur velit pariatur enim ea excepteur reprehenderit esse nostrud minim. Ut duis excepteur tempor ipsum pariatur magna anim deserunt incididunt consectetur. Veniam nostrud mollit dolor laborum consequat proident ullamco qui labore enim dolor. Ea aliquip consequat exercitation aliqua laborum est cupidatat. Ipsum consequat aliqua non labore in anim.
                    Nulla consequat aliquip proident consectetur et sit nulla est deserunt amet excepteur duis anim ullamco. Culpa ad pariatur consectetur amet ipsum excepteur adipisicing pariatur. Sit duis proident labore irure do veniam deserunt deserunt consequat voluptate dolor. Enim sit exercitation ad excepteur minim non non. Aliqua cillum anim non nulla. </p>
        </div>
    </div>

    <div className="CAMInfo">
        <div>
            <img id="CAMLOGO" src={CAMLOGO}/>
        </div>
        <div className="CAMInfoText">
            <p>Minim nulla ad officia dolor. Dolore do consectetur cillum minim consectetur velit pariatur enim ea excepteur reprehenderit esse nostrud minim. Ut duis excepteur tempor ipsum pariatur magna anim deserunt incididunt consectetur. Veniam nostrud mollit dolor laborum consequat proident ullamco qui labore enim dolor. Ea aliquip consequat exercitation aliqua laborum est cupidatat. Ipsum consequat aliqua non labore in anim.
                    Nulla consequat aliquip proident consectetur et sit nulla est deserunt amet excepteur duis anim ullamco. Culpa ad pariatur consectetur amet ipsum excepteur adipisicing pariatur. Sit duis proident labore irure do veniam deserunt deserunt consequat voluptate dolor. Enim sit exercitation ad excepteur minim non non. Aliqua cillum anim non nulla. </p>
        </div>
    </div>



</div>
);}

export default EducationComp;