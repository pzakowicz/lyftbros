//imports 
import React from 'react';
import {Link} from 'react-router-dom'


//creating the master component
function Header() {
  
  return (
    <header id="partial-header">
      <nav>
        <Link to="/feed">
          <div className="flex-container">
            <img id="logo-img" src="../../resources/lbs logo 2.png" />
            <h2 id="logo-text">Lyftbros</h2>
          </div>
        </Link>
        <Link to="/log-workout">
          <button type="button" className="nav-button primary-button" id="log-button">Log</button>
        </Link>
        <Link to="/feed">
          <button type="button" className="nav-button secondary-button" id="feed-button">Feed</button>
        </Link>
      </nav>
        <div className="dropdown flex-container">
          <img className="dropbtn" id="account-pic" src="/resources/profile pic.png" /><i className="fas fa-caret-down"></i>
          <div className="dropdown-content">
            <Link to="/account">Account</Link>
            <a href="/logout">Logout</a>
          </div>
        </div>
    </header>
  )


}

export default Header;