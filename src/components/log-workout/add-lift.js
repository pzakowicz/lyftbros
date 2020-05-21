//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';
import { loadLifts } from '../../redux/thunks';
 
class AddLift extends Component {

  state = {
    addCategory: this.props.category,
    addLift: '',
    liftExists: false,
    savingLift: false,
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  saveNewLift = async () => {
    if (this.state.addCategory && this.state.addLift) {
      const data = {
        category: this.state.addCategory,
        name: this.state.addLift
      };
      this.setState({savingLift: true})
    
      //add new exercise to database
      let response = await fetch(`/api/exercises/`,
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (response.status === 201) {
        alert("Lift added!");
        this.props.startLoadingLifts();
        this.setState({savingLift: false})
        this.props.toggleForms();

      } else if (response.status === 400) {
        this.setState({liftExists: true, savingLift: false})
      }
    } else {
      alert("Name cannot be blank.")
    }
  };


  render() {
    return (
            <div className="container-box" id="add-lyft-container">
              <label>Category:</label>
              <select onChange={this.changeHandler} defaultValue={this.props.category} name="addCategory" id="add-category">
                <option>Barbell</option>
                <option>Dumbell</option>
                <option>Bodyweight</option>
              </select>
              <br />
              <label>Name:</label>
              <input onChange={this.changeHandler} name="addLift" type="text" id="add-name" required />
              <br />
              <button onClick={this.saveNewLift} type="button" id="save-lyft-button">{this.state.savingLift ? "Adding..." : "Add lyft"}</button>
              <button onClick={this.props.toggleForms} type="button" id="cancel-lyft-button">Cancel</button>
              {this.state.liftExists ? <p className="error-message" id="lyft-exists">Lyft already exists!</p> : null }
            </div>
    )
  }
}


  const mapDispatchToProps = dispatch => ({
    startLoadingLifts: () => dispatch(loadLifts()),
  });

export default connect(null, mapDispatchToProps)(AddLift);