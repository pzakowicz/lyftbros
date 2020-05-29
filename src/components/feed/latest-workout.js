//imports 
import React from 'react';
import { connect } from 'react-redux';
import DateTime from './date-time';

//creating the master component
function LatestWorkout({workouts, user, isLoading}) {

  const getLatestWorkout = () => {
    let latestWorkout = {};
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].user_id === user.id) {
        latestWorkout = workouts[i];

        break
      }
    }  

    return (
      <div className="inner-container">

        <h5>Your last workout:</h5>
          <p>
            <a href={"/workouts/" + latestWorkout.id}>{latestWorkout.workout_name} </a>   
          </p>
          <DateTime dateTime={latestWorkout.date_time}/>
      </div> 
    )

  }

  if (!isLoading) {
    
    return (
      getLatestWorkout()
    )

  } else {
    return (

      <p>Loading... </p>
    )
    }
  }


const mapStateToProps = state => ({
  workouts: state.workouts,
  user: state.user,
  isLoading: state.isLoading,
});

export default connect(mapStateToProps)(LatestWorkout);