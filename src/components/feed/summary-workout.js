//imports 
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadFistBumps } from '../../redux/thunks';



//creating the master component
function SummaryWorkout({workout_id, workout_name, date_time, first_name, surname, user_id, user, fistBumps, workouts, startLoadingFistBumps }) {


  //setting state
  const [loading, setLoading] = useState(true);
  const [workoutDateTime, setWorkoutDateTime] = useState({});
  const [workoutStats, setWorkoutStats] = useState({});
  const [fistBumpsCount, setFistBumpsCount] = useState(0);
  const [userHasBumped, setUserHasBumped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [localFistBumps, setLocalFistBumps] = useState([]);

  const countFistBumps = () => {
    for (let i = 0; i < fistBumps.length; i++) {
      if (fistBumps[i].workout_id === Number(workout_id)) {
        setFistBumpsCount(fistBumps[i].count);
        break
      }
    }
    
  }

  const hasUserBumped = () => {
    for (let i = 0; i < fistBumps.length; i++) {
      if (fistBumps[i].workout_id === workout_id && fistBumps[i].user_id === user.id) {
        setUserHasBumped(true);
      }
    }
  }
  

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
      let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + (('0' + (workoutDateObject.getMinutes())).slice(-2));
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
    countFistBumps();
    hasUserBumped();
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
      startLoadingFistBumps();
      setFistBumpsCount(fistBumpsCount + 1);
      setUserHasBumped(true);

    }
  };

    const toggleModal = () => {
      setModalVisible(prevState => !prevState)
    }
  


   
    if (!loading) {
      return (

              <div>
                <div className="container-box"> 
                  <h5 className="user-name"><Link to={'/users/' + user_id}>{first_name} {surname}</Link></h5>
                  <p className="subtitle">
                      {(workoutDateTime.workoutDate === workoutDateTime.todayDate) && 'Today '}
                      {(workoutDateTime.workoutDate === workoutDateTime.yesterdayDate) && 'Yesterday ' }
                      {(workoutDateTime.workoutDate !== workoutDateTime.todayDate && workoutDateTime.workoutDate !== workoutDateTime.yesterdayDate) && workoutDateTime.formattedDate + ''}
                      @ {workoutDateTime.workoutTime}
                  </p>
                  <h3 className="workout-name"><Link to={"/workouts/" + workout_id}>{workout_name}</Link></h3>
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
                  <div className="flex-container comment-section">
                    <span onClick={toggleModal}>
                      { fistBumpsCount === 0 && <span>Be the first one to bump your bro!</span>}
                      { fistBumpsCount === 1 && <span>{fistBumpsCount} fist bump!</span>}
                      { fistBumpsCount > 1 && <span>{fistBumpsCount} fist bumps!</span> }
                       
                    
                            
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
                            <td><Link to={"/users/"+ fistBump.user_id}>{fistBump.first_name} {fistBump.surname}</Link></td>
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

const mapDispatchToProps = dispatch => ({
  startLoadingFistBumps: () => dispatch(loadFistBumps()),

});

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SummaryWorkout);
