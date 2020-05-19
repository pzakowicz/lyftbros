//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';
import { loadLifts } from '../../redux/thunks';
import { addSet, clearCurrentWorkout, removeSet } from '../../redux/actions';
 
class Logger extends Component {

  state = {
    category: this.props.lifts[0].category,
    lift: this.props.lifts[0].name,
    liftId: this.props.lifts[0].id,
    weight: 0,
    reps: 0,
    addCategory: this.props.lifts[0].category,
    addLift: '',
    loggerVisible: true,
    workoutVisible: false,
    liftExists: false,
    savingLift: false,
    savingWorkout: false,
    currentWorkout: [],
  }

  toggleForms = () => {
    this.setState(prevState => ({
      loggerVisible: !prevState.loggerVisible, 
    }))
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

  findLiftId = (category, name) => {
    for (let i = 0; i < this.props.lifts.length; i++) {
      if (this.props.lifts[i].category === category && this.props.lifts[i].name === name) {
        return this.props.lifts[i].id;
      } 
    }
  }

  changeCategory = (event) => {
    let category = event.target.value;
    let lift = this.findFirstLift(category);
    let liftId = this.findLiftId(category, lift);
    
    if (event.target.value === 'Bodyweight' && this.props.user.weight) {
      this.setState({
        category: category, 
        addCategory: category,
        lift: lift,
        liftId: liftId,
        weight: this.props.user.weight});
    } else {
      this.setState({
        category: category,
        addCategory: category, 
        lift: lift,
        liftId: liftId,
        weight: 0});
    }
  }

  changeLift = (event) => {
    let category = this.state.category;
    let lift = event.target.value;
    let liftId = this.findLiftId(category, lift);
    this.setState({
      lift: lift,
      liftId: liftId
    });
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

  saveNewLift = async () => {
    if (this.state.addCategory && this.state.addLift) {
      const data = {
        category: this.state.addCategory,
        name: this.state.addLift
      };
      this.setState({savingLift: true})
      //add to state placeholder
    
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
        this.setState({savingLift: false, loggerVisible: true})
        this.props.startLoadingLifts();

      } else if (response.status === 400) {
        this.setState({liftExists: true, savingLift: false})
      }
    } else {
      alert("Name cannot be blank.")
    }
  };

  populateSets = () => {
    let sortedSets = this.props.currentWorkout.sort((a,b) => (a.lift_name > b.lift_name) ? 1 : ((b.lift_name > a.lift_name) ? -1 : 0)); 
    return sortedSets.map((set, i) => {
      return (
        <tr onClick={() => this.selectRow(i)} key={i}>
          <td width="70%">{set.lift_name}</td>
          <td width="10%"><span className="weight">{set.weight}</span><span className="unit"> kg</span></td>
          <td width="10%">{set.reps}</td>
          <td width="10%"><i className="fas fa-trash" onClick={() => this.props.deleteThisSet(i)}></i></td>
        </tr>
      )
    })
  }

  selectRow = (key) => {
    let set = this.props.currentWorkout[key];
    this.setState({
      category: set.category,
      lift: set.lift_name,
      liftId: set.lift_id,
      weight: set.weight,
      reps: set.reps,
      addCategory: set.category,
    })
  }







  render() {
    const { lifts, user } = this.props;

    return (



        <div id="Log" className="tab">

          {this.state.loggerVisible ? 
          <div className="container-box" id="log-training-container">
            <form id="log-training-form">
              <label>Category:</label>
              <select name="category" onChange={this.changeCategory} id="category" value={this.state.category} required>
                <option>Barbell</option>
                <option>Dumbell</option>
                <option>Bodyweight</option>
                </select>
                <br />
              <label>Lift:</label>
              <select id="lift" name="lift" onChange={this.changeLift} value={this.state.lift} required>
              {lifts.map((lift, i) => {
                return lift.category === this.state.category ? 
              <option key={i}>{lift.name}</option> : null
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
                <button onClick={() => {this.props.addSetToCurrentWorkout({lift_id: this.state.liftId, category: this.state.category, lift_name: this.state.lift, weight: this.state.weight, reps: this.state.reps})}} type="button" id="submit-set-button">Save set</button>
                <h5 onClick={this.toggleForms} className="link" id="add-new-lyft-button">Add new lyft</h5>
              </div>
            </form>

          </div> :
          <div className="container-box" id="add-lyft-container">
            <label>Category:</label>
            <select onChange={this.changeHandler} defaultValue={this.state.category} name="addCategory" id="add-category">
              <option>Barbell</option>
              <option>Dumbell</option>
              <option>Bodyweight</option>
            </select>
            <br />
            <label>Name:</label>
            <input onChange={this.changeHandler} name="addLift" type="text" id="add-name" required />
            <br />
            <button onClick={this.saveNewLift} type="button" id="save-lyft-button">{this.state.savingLift ? "Adding..." : "Add lyft"}</button>
            <button onClick={this.toggleForms} type="button" id="cancel-lyft-button">Cancel</button>
            {this.state.liftExists ? <p className="error-message" id="lyft-exists">Lyft already exists!</p> : null }
          </div>}
          
          


  
          {this.props.currentWorkout.length > 0 ?
          <div className="container-box" id="new-workout-container"> 
            <div id="workout-table-container">
              <table id="workout-table">
                <thead>
                <tr>
                  <th width="60%">Lyft</th>
                  <th width="10%">Weight</th>
                  <th width="10%">Reps</th>
                  <th width="10%"><i className="fas fa-info-circle tooltip"><span className="tooltiptext">Tip: Tap a set to pre-fill the logger.</span></i></th>
                </tr>
                </thead>
                <tbody>
                  {this.populateSets()}
                {/* {this.props.currentWorkout.map((set, i) => {
                return (
              <tr key={i}>
                <td width="70%">{set.lift_name}</td>
                <td width="10%"><span className="weight">{set.weight}</span><span className="unit"> kg</span></td>
                <td width="10%">{set.reps}</td>
                <td width="10%"><i className="fas fa-trash" onClick={() => this.props.deleteThisSet(i)}></i></td>
              </tr> )
                

                
              })} */}
                </tbody>
              </table>
              <div className="flex-container button-container">
                <button type="button" id="save-workout-button">Save workout</button>
                <button onClick={this.props.clearWorkout} type="button" id="clear-workout-button">Clear workout</button>
              </div>
            </div>
          </div> 
          : null}
            

        </div>
    )
  }
  
}

const mapStateToProps = state => ({
  user: state.user,
  lifts: state.lifts,
  currentWorkout: state.currentWorkout,
});

const mapDispatchToProps = dispatch => ({
  startLoadingLifts: () => dispatch(loadLifts()),
  addSetToCurrentWorkout: (set) => dispatch(addSet(set)),
  clearWorkout: () => dispatch(clearCurrentWorkout()),
  deleteThisSet: (key) => dispatch(removeSet(key)),
});




export default connect(mapStateToProps, mapDispatchToProps)(Logger);