//imports 
import React, {useState, useEffect, useContext} from 'react';
import {WorkoutContext, UserContext} from './feed';


//creating the master component
function Workout({workout_id, workout_name, date_time, first_name, surname, user_id, lift_name, sets, avg_reps, avg_sets, avg_weight, max_weight }) {

  //importing context
  const workouts = useContext(WorkoutContext);
  const user = useContext(UserContext);

  //setting state

  const [loading, setLoading] = useState(true);
  const [currentWorkout, setCurrentWorkout] = useState();
  const [workoutDateTime, setWorkoutDateTime] = useState({});
  const [workoutStats, setWorkoutStats] = useState({});
  

  useEffect(() => {

    const setWorkoutTimeAndDate = () => {
      let today = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let offset = today.getTimezoneOffset();
      let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      let workoutDateObject = new Date(Date.parse(date_time));
      let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
      let formattedDate = (months[workoutDateObject.getMonth()+1]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
      let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + workoutDateObject.getMinutes();
      let workoutDateTime = {todayDate: todayDate, yesterdayDate: yesterdayDate, workoutDate: workoutDate, formattedDate: formattedDate, workoutTime: workoutTime };
      setWorkoutDateTime(workoutDateTime);
    }

    const calcWorkoutStats = () => {
      let totalVolume = 0;
      let totalSets = 0;
      let totalReps = 0;
      for (let i = 0; i < workouts.length; i++) {
        if (workouts[i].id === workout_id) {
          totalVolume += (workouts[i].avg_weight * workouts[i].avg_reps * workouts[i].sets);
          totalSets += workouts[i].sets;
          totalReps += workouts[i].avg_reps * workouts[i].sets;
        }
      }
      setWorkoutStats({totalVolume: totalVolume, totalSets: totalSets, totalReps: totalReps});
    }

    setWorkoutTimeAndDate();
    calcWorkoutStats();
    setLoading(false);

  }, []);
   
    if (!loading) {
      return (
        <div className="inner-container">
  
                <div className="container-box"> 
                  <h5 className="user-name"><a href={'/users/' + user_id}>{first_name} {surname}</a></h5>
                  <p className="subtitle">
                      {(workoutDateTime.workoutDate === workoutDateTime.todayDate) && 'Today '}
                      {(workoutDateTime.workoutDate === workoutDateTime.yesterdayDate) && 'Yesterday ' }
                      {(workoutDateTime.workoutDate !== workoutDateTime.todayDate && workoutDateTime.workoutDate !== workoutDateTime.yesterdayDate) && workoutDateTime.formattedDate + ''}
                      @ {workoutDateTime.workoutTime}
                  </p>
                  <h3 className="workout-name"><a href={"/workouts/" + workout_id}>{workout_name}</a></h3>
                  <div className="flex-container workout-summary">
                    <h4 className="flex-summary-item">Sets: { workoutStats.totalSets }</h4>
                    <h4 className="flex-summary-item">Reps: {(workoutStats.totalReps).toFixed(0) }</h4>
                    <h4 className="flex-summary-item">Volume: {(workoutStats.totalVolume/1000).toFixed(1)} t</h4>
                  </div>
                  <table className= "sets-table" id={"sets-table-" + workout_id }>
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

                        {/*add logic for looping through table row */}
                        { workouts.map((workout, i) => {
                          return workout.id === workout_id ? 
                          <tr key={i}>
                            <td width="100%">{workout.lift_name}</td>
                            <td width="10%">{workout.sets}</td>
                            <td width="10%">{(workout.avg_reps/1).toFixed(0)}</td>
                            <td width="10%">{(workout.avg_weight/1).toFixed(0)}<span className="unit"> kg</span></td>
                            <td width="10%">{workout.max_weight}<span className="unit"> kg</span></td>      
                          </tr> :
                          null
                        })}
                    </tbody>
                        
                      
               
                  </table>

                </div> 
  
  
      </div>
          
          
    )


    } else {
      return (
        <div className="inner-container">
          <h5>Loading...</h5>
        </div>
      )
    }


      



}

export default Workout;
