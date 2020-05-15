//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';


//creating the master component
function Last4Months({workouts, user}) {


  //setting state
  const [workoutCount, setworkoutCount] = useState();
  const [workoutStats, setWorkoutStats] = useState({});
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const oneDay = 24 * 60 * 60 * 1000;
    let now = new Date();

    const calcUserWorkouts = () => {
      let countedWorkouts = [];
      for (let i = 0; i < workouts.length; i++ ) {
        if (workouts[i].user_id === user.id && !countedWorkouts.includes(workouts[i].id) && (Math.round(Math.abs((new Date(Date.parse(workouts[i].date_time)) - now) / oneDay))) <30) {
          countedWorkouts.push(workouts[i].id)
        }
      }
      setworkoutCount(countedWorkouts.length)
    }

    const calcWorkoutStats = () => {

      let totalVolume = 0;
      let totalSets = 0;
      let totalReps = 0;
      for (let i = 0; i < workouts.length; i++) {
        if (workouts[i].user_id === user.id && (Math.round(Math.abs((new Date(Date.parse(workouts[i].date_time)) - now) / oneDay))) <30) {
          totalVolume += (workouts[i].avg_weight * workouts[i].avg_reps * workouts[i].sets);
          totalSets += workouts[i].sets;
          totalReps += workouts[i].avg_reps * workouts[i].sets;
        }
      }
      setWorkoutStats({totalVolume: totalVolume, totalSets: totalSets, totalReps: totalReps});
    }

    calcUserWorkouts();
    calcWorkoutStats();
    setLoading(false);

  }, []);
   
    if (!loading) {
      
      return (
        <div className="inner-container">
        <h5>Last 4 weeks:</h5>
  
          <div className="flex-container list-item">
            <span>Workouts: </span><span className="value">{workoutCount}</span> 
          </div> 

            <div className="flex-container list-item">
              <span>Sets: </span><span className="value">{ workoutStats.totalSets }</span>
            </div>
            <div className="flex-container list-item">
              <span>Reps: </span><span className="value">{(workoutStats.totalReps).toFixed(0) }</span>
            </div>
            <div className="flex-container list-item">
              <span>Volume: </span><span className="value">{(workoutStats.totalVolume/1000).toFixed(1)} t</span>
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


const mapStateToProps = state => ({
  workouts: state.workouts,
  user: state.user,
});

export default connect(mapStateToProps)(Last4Months);
