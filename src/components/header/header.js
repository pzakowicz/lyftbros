//imports 
import React, {Component} from 'react';


//creating the master component
class Header extends Component {
  
  //setting state object for the master component
  state = { 
    loggedIn
   }

  toggleForms = () => {
    this.setState(prevState => ({

    }))
  }


  render() {

    return (
<header id="partial-header">
  <nav>
    <a href="../../feed">
      <div class="flex-container">
        <img id="logo-img" src="../../resources/lbs logo 2.png" />
        <h2 id="logo-text">Lyftbros</h2>
      </div>
    </a>
    <a href="../../log-workout">
      <button type="button" class="nav-button primary-button" id="log-button">Log</button>
    </a>
    <a href="../../feed">
      <button type="button" class="nav-button secondary-button" id="feed-button">Feed</button>
    </a>
  </nav>
    <div class="dropdown flex-container">
      <img class="dropbtn" id="account-pic" src="../../resources/profile pic.png" /><i class="fas fa-caret-down"></i>
      <div class="dropdown-content">
        <a href="/account">Account</a>
        <a href="/logout">Logout</a>
      </div>
    </div>
</header>
    )
  }

}

export default Header;