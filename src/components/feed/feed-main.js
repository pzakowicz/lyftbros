//imports 
import React, {useState, useEffect} from 'react';
import SummaryWorkout from './summary-workout';
import { connect } from 'react-redux';


//creating the master component
function FeedMain({workouts, user, fistBumps, sets}) {

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
        <div id="feed-container" >
          {uniqueWorkouts.map(
            (workout, i) => <SummaryWorkout 
              key={i}
              workout_id={workout.id} 
              workout_name={workout.workout_name} 
              date_time={workout.date_time}
              first_name={workout.first_name}
              surname={workout.surname}
              userId={workout.user_id}
              workouts={workouts}
              user={user}
              fistBumps={fistBumps}
              loading={loading}
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
  user: state.user,
  fistBumps: state.fistBumps,
  sets: state.sets,

});

export default connect(mapStateToProps)(FeedMain);