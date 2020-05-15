//imports 
import React, {useState, useEffect, useContext} from 'react';
import {WorkoutContext, UserContext, FistBumpsContext} from './feed';
import { connect } from 'react-redux';


//creating the master component
function SummaryWorkout({workout_id, workout_name, date_time, first_name, surname, user_id, user, fistBumps, workouts }) {

  //importing context
  //const workouts = useContext(WorkoutContext);
  //const user = useContext(UserContext);
  //const fistBumps = useContext(FistBumpsContext);

  //setting state

  const [loading, setLoading] = useState(true);
  const [workoutDateTime, setWorkoutDateTime] = useState({});
  const [workoutStats, setWorkoutStats] = useState({});
  const [fistBumpsCount, setFistBumpsCount] = useState();
  const [userHasBumped, setUserHasBumped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [localFistBumps, setLocalFistBumps] = useState([]);
  

  useEffect(() => {

    const setWorkoutTimeAndDate = () => {
      let today = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let offset = today.getTimezoneOffset();
      let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      let workoutDateObject = new Date(Date.parse(date_time));
      let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
      let formattedDate = (months[workoutDateObject.getMonth()]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
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

    const countFistBumps = () => {
      let count = 0; 
      for (let i = 0; i < fistBumps.length; i++) {
        if (fistBumps[i].workout_id === workout_id) {
          count++;
        }
      }
      setFistBumpsCount(count);
    }

    const userHasBumped = () => {
      for (let i = 0; i < fistBumps.length; i++) {
        if (fistBumps[i].workout_id === workout_id && fistBumps[i].user_id === user.id) {
          setUserHasBumped(true);
        }
      }
    }

    

    setWorkoutTimeAndDate();
    calcWorkoutStats();
    countFistBumps();
    userHasBumped();
    setLocalFistBumps(fistBumps);
    setLoading(false);

  }, []);

  async function addFistBump(e) {
    const data = {
      workoutId: workout_id
    };
    let response = await fetch(`/api/fist-bumps/add/`,
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    console.log("requested to add fist bump:", data);
    // check if fist bump has been added
    if (response.status === 201) {
      console.log("Fist bump added");
      setFistBumpsCount(fistBumpsCount + 1);
      setUserHasBumped(true);

      await fetch('api/fist-bumps/')
      .then(data => data.json())
      .then(fistBumps => setLocalFistBumps(fistBumps))

    }
  };

    const toggleModal = () => {
      setModalVisible(prevState => !prevState)
    }
  


   
    if (!loading) {
      return (

              <div>
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

                        { workouts.map((workout, i) => {
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
                  <div className="flex-container comment-section">
                    <span id={"comment-summary-" + workout_id} onClick={toggleModal}>
                      { (fistBumpsCount > 0) 
                      ? <span id={"fist-bump-count-" + workout_id}>{fistBumpsCount} fist bumps!</span> 
                      : <span>Be the first one to bump your bro!</span>}
                            
                    </span>
                    <div id="button-container">
                      <button type="button" className="comment-button"  onClick={addFistBump}>
                        { userHasBumped ? <i className="fas fa-hand-rock"></i> 
                          : <i className="far fa-hand-rock"></i> }
                      </button>
                      <button type="button" className="comment-button" id="comment"><i className="far fa-comment"></i></button>
                    </div> 
                  </div>
                </div>

                { modalVisible ? 
                  <div id="commentModal" className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={toggleModal}>&times;</span>
                      <table id="fist-bumps-table">
                        <thead>
                          <tr>
                            <th>Fist bumps</th>
                          </tr>
                        </thead>
                        <tbody>
                        {localFistBumps.map((fistBump, i) => {
                          return fistBump.workout_id === workout_id ? 
                          <tr key={i}>
                            <td><a href={"/users/"+ fistBump.user_id}>{fistBump.first_name} {fistBump.surname}</a></td>
                          </tr> 
                          : null
                        })}
                        </tbody>
                      </table>
                    </div>
                  </div> 
                : null}
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
  fistBumps: state.fistBumps

});

export default connect(mapStateToProps)(SummaryWorkout);
