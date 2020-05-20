//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';
import { loadLifts, loadWorkouts, loadSets } from '../../redux/thunks';
import { addSet, clearCurrentWorkout, removeSet } from '../../redux/actions';
import {Link, Redirect } from 'react-router-dom';
 
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
    logTabVisible: true,
    workoutVisible: false,
    liftExists: false,
    savingLift: false,
    savingWorkout: false,
    redirect: false,
  }

  toggleForms = () => {
    this.setState(prevState => ({
      loggerVisible: !prevState.loggerVisible, 
    }))
  }

  toggleTabs = () => {
    this.setState(prevState => ({
      logTabVisible: !prevState.logTabVisible, 
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

  formatDate = (date) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let workoutDateObject = new Date(Date.parse(date));
    let formattedDate = (months[workoutDateObject.getMonth()]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
    return formattedDate;
  }

  populateHistory = () => {
    let filteredSets = this.props.sets.filter(set => set.user_id === this.props.user.id && set.lift_name === this.state.lift);
    console.log(filteredSets);
    let sortedSets = filteredSets.sort((a,b) => (a.date_time > b.date_time) ? -1 : ((b.date_time > a.date_time) ? 1 : 0)); 
    let uniqueSetIds = []; 
    let uniqueSets = [];
    for (let i = 0; i < sortedSets.length; i++) {
      if (!uniqueSetIds.includes(sortedSets[i].id)) {
        uniqueSetIds.push(sortedSets[i].id);
        uniqueSets.push(sortedSets[i]);
      }
    }
    return uniqueSets.length > 0 ? 
      uniqueSets.map((set, i) => {
      let currentWorkout = set.id;
      return  (
      <table key={set.id} id={set.id}>
        <thead>
          <tr> 
            <th><Link to={'/workouts/' + set.id}>{set.workout_name}</Link></th>
            <th colSpan="2">{this.formatDate(set.date_time)}</th>
          </tr>
        </thead>
          <tbody>
          {sortedSets.map((set, i) => {
            return set.id === currentWorkout ? 
            <tr key={i}>
            <td width="50%">{set.lift_name}</td>
            <td width="20%">{set.weight} kg</td>
            <td width="20%">{set.reps} reps</td>
          </tr> : null
          })}
          </tbody>
      </table>
      ) 
      
    })
    : (<h5>{"No " + this.state.lift + "s recorded yet. Record a workout including a " + this.state.lift + " to see it here." }</h5>)
    
  }

  saveWorkout = async () => {
    if (this.props.currentWorkout.length > 0) {
      let workoutName = prompt("Give your workout a name", "Lyft session");
      if (workoutName) {
        this.setState({savingWorkout: true})
        //save workout
        let data = {
          name: workoutName,
        };
        let response = await fetch(`/api/workouts/`,
        {
           method: "POST",
           headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
        })
        let json = await response.json();

        let workoutId = json.workout[0].id;
        if (response.status === 201) {
            //save sets
            const data = {};
            data.sets = [];
            for (let i = 0; i < this.props.currentWorkout.length; i++) { 
              data.sets.push([this.props.currentWorkout[i].lift_id, this.props.currentWorkout[i].weight, this.props.currentWorkout[i].reps, workoutId]);
            };
            let response = await fetch(`/api/sets/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            })
            if (response.status === 201) {
              this.props.clearWorkout();
              this.props.startLoadingWorkouts();
              this.props.startLoadingSets();
              this.setState({savingWorkout: false, redirect: true});
              
            } else {
              alert("Failed to save sets, try again.");
              this.setState({savingWorkout: false});
            }
          } else {
            alert("Failed to save workout, try again.");
            this.setState({savingWorkout: false});
          }
      } else {
        alert("Workout name cannot be empty")
      }

    } else {
      alert("Add at least one set to save a workout.")
    }

  
  }

  selectValue = (event) => {
    event.target.select();
  }
    

  render() {
    const { lifts, user } = this.props;

    if (this.state.logTabVisible) {

      return (

        <main id="training-main">
  
          <div className="w3-bar w3-black" id="tabs-container">
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>Log</button>
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>History</button>
          </div>
  
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
                <input name="weight" type="number" value={this.state.weight} id="weight" onChange={this.changeHandler} onClick={this.selectValue} required />
                <i className="fas fa-plus-square fa-2x" onClick={this.addWeight}></i>
                {!user.weight ? <i className="fas fa-info-circle tooltip"><span className="tooltiptext">Tip: Log your weight in your account details to have it pre-populated for bodyweight exercises.</span></i> : null}
              
  
                <br />
                <label>Reps:</label>
                <i className="fas fa-minus-square fa-2x" onClick={this.removeRep}></i>
                <input name="reps" type="number" value={this.state.reps} id="reps" onChange={this.changeHandler} onClick={this.selectValue} required />
                <i className="fas fa-plus-square fa-2x" onClick={this.addRep}></i>
                <div className="flex-container button-container">
                  <button onClick={() => { if (this.state.weight > 0 && this.state.reps > 0) {
                    this.props.addSetToCurrentWorkout({lift_id: this.state.liftId, category: this.state.category, lift_name: this.state.lift, weight: this.state.weight, reps: this.state.reps})}}
                  } type="button" id="submit-set-button">Save set</button>
                  
                  
                  <h5 onClick={this.toggleForms} className="link" id="add-new-lyft-button">Add new lyft</h5>
                </div>
              </form>
              {this.state.redirect && <Redirect push to="/feed" />}
  
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
                  </tbody>
                </table>
                <div className="flex-container button-container">
                  <button onClick={this.saveWorkout} type="button" id="save-workout-button">Save workout</button>
                  <button onClick={this.props.clearWorkout} type="button" id="clear-workout-button">Clear workout</button>
                  
                </div>
              </div>
            </div> 
            : null}

              
  
          </div>

  
        </main>
      )

    } else {
      return (

        <main id="training-main">
  
          <div className="w3-bar w3-black" id="tabs-container">
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>Log</button>
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>History</button>
          </div>
  
          <div id="History" className="tab container-box">
            {this.populateHistory()}
            
          </div>
  
        </main>

      )
    }


  }
  
}

const mapStateToProps = state => ({
  user: state.user,
  lifts: state.lifts,
  currentWorkout: state.currentWorkout,
  sets: state.sets,
});

const mapDispatchToProps = dispatch => ({
  startLoadingLifts: () => dispatch(loadLifts()),
  addSetToCurrentWorkout: (set) => dispatch(addSet(set)),
  clearWorkout: () => dispatch(clearCurrentWorkout()),
  deleteThisSet: (key) => dispatch(removeSet(key)),
  startLoadingWorkouts: () => dispatch(loadWorkouts()),
  startLoadingSets: () => dispatch(loadSets()),
});




export default connect(mapStateToProps, mapDispatchToProps)(Logger);