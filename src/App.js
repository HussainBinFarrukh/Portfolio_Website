import React from 'react';
import Landing from './Pages/Landing-Page/Landing';
import {
  Route
} from 'react-router-dom';
import NavBar from './components/Nav-Bar';
import Contact from './Pages/Contact/Contact';
import './App.css';
import AnimatedCursor from './components/cursor/pointer';


function App() { 

  return (
  <div  className="scroller">
  <AnimatedCursor/>

    <Route exact path='/' component={NavBar}/>
    <Route exact path='/' component={Landing}/> 
    
  </div>

  ); 
  }
  

export default App;
