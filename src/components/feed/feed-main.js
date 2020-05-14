//imports 
import React, {useState, useEffect, useContext} from 'react';
//import {WorkoutContext, UserContext} from './feed';
import SummaryWorkout from './summary-workout';
import { connect } from 'react-redux';


//creating the master component
function FeedMain({workouts}) {

  //importing context
  //const workouts = useContext(WorkoutContext);


  //setting state

  const [loading, setLoading] = useState(true);
  const [uniqueWorkouts, setUniqueWorkouts] = useState([]);


  useEffect(() => {

    const findUniqueWorkouts = () => {
      
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

    findUniqueWorkouts();
    setLoading(false);

  }, []);
    if (!loading) {      
      return (
        <div >
          {uniqueWorkouts.map(
            (workout, i) => <SummaryWorkout 
              key={i}
              workout_id={workout.id} 
              workout_name={workout.workout_name} 
              date_time={workout.date_time}
              first_name={workout.first_name}
              surname={workout.surname}
              user_id={workout.user_id}
            /> 
          )}
        </div>
          
          
    )


    } else {
      return (
        <div>
          
        </div>
      )
    }


      



}



const mapStateToProps = state => ({
  workouts: state.workouts,

});

export default connect(mapStateToProps)(FeedMain);