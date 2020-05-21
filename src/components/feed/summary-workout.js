//imports 
import React from 'react';
import { Link } from 'react-router-dom';
import DateTime from './date-time';
import WorkoutStats from './workout-stats';
import FistBumpSection from './fist-bump-section';



//creating the master component
function SummaryWorkout({workout_id, workout_name, date_time, first_name, surname, user_id, user, fistBumps, workouts }) {




  return (
    <div className="container-box"> 
      <h5 className="user-name"><Link to={'/users/' + user_id}>{first_name} {surname}</Link></h5>
      <DateTime dateTime={date_time} className="subtitle" />
      <h3 className="workout-name"><Link to={"/workouts/" + workout_id}>{workout_name}</Link></h3>
      <WorkoutStats workouts={workouts} workout_id={workout_id} />

      <table className= "sets-table">
        <thead>
          <tr>
            <th>Lyft</th>
            <th>Sets</th>
            <th>Avg reps</th>
            <th>Avg weight</th>
            <th>Max weight</th>
          </tr>
        </thead>
        <tbody>

            {workouts.map((workout, i) => {
              return workout.id === workout_id ? 
              <tr key={i}>
                <td width="100%">{workout.lift_name}</td>
                <td width="10%">{workout.sets}</td>
                <td width="10%">{(workout.avg_reps/1).toFixed(0)}</td>
                <td width="10%">{(workout.avg_weight/1).toFixed(0)}<span className="unit"> kg</span></td>
                <td width="10%">{workout.max_weight}<span className="unit"> kg</span></td>      
              </tr> : null
            })}
        </tbody>
      </table>
      <FistBumpSection fistBumps={fistBumps} user={user} workout_id={workout_id} />
    </div>
  )
}

export default SummaryWorkout;
