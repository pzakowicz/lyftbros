//imports 
import React, {useState, useEffect} from 'react';



//creating the master component
function Last4Weeks({workouts, user}) {

  const oneDay = 24 * 60 * 60 * 1000;
  let now = new Date();

  const calcUserWorkouts = () => {
    let countedWorkouts = [];
    for (let i = 0; i < workouts.length; i++ ) {
      if (workouts[i].user_id === user.id && !countedWorkouts.includes(workouts[i].id) && (Math.round(Math.abs((new Date(Date.parse(workouts[i].date_time)) - now) / oneDay))) <30) {
        countedWorkouts.push(workouts[i].id)
      }
    }
    return countedWorkouts.length
    
  }

  const calcWorkoutStats = () => {

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].user_id === user.id && (Math.round(Math.abs((new Date(Date.parse(workouts[i].date_time)) - now) / oneDay))) <30) {
        totalVolume += (workouts[i].avg_weight * workouts[i].avg_reps * workouts[i].sets);
        totalSets += workouts[i].sets;
        totalReps += workouts[i].avg_reps * workouts[i].sets;
      }
    }
    
    return (
      <div>
        <div className="flex-container list-item">
          <span>Sets: </span><span className="value">{totalSets}</span>
        </div>
        <div className="flex-container list-item">
          <span>Reps: </span><span className="value">{totalReps.toFixed(0) }</span>
        </div>
        <div className="flex-container list-item">
          <span>Volume: </span><span className="value">{(totalVolume/1000).toFixed(1)} t</span>
        </div>
      </div>
    )
  }

   

      
      return (
        <div className="inner-container">
          <h5>Last 4 weeks:</h5>
  
          <div className="flex-container list-item">
            <span>Workouts: </span><span className="value">{calcUserWorkouts()}</span> 
          </div> 
          {calcWorkoutStats()}
        </div>
          
          
    )


}

export default Last4Weeks;
