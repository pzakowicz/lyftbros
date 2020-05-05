//imports 
import React, {Component} from 'react';

class RegisterForm extends Component {

  state = {
    creating: false,
    created: false,
    emailTaken: false
  }

  showForm = () => {
    this.setState({formVisible: true})
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  submitHandler = async (event) => {
    event.preventDefault();
    this.setState({ creating: true });

  }

  render() {
    return (
      <div>
        
         <form className="container-box" id="create-form" onSubmit={this.submitHandler}>
          <h4>Create account</h4>
          <label htmlFor="name">Name</label>
          <br />
          <input type="text" id="name" name='name' onChange={this.changeHandler} value="" required />
          <br />
          <label htmlFor="name">Surname</label>
          <br />
          <input type="text" id="surname" name='surname' onChange={this.changeHandler} value="" required />
          <br />
          <label htmlFor="male">Male</label>
          <input id="male" name="gender" type="radio" value="male" />
          <label htmlFor="female">Female</label>
          <input id="female" name="gender" type="radio" value="female" />
          <br />
          <label htmlFor="name">Email</label>
          <br />
          <input type="email" id="email-create" name='email' onChange={this.changeHandler} value="" required />
          <br />
          <label htmlFor="name">Password</label>
          <br />
          <input type="password" id="password-create" name='password' onChange={this.changeHandler} value="" required />
          <br />
          <button type="button" className="nav-button" id="create-user">Create account</button>
          <span className="link" id="cancel-create-account">Cancel</span>
          {this.state.emailTaken && <p className="error-message" id="email-taken">Email already taken!</p>}
        </form>


        {this.state.created && <div id="user-created">
          <h4>User successfully created!</h4>
        </div>}

      </div>
    )
  }
}

export default RegisterForm;