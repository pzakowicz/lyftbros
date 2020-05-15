//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';

//creating the master component
function LatestWorkout({workouts, user}) {

  const getLatestWorkout = () => {
    let latestWorkout = {};
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].user_id === user.id) {
        latestWorkout = workouts[i];

        break
      }
    }  
    let today = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let offset = today.getTimezoneOffset();
    let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let workoutDateObject = new Date(Date.parse(latestWorkout.date_time));
    let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
    let formattedDate = (months[workoutDateObject.getMonth()]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
    let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + workoutDateObject.getMinutes();

    return (
      <div className="inner-container">

        <h5>Your last workout:</h5>
          <p>
            <a href={"/workouts/" + latestWorkout.id}>{latestWorkout.workout_name} </a>   
          </p>
          <p>
              {(workoutDate === todayDate) && 'Today '}
              {(workoutDate === yesterdayDate) && 'Yesterday ' }
              {(workoutDate !== todayDate && workoutDate !== yesterdayDate) && formattedDate + ''}
            @ {workoutTime}
          </p>
      </div> 
    )

  }


    return (
      getLatestWorkout()

    )



  
    

}

const mapStateToProps = state => ({
  workouts: state.workouts,
  user: state.user,
});

export default connect(mapStateToProps)(LatestWorkout);