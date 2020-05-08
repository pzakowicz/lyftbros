//imports 
import React, {Component} from 'react';
import Login from './login/login';
import Feed from './feed/feed';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';


//creating the master component
class App extends Component {
  
  //setting state object for the master component
  state = { 
    loginFormVisible: true,
    showCreateAccountVisible: true,
    registerFormVisible: false
   }

  toggleForms = () => {
    this.setState(prevState => ({
      loginFormVisible: !prevState.loginFormVisible, 
      showCreateAccountVisible: !prevState.showCreateAccountVisible, 
      registerFormVisible: !prevState.registerFormVisible, 
    }))
  }


  render() {

    return (
      <div>
        <BrowserRouter>
            <div className="app">
              <Route exact path="/" component={Login} />
              <Route path="/feed" component={Feed} />

            </div>
        </BrowserRouter>
      </div>

    )
  }

}

export default App;