//imports 
import React, {Component} from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';


//creating the master component
class App extends Component {
  
  //setting state object for the master component
  state = { 
    loginFormVisible: true,
    showCreateAccountVisible: true,
    registerFormVisible: false
   }



  toggleFormVisibility = () => {
    this.setState(prevState => ({
      loginFormVisible: !prevState.loginFormVisible, 
      showCreateAccountVisible: !prevState.showCreateAccountVisible, 
      registerFormVisible: !prevState.registerFormVisible, 
    }))
  }


  render() {

    return (
    <div>
      {this.state.loginFormVisible && <LoginForm  />}
      {this.state.showCreateAccountVisible && <h5 className="link" id="show-create-account-form" onClick={this.toggleFormVisibility}>New to Lyftbros? Create an account.</h5>}
      {this.state.registerFormVisible && <RegisterForm visibility={toggleFormVisibility}/>}
        
    </div>
    )
  }

}

export default App;