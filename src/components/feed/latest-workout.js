//imports 
import React, {useState, useEffect, useContext} from 'react';
import {WorkoutContext, UserContext} from './feed';

//creating the master component
function LatestWorkout() {

  //importing context
  const workouts = useContext(WorkoutContext);
  const user = useContext(UserContext);

  //setting state
  const [latestWorkout, setLatestWorkout] = useState({});
  const [workoutStats, setWorkoutStats] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

  let latestWorkout2 = {};
  const findLatestWorkout = () => {
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].user_id === user.id) {
        latestWorkout2 = workouts[i];
        setLatestWorkout(workouts[i]);
        break
      }
    }   
  }

  findLatestWorkout();

  const setWorkoutTimeAndDate = () => {
    let today = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let offset = today.getTimezoneOffset();
    let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let workoutDateObject = new Date(Date.parse(latestWorkout2.date_time));
    let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
    let formattedDate = (months[workoutDateObject.getMonth()+1]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
    let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + workoutDateObject.getMinutes();
    let userStats = {todayDate: todayDate, yesterdayDate: yesterdayDate, workoutDate: workoutDate, formattedDate: formattedDate, workoutTime: workoutTime };
    setWorkoutStats(userStats);
  }



  setWorkoutTimeAndDate();
  setLoading(false);

  }, []);

  if (!loading) {
    return (
      <div className="inner-container">

        <h5>Your last workout:</h5>
          <p>
            <a href={"/workouts/" + latestWorkout.id}>{latestWorkout.workout_name} </a>   
              {(workoutStats.workoutDate === workoutStats.todayDate) && 'Today '}
              {(workoutStats.workoutDate === workoutStats.yesterdayDate) && 'Yesterday ' }
              {(workoutStats.workoutDate !== workoutStats.todayDate && workoutStats.workoutDate !== workoutStats.yesterdayDate) && workoutStats.formattedDate + ''}
            @ {workoutStats.workoutTime}
          </p>
      </div> 
    )
  } else if (loading) {
    return (
      <div className="inner-container">

        <h5>Loading</h5>

      </div> 
    )
  }
  
    

}

export default LatestWorkout;