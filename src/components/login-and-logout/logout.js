//imports 
import React from 'react';
import {Link} from 'react-router-dom'


//creating the master component
function Logout() {
  
  return (
    
    <main>
      <h4>You have successfully logged out.</h4>
      <a href="/"><button className="nav-button primary-button" type="button" id="login button">Go to login</button> </a>
    </main>
    
  )


}

export default Logout;