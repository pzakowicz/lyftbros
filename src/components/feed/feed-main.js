//imports 
import React, {useState, useEffect, useContext} from 'react';
import {WorkoutContext, UserContext} from './feed';
import Workout from './workout';


//creating the master component
function FeedMain() {

  //importing context
  const workouts = useContext(WorkoutContext);
  const user = useContext(UserContext);

  //setting state

  const [loading, setLoading] = useState(true);
  const [uniqueWorkouts, setUniqueWorkouts] = useState([]);


  useEffect(() => {

    const loopThroughWorkouts = () => {
      
      let uniqueWorkoutsIds = []; 
      let uniqueWorkouts = [];
      for (let i = 0; i < workouts.length; i++) {
        if (!uniqueWorkoutsIds.includes(workouts[i].id)) {
          uniqueWorkoutsIds.push(workouts[i].id);
          uniqueWorkouts.push(workouts[i]);
        }
      }
      setUniqueWorkouts(uniqueWorkouts);
    
    }

    const objectToArray = () => {


    }




    loopThroughWorkouts();
    setLoading(false);

  }, []);
    if (!loading) {      
      return (
        <div>
          {uniqueWorkouts.map(
            (workout, i) => <Workout 
              key={i}
              workout_id={workout.id} 
              workout_name={workout.workout_name} 
              date_time={workout.date_time}
              first_name={workout.first_name}
              surname={workout.surname}
              user_id={workout.user_id}
              lift_name={workout.lift_name}
              sets={workout.sets}
              avg_reps={workout.avg_reps}
              avg_sets={workout.avg_sets}
              avg_weight={workout.avg_weight}
              max_weight={workout.max_weight}
            /> 
          )}
        </div>
          
          
    )


    } else {
      return (
        <div>
          <h5>Loading...</h5>
        </div>
      )
    }


      



}

export default FeedMain;
