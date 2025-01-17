//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



//creating the master component
function Leaderboard({workouts, isLoading}) {

  const findWorkoutLeader = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    let now = new Date();
    var tempResult = {}

    let uniqueWorkoutsIds = []; 
    let uniqueWorkouts = [];
    for (let i = 0; i < workouts.length; i++) {
      if (!uniqueWorkoutsIds.includes(workouts[i].id)) {
        uniqueWorkoutsIds.push(workouts[i].id);
        uniqueWorkouts.push(workouts[i]);
      }
    }

    for(let { user_id, first_name, surname, date_time } of uniqueWorkouts)
    if ((Math.round(Math.abs((new Date(Date.parse(date_time)) - now) / oneDay))) <30 ) {
      tempResult[user_id] = { 
          id: user_id, 
          name: (first_name + ' ' + surname), 
          count: tempResult[user_id] ? tempResult[user_id].count + 1 : 1
      }      
    }

    let result = Object.values(tempResult)

    result.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

    return (
      result.map((user, i) => {
        return <div key={i} className="flex-container list-item">
          <Link to={"/users/" + user.id}>
            <span>{(i+1) + '. ' + user.name}</span>
          </Link>
          <span className="value">{user.count}</span>
        </div> 
      })
    )
  }

  const findVolumeLeader = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    let now = new Date();
    var tempResult = {}

    for(let { user_id, first_name, surname, date_time, sets, avg_reps, avg_weight } of workouts)
    if ((Math.round(Math.abs((new Date(Date.parse(date_time)) - now) / oneDay))) <30 ) {
      tempResult[user_id] = { 
          id: user_id, 
          name: (first_name + ' ' + surname), 
          volume: tempResult[user_id] ? tempResult[user_id].volume + (sets * avg_reps * avg_weight) : (sets * avg_reps * avg_weight)
      }      
    }

    let result = Object.values(tempResult)

    result.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));

    return (

      result.map((user, i) => {
        return <div key={i} className="flex-container list-item">
          <Link to={"/users/" + user.id}>
            <span>{(i+1) + '. ' + user.name}</span>
          </Link>
          <span className="value">{(user.volume/1000).toFixed(1) + ' t'}</span>
        </div> 
      })
    )
  }
   
    if (!isLoading) {

      return (
        <div className="container-box" id="leaderboard-container">

          <h4 id="leaderboard-heading">Leaderboards</h4>
          <p className="subtitle">(Last 4 weeks)</p>

          <div className="inner-container">
              <h5>Most workouts:</h5>

              {findWorkoutLeader()}
          </div>

          <div className="inner-container">

              <h5>Total volume:</h5>
             
             {findVolumeLeader()}
          </div>

        </div>
          
          
    )


    } else {
      return (
        <div className="container-box" id="leaderboard-container">
          <h5>Loading...</h5>
        </div>
      )
    }

}


const mapStateToProps = state => ({
  workouts: state.workouts,
  isLoading: state.isLoading,

});

export default connect(mapStateToProps)(Leaderboard);
