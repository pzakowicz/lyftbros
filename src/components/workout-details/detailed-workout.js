//imports 
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DateTime from '../feed/date-time';
import FistBumpSection from '../feed/fist-bump-section';

//creating the master component
function DetailedWorkout( { fistBumps, user, sets }) {

  //getting params
  let {workout_id} = useParams();

  //setting state
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState([]);

  
  useEffect(() => {
 
    function findThisWorkout() {

      let thisWorkout = [];
      for (let i = 0; i < sets.length; i++) {
        if (sets[i].id === Number(workout_id)) {
          thisWorkout.push(sets[i]);
        }
      }
      setWorkout(thisWorkout);
    }

    findThisWorkout();
    setLoading(false);

  }, []);

  const calcWorkoutStats = () => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    for (let i = 0; i < workout.length; i++) {
        totalVolume += workout[i].weight * workout[i].reps;
        totalSets ++;
        totalReps += workout[i].reps;
  }

    return (
      <div>
        <h4 className="flex-summary-item">Sets: {totalSets }</h4>
        <h4 className="flex-summary-item">Reps: {(totalReps).toFixed(0) }</h4>
        <h4 className="flex-summary-item">Volume: {(totalVolume/1000).toFixed(1)} t</h4>
      </div>
    )
  }
  
    if (!loading) {
      console.log(workout);
      return (

              <main >
                <div className="container-box" id="workout-container"> 
                  <div className="flex-container button-container">
                    <h3 className="workout-name"><Link to={"/workouts/" + workout[0].id}>{workout[0].workout_name}</Link></h3>
                    <div>
                      <h5 className="user-name"><Link to={'/users/' + workout[0].user_id}>{workout[0].first_name} {workout[0].surname}</Link></h5>
                      <DateTime dateTime={workout[0].date_time} className="subtitle" />
                    </div> 
                  </div>
                  <div>
                    {workout.map((workout, j) => {
                      if (workout.pr === 3) {
                        return (<h5 key={j}><i className="fas fa-trophy gold"></i>{workout.lift_name} PR!</h5>)                  
                      } else if (workout.pr === 2) {
                        return (<h5 key={j}><i className="fas fa-trophy silver"></i>{workout.lift_name} 2nd best!</h5>)
                      } else if (workout.pr === 1) {
                        return (<h5 key={j}><i className="fas fa-trophy bronze"></i>{workout.lift_name} 3rd best!</h5>)
                      } else {
                        return null
                      }
                    })}
                        
                  </div>
                  
                  
                  <div className="flex-container workout-summary">
                  {calcWorkoutStats()}
                  </div>
                  <table className= "sets-table" id={"sets-table-" + workout[0].id }>
                    <thead>
                      <tr>

                      <th width="70%">Lyft</th>
                      <th width="10%">Weight</th>
                      <th width="10%">Reps</th>
                      </tr>
                    </thead>
                    <tbody>

                        { workout.map((workout, i) => {
                          return (<tr key={i}>
                            <td width="70%">{workout.lift_name} 
                            {workout.pr === 3 ? <i className="fas fa-trophy gold"></i> : null}
                            {workout.pr === 2 ? <i className="fas fa-trophy silver"></i> : null}
                            {workout.pr === 1 ? <i className="fas fa-trophy bronze"></i> : null}
                            </td>
                            <td width="10%">{workout.weight} <span className="unit">kg</span></td>
                            <td width="10%">{workout.reps}</td> 
                          </tr>)
                          
                        })}
                    </tbody>
                  </table>
                  <FistBumpSection fistBumps={fistBumps} user={user} workout_id={Number(workout_id)} />

                </div>
              </main>          
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
  fistBumps: state.fistBumps,
  user: state.user,
  sets: state.sets,
});


export default connect(mapStateToProps)(DetailedWorkout);
