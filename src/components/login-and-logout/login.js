//imports 
import React, {Component} from 'react';
import LoginForm from './login-form';
import RegisterForm from './register-form';

//creating the master component
class Login extends Component {
  
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
      <main id="login-main">
        <div className="inner-container" id="login-and-register-container">
          {this.state.loginFormVisible && <LoginForm  />}
          {this.state.showCreateAccountVisible && <h5 className="link" id="show-create-account-form" onClick={this.toggleForms}>New to Lyftbros? Create an account.</h5>}
          {this.state.registerFormVisible && <RegisterForm toggle={this.toggleForms}/>}
          
        </div>
      </main>
    )
  }

}

export default Login;