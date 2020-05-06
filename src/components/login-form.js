//imports 
import React, {Component} from 'react';

class LoginForm extends Component {

  state = {
    email: '',
    password: '',
    errorMessageVisible: false,
    logging: false
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  submitHandler = async (event) => {
    event.preventDefault();
    this.setState({ logging: true });
    let data = {
      username: this.state.email,
      password: this.state.password
    };
    if (data.username && data.password) {

      let response = await fetch(`/api/users/login/`,
      {
         method: "POST",
         credentials: "include",
         headers: {
           "Content-Type": "application/json"
       },
      body: JSON.stringify(data),
     })
  
     console.log("Response is: ", response);
      if (response.status === 200) {
        console.log("login successful");
        this.setState({errorMessageVisible: false, logging: false});
        window.location.href = response.url;

      } else if (response.status === 401){
        console.log("Incorrect password or user");
        this.setState({errorMessageVisible: true, logging: false});
      }
    }
  }

  render() {
    return (
      <form className="container-box" onSubmit={this.submitHandler} id="login-form">
          <h4>Login</h4>
          <label htmlFor="username">Email</label>
          <br />
          <input name='email' onChange={this.changeHandler} type="email" id="email" required />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input name='password' onChange={this.changeHandler} type="password" id="password" required />
          <br />
          {this.state.logging ? <button className="nav-button" type="submit" disabled id="login-button">Logging...</button> 
          : <button className="nav-button" type="submit" id="login-button">Login</button>}
          <br />
          {this.state.errorMessageVisible && <p className="error-message" id="user-not-found"> Wrong email and/or password. </p>}
        </form>
    )
  }
}

export default LoginForm;