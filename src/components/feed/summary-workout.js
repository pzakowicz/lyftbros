//imports 
import React from 'react';
import { Link } from 'react-router-dom';
import DateTime from './date-time';
import WorkoutStats from './workout-stats';
import FistBumpSection from './fist-bump-section';

//creating the master component
function SummaryWorkout({workout_id, workout_name, date_time, first_name, surname, userId, user, fistBumps, workouts, loading }) {

  if (!loading) {

    return (
      <div className="container-box">
        <div className="flex-container button-container">
          <h3 className="workout-name"><Link to={"/workouts/" + workout_id}>{workout_name}</Link></h3>
          <div>
            <h5 className="user-name"><Link to={'/users/' + userId}>{first_name} {surname}</Link></h5>
            <DateTime dateTime={date_time} className="subtitle" />
          </div> 
        </div>
        <div>
        {workouts.map((workout, j) => {
                 if (workout.id === workout_id && workout.pr === 3) {
                  return (<h5 key={j}><i className="fas fa-trophy gold"></i>{workout.lift_name} PR!</h5>)                  
                } else if (workout.id === workout_id && workout.pr === 2) {
                  return (<h5 key={j}><i className="fas fa-trophy silver"></i>{workout.lift_name} 2nd best!</h5>)
                } else if (workout.id === workout_id && workout.pr === 1) {
                  return (<h5 key={j}><i className="fas fa-trophy bronze"></i>{workout.lift_name} 3rd best!</h5>)
                } else {
                  return null
                }
              })}
        </div>
        <WorkoutStats workouts={workouts} workout_id={workout_id} />
        <table className= "sets-table">
          <thead>
            <tr>
              <th>Lyft</th>
              <th>Sets</th>
              <th>Avg reps</th>
              <th>Avg weight</th>
              {/* <th>Max weight</th> */}
            </tr>
          </thead>
          <tbody>

              {workouts.map((workout, i) => {
                return workout.id === workout_id ? 
                <tr key={i}>
                  <td width="100%">{workout.lift_name} 
                  {workout.pr === 3 ? <i className="fas fa-trophy gold"></i> : null}
                  {workout.pr === 2 ? <i className="fas fa-trophy silver"></i> : null}
                  {workout.pr === 1 ? <i className="fas fa-trophy bronze"></i> : null}
                  </td>
                  <td width="10%">{workout.sets}</td>
                  <td width="10%">{(workout.avg_reps/1).toFixed(0)}</td>
                  <td width="10%">{(workout.avg_weight/1).toFixed(0)}<span className="unit"> kg</span></td>
                  {/* <td width="10%">{workout.max_weight}<span className="unit"> kg</span></td>       */}
                </tr> : null
              })}
          </tbody>
        </table>
        <FistBumpSection fistBumps={fistBumps} user={user} workout_id={workout_id} />
      </div>
    )

  }
}

export default SummaryWorkout;
