//imports 
import React, {Component} from 'react';

class RegisterForm extends Component {

  state = {
    name: '',
    surname: '',
    gender: '',
    email: '',
    password: '',
    creating: false,
    emailTaken: false
  }


  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  submitHandler = async (event) => {
    event.preventDefault();
    this.setState({ creating: true });
    const data = {
      first_name: this.state.name,
      surname: this.state.surname,
      gender: this.state.gender,
      email: this.state.email,
      password: this.state.password
    };
    console.log(data);

    let response = await fetch(`/api/users/`,
    {
       method: "POST",
       credentials: "include",
       headers: {
         "Content-Type": "application/json"
     },
    body: JSON.stringify(data),
   })

   console.log("Response is: ", response);
   if (response.status === 201) {
     console.log("User successfully created.");
     this.setState({creating: false, emailTaken: false});
     alert("User successfully created.");
     this.props.toggle();

   } else if (response.status === 400){
     console.log("Email already taken");
     this.setState({creating: false});
   }

    console.log("Response is: ", data);
    this.setState({creating: false, emailTaken: true});
  }

  render() {
    
    return (
      <div>
        
         <form className="container-box" id="create-form" onSubmit={this.submitHandler}>
          <h4>Create account</h4>
          <label htmlFor="name">Name</label>
          <br />
          <input name='name' onChange={this.changeHandler} type="text" id="name" required />
          <br />
          <label htmlFor="name">Surname</label>
          <br />
          <input type="text" id="surname" name='surname' onChange={this.changeHandler}  required />
          <br />
          <label htmlFor="male">Male</label>
          <input id="male" name="gender" onChange={this.changeHandler} type="radio" value="male" />
          <label htmlFor="female">Female</label>
          <input id="female" name="gender" onChange={this.changeHandler} type="radio" value="female" />
          <br />
          <label htmlFor="name">Email</label>
          <br />
          <input type="email" id="email-create" name='email' onChange={this.changeHandler}  required />
          <br />
          <label htmlFor="name">Password</label>
          <br />
          <input type="password" id="password-create" name='password' onChange={this.changeHandler} required />
          <br />
          {this.state.creating ? <button type="submit" className="nav-button" id="create-user" disabled>Creating...</button>
          : <button type="submit" className="nav-button" id="create-user">Create account</button>}
          <span className="link" id="cancel-create-account" onClick={this.props.toggle}>Cancel</span>
          {this.state.emailTaken && <p className="error-message" id="email-taken">Email already taken!</p>}
        </form>



      </div>
    )
  }
}

export default RegisterForm;