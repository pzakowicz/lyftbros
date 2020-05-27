//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';
import { loadWorkouts, loadSets } from '../../redux/thunks';
import { addSet, clearCurrentWorkout, removeSet } from '../../redux/actions';
import AddLift from './add-lift';
import History from './history';
import NewWorkout from './new-workout';
 
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
    liftExists: false,
    savingLift: false,
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
      weight: Number(prevState.weight) + 1, 
    }))

  }

  addRep = () => {
    this.setState(prevState => ({
      reps: Number(prevState.reps) + 1, 
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

  selectRow = (key) => {
    let set = this.props.currentWorkout[key];
    this.setState({
      category: set.category,
      lift: set.lift_name,
      liftId: set.lift_id,
      weight: Number(set.weight),
      reps: Number(set.reps),
      addCategory: set.category,
    })
  }

  formatDate = (date) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let workoutDateObject = new Date(Date.parse(date));
    let formattedDate = (months[workoutDateObject.getMonth()]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
    return formattedDate;
  }

  selectValue = (event) => {
    event.target.select();
  }

  fadeBiceps = () => {
    let biceps = document.getElementById("biceps-icon");
    biceps.style.display = 'inline-block';
    let op = 1;  // initial opacity
    let timer = setInterval(function () {
        if (op <= 0.3){
            clearInterval(timer);
            biceps.style.display = 'none';
        }
        biceps.style.opacity = op;
        biceps.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
  }

  isPR = () => {
    let liftArray = [];
    for (let i = 0; i < this.props.sets.length; i++) {
      if (this.props.sets[i].user_id === this.props.user.id && this.props.sets[i].lift_name === this.state.lift && this.props.sets[i].reps >= this.state.reps)  {
        liftArray.push(this.props.sets[i].weight)
      } 
    }
    for (let i = 0; i < this.props.currentWorkout.length; i++) {
      if (this.props.currentWorkout[i].lift_name === this.state.lift && this.props.currentWorkout[i].reps >= this.state.reps)  {
        liftArray.push(this.props.currentWorkout[i].weight)
      } 
    }
    liftArray.sort(function(a, b){return b-a});

      if (this.state.weight > liftArray[0]) {
        return 3
      } else if (this.state.weight <= liftArray[0] && this.state.weight > liftArray[1]) {
        return 2
      } else if (this.state.weight <= liftArray[1] && this.state.weight > liftArray[2]) { 
        return 1
      } else {
        return 0
      }
  }

  saveSet = () => {

    if (this.state.weight > 0 && this.state.reps > 0) {
      this.props.addSetToCurrentWorkout({lift_id: this.state.liftId, category: this.state.category, lift_name: this.state.lift, weight: Number(this.state.weight), reps: Number(this.state.reps), pr: this.isPR()});
      this.fadeBiceps();
    }
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
  
          <div id="Log" className="tab container-box">
            {this.state.loggerVisible ? 
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
                  <div className="flex-container">
                  <button onClick={this.saveSet} type="button" id="submit-set-button">Save set</button> 
                  <img id="biceps-icon" src="resources/biceps.png" />
                  </div>
                  
                  
                  <h5 onClick={this.toggleForms} className="link" id="add-new-lyft-button">Add new lyft</h5>
                </div>
              </form>
              
  
 :
            <AddLift toggleForms={this.toggleForms} category={this.state.category} />}
  

          </div>
            {this.props.currentWorkout.length > 0 ?
            <NewWorkout selectRow={this.selectRow} />
            : null}

        </main>
      )

    } else {
      return (

        <main id="training-main">
  
          <div className="w3-bar w3-black" id="tabs-container">
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>Log</button>
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>History</button>
          </div>

          <History sets={this.props.sets} user={this.props.user} formatDate={this.formatDate} lift={this.state.lift} />
  
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
  addSetToCurrentWorkout: (set) => dispatch(addSet(set)),
  clearWorkout: () => dispatch(clearCurrentWorkout()),
  deleteThisSet: (key) => dispatch(removeSet(key)),
  startLoadingWorkouts: () => dispatch(loadWorkouts()),
  startLoadingSets: () => dispatch(loadSets()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logger);