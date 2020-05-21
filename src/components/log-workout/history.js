//imports 
import React, { Component, } from 'react';
import {Link } from 'react-router-dom';
 
class History extends Component {

  state = {
    addCategory: this.props.category,
    addLift: '',


    workoutVisible: false,
    liftExists: false,
    savingLift: false,
    savingWorkout: false,
    redirect: false,
  }

  populateHistory = () => {
    let filteredSets = this.props.sets.filter(set => set.user_id === this.props.user.id && set.lift_name === this.state.lift);
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
            <th colSpan="2">{this.props.formatDate(set.date_time)}</th>
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
    : (
      <div>
        <p>{"No " + this.props.lift + "s recorded yet."}</p>
        <p>{"Record a workout including a " + this.props.lift + " to see it here." }</p>
      </div>
    )
    
  }

  render() {
    return (

      <div id="History" className="tab container-box">
        {this.populateHistory()}
      </div>

    )
  }

}




export default History;