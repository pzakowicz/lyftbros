//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';

class Logger extends Component {

  state = {
    category: this.props.lifts[0].category,
    lift: this.props.lifts[0].name,
    weight: 0,
    reps: 0,
    isEditable: false, 
    loggerVisible: true,
    saving: false
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  findFirstLift = (category) => {

    for (let i = 0; i < this.props.lifts.length; i++) {
      if (this.props.lifts[i].category === category) {
        return this.props.lifts[i].name;
      }
    }
  }

  changeCategory = (event) => {
    let lift = this.findFirstLift(event.target.value);
    if (event.target.value === 'Bodyweight' && this.props.user.weight) {
      this.setState({category: event.target.value, 
        lift: lift,
        weight: this.props.user.weight});
    } else {
      this.setState({category: event.target.value, 
        lift: lift,
        weight: 0});
    }
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

  addWeight = () => {
    this.setState(prevState => ({
      weight: prevState.weight + 1, 
    }))
  }

  addRep = () => {
    this.setState(prevState => ({
      reps: prevState.reps + 1, 
    }))

  }

  removeWeight = () => {
    if (this.state.weight >= 1) {
      this.setState(prevState => ({
        weight: prevState.weight - 1, 
      }))
    }
  }

  removeRep = () => {
    if (this.state.reps >= 1) {
      this.setState(prevState => ({
        reps: prevState.reps - 1, 
      }))
    }
  }

  render() {
    const { isEditable, category } = this.state;
    const { lifts, user } = this.props;

    return (

      <main id="training-main">
        <div className="w3-bar w3-black" id="tabs-container">
          <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>Log</button>
          <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>History</button>
        </div>

        <div id="Log" className="tab">

          <div className="container-box" id="log-training-container">
            <form id="log-training-form">
              <label>Category:</label>
              <select name="category" onChange={this.changeCategory} id="category" required>
                <option>Barbell</option> 
                <option>Dumbell</option> 
                <option>Bodyweight</option> 
                </select>
                <br />
              <label>Lyft:</label>
              <select id="lift" name="lift" onChange={this.changeHandler} required>
              { lifts.map((lift, i) => {
                          return (lift.category === category) ?
                            (<option key={i}>{lift.name}</option>)
                            : null
                        })}

              </select>
              <br />

              <label>Weight(kg):</label>
              <i className="fas fa-minus-square fa-2x" onClick={this.removeWeight}></i>
              <input name="weight" type="number" value={this.state.weight} id="weight" onChange={this.changeHandler} required />
              <i className="fas fa-plus-square fa-2x" onClick={this.addWeight}></i>
              {!user.weight ? <i className="fas fa-info-circle tooltip"><span className="tooltiptext">Tip: Log your weight in your account details to have it pre-populated for bodyweight exercises.</span></i> : null}
            

              <br />
              <label>Reps:</label>
              <i className="fas fa-minus-square fa-2x" onClick={this.removeRep}></i>
              <input name="reps" type="number" value={this.state.reps} id="reps" onChange={this.changeHandler} required />
              <i className="fas fa-plus-square fa-2x" onClick={this.addRep}></i>
              <div className="flex-container button-container">
                <button type="button" id="submit-set-button">Save set</button>
                <h5 className="link" id="add-new-lyft-button">Add new lyft</h5>
              </div>
            </form>
          </div>
        </div>
      </main>
    )
  }
  
}

const mapStateToProps = state => ({
  user: state.user,
  lifts: state.lifts,
});



export default connect(mapStateToProps)(Logger);