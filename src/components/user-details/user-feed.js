//imports 
import React, {useState, useEffect} from 'react';
import SummaryWorkout from '../feed/summary-workout';
import { connect } from 'react-redux';


//creating the master component
function UserFeed({userWorkouts, user, fistBumps, workouts }) {

  //setting state

  const [loading, setLoading] = useState(true);


  useEffect(() => {


    setLoading(false);

  }, []);
    if (!loading) {      

      return (
        <div >
          {userWorkouts.map(
            (workout, i) => <SummaryWorkout 
              key={i}
              workout_id={workout.id} 
              workout_name={workout.workout_name} 
              date_time={workout.date_time}
              first_name={workout.first_name}
              surname={workout.surname}
              user_id={workout.user_id}
              workouts={workouts}
              user={user}
              fistBumps={fistBumps}

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
  user: state.user,
  fistBumps: state.fistBumps,
  workouts: state.workouts,

});

export default connect(mapStateToProps)(UserFeed);