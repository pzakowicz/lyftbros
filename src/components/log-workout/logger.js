//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';

class Logger extends Component {

  state = {
    first_name: this.props.user.first_name,
    surname: this.props.user.surname,
    email: this.props.user.email,
    gender: this.props.user.gender,
    dob: this.props.user.date_of_birth,
    weight: this.props.user.weight,
    isEditable: false, 
    loggerVisible: true,
    saving: false
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  submitHandler = async (event) => {
    event.preventDefault();
    this.setState({ saving: true });
    let data = {
      name: this.state.first_name,
      surname: this.state.surname,
      email: this.state.email,
      gender: this.state.gender,
      dob: new Date(Date.parse(this.state.dob)).getFullYear() + '-' + ('0' + (new Date(Date.parse(this.state.dob)).getMonth()+1)).slice(-2) + '-' + ('0' + new Date(Date.parse(this.state.dob)).getDate()).slice(-2),
      weight: this.state.weight,
    };
    if (data) {
      let response = await fetch(`/api/users/`,
      {
         method: "PUT",
         credentials: "include",
         headers: {
           "Content-Type": "application/json"
       },
      body: JSON.stringify(data),
     })
  
     console.log("Response is: ", response);
      if (response.status === 201) {
        console.log("User successfully updated");
        this.setState({isEditable: false, saving: false});

      } else if (response.status === 400){
        console.log("Failed to update user");
        this.setState({isEditable: false, saving: false});
      }
    }
  }

  toggleTabs = () => {
    this.setState(prevState => ({
      loggerVisible: !prevState.loggerVisible, 
    }))
  }

  getUserDob = () => {
    if (this.props.user.date_of_birth) {
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let dateObject = new Date(Date.parse(this.props.user.date_of_birth));
      let formattedDate = (months[dateObject.getMonth()]) + ' ' + dateObject.getDate()+', '+dateObject.getFullYear();
      return formattedDate;
    }
  }

  render() {

    const { isEditable } = this.state;

    return (

          <main>
            <div className="w3-bar w3-black" id="tabs-container">
              <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>Log</button>
              <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>History</button>
            </div>

            {/* <form id="log-training-form">
              <label for="category">Category:</label>
              <select name="category" onChange={this.changeHandler} id="category" required>
                <option>Barbell</option> 
                <option>Dumbell</option> 
                <option>Bodyweight</option> 
                </select>
                <br />
              <label for="lyft">Lyft:</label>
              <select id="lyft" name="lyft" onChange={this.changeHandler} required>
                <%for (let i = 0; i < lifts.length; i++) { %>
                  <% if (lifts[i].category === "Barbell") { %>
                  <option><%= lifts[i].name %></option> 
                  <% } %>
                <% } %>
              </select>
              <br />

              <label for="weight">Weight(kg):</label>
              <i className="fas fa-minus-square fa-2x" onClick="removeWeight()"></i>
              <input type="number" id="weight" value="0" onClick="this.select()" required>
              <i className="fas fa-plus-square fa-2x" onClick="addWeight()"></i>
              <% if (!user.weight) { %>
                <i className="fas fa-info-circle tooltip"><span className="tooltiptext">Tip: Log your weight in your account details to have it pre-populated for bodyweight exercises.</span></i>
                <% } else { %>
                  <span className="hidden" id="user-weight"><%= user.weight %></span>
                <% } %>
              <br />
              <label for="reps">Reps:</label>
              <i className="fas fa-minus-square fa-2x" onClick="removeRep()"></i>
              <input type="number" id="reps" value="0" onClick="this.select()" required>
              <i className="fas fa-plus-square fa-2x" onClick="addRep()"></i>
              <div className="flex-container button-container">
                <button type="button" id="submit-set-button">Save set</button>
                <h5 className="link" id="add-new-lyft-button">Add new lyft</h5>
              </div>
            </form> */}




            <form className="container-box" id="account-details-container" onSubmit={this.submitHandler}>
              <h4>Your account details</h4>
              <label>Name: </label>{ !isEditable ? <span id="user-name">{this.state.first_name}</span> : <input name="first_name" onChange={this.changeHandler} type="text" id="user-name-input" value={this.state.first_name}  required />}
              <br/>
              <label>Surname: </label>{ !isEditable ? <span id="user-surname">{this.state.surname}</span> : <input name="surname" onChange={this.changeHandler}type="text" id="user-surname-input" value={this.state.surname} required />}
              <br/>
              <label>Email: </label>{ !isEditable ? <span id="user-email">{this.state.email}</span> : <input name="email" onChange={this.changeHandler}type="email" id="user-email-input" required value={this.state.email} />}
              <br/>
              <label>Gender: </label>{ !isEditable ? <span id="user-gender">{this.state.gender}</span> :
              <select name="gender" onChange={this.changeHandler} id="user-gender-input" value={this.state.gender} required>
                  <option value="male">male</option>
                  <option value="female">female</option>
              </select>}
              <br/>
              <label>Date of birth: </label>{ !isEditable ? <span id="user-dob">{ this.state.dob && this.getUserDob() }</span> : <input name="dob" onChange={this.changeHandler} type="date" id="user-dob-input" value={
                new Date(Date.parse(this.state.dob)).getFullYear() + '-' + ('0' + (new Date(Date.parse(this.state.dob)).getMonth()+1)).slice(-2) + '-' + ('0' + new Date(Date.parse(this.state.dob)).getDate()).slice(-2)} required />}
              <br/>
              <label>Weight (kg): </label>{ !isEditable ? <span id="user-weight">{ this.state.weight && this.state.weight }</span> : 
              <input name="weight" onChange={this.changeHandler} type="number" id="user-weight-input" required value={this.state.weight} />}
              <br/>
              { !isEditable ? <button type="button" id="edit-account-button" onClick={this.toggleEditability}>Edit</button> :
              <div>
                <button type="submit" id="save-account-button">{this.state.saving ? 'Saving...' : 'Save'}</button>
                <button type="button" id="cancel-changes-button" onClick={this.toggleEditability}>Cancel</button>
              </div>}
            </form>
          </main>

    )
  }
  
}

const mapStateToProps = state => ({
  user: state.user,
});



export default connect(mapStateToProps)(Logger);