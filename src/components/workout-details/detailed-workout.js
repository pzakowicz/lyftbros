//imports 
import React, {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
//import {WorkoutContext, UserContext, FistBumpsContext} from '../feed/feed';


//creating the master component
function DetailedWorkout() {

  //importing context
  // const workouts = useContext(WorkoutContext);
  // const user = useContext(UserContext);
  // const fistBumps = useContext(FistBumpsContext);

  //getting params
  let {id} = useParams();

  //setting state
  const [loading, setLoading] = useState(true);
  const [workoutDateTime, setWorkoutDateTime] = useState({});
  const [workoutStats, setWorkoutStats] = useState({});
  const [fistBumpsCount, setFistBumpsCount] = useState(0);
  const [userHasBumped, setUserHasBumped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [localFistBumps, setLocalFistBumps] = useState([]);
  const [workout, setWorkout] = useState([]);
  const [fistBumps, setFistBumps] = useState([]);
  const [user, setUser] = useState([]);
  

  useEffect(() => {
 




    async function getWorkoutData() {
      await fetch(`../api/workouts/${id}`)
      .then(data => data.json())
      .then(table => setWorkout(table))

    }
      
    async function getFistBumps() {
      await fetch(`../api/fist-bumps/${id}`)
      .then(data => data.json())
      .then(table => {
        setLocalFistBumps(table);
        setFistBumpsCount(table.length);
        for (let i = 0; i < table.length; i++) {
          console.log(user.id)
          if (table[i].user_id === user.id) {
            setUserHasBumped(true);
          }
        }
      })

    }

    async function getUser() {
      await fetch('../api/users/session/')
     .then(data => data.json())
     .then(async table => await setUser(table))

    }


    getUser();
    getWorkoutData();
    getFistBumps();

    


    //hasUserBumped();
    setLoading(false);

  }, []);

  const hasUserBumped = () => {
    for (let i = 0; i < localFistBumps.length; i++) {
      if (localFistBumps[i].user_id === user.id) {
        //setUserHasBumped(true);
        return true
      }
    }
  }

  const calcWorkoutTimeAndDate = () => {
    if (workout.length > 0) {
      let today = new Date();
      let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let offset = today.getTimezoneOffset();
      let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
      let workoutDateObject = new Date(Date.parse(workout[0].date_time));
      let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
      let formattedDate = (months[workoutDateObject.getMonth()+1]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
      let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + workoutDateObject.getMinutes();
      return (
        <p className="subtitle">
                        {(workoutDate === todayDate) && 'Today '}
                        {(workoutDate === yesterdayDate) && 'Yesterday ' }
                        {(workoutDate !== todayDate && workoutDate !== yesterdayDate) && formattedDate + ''}
                        @ {workoutTime}
                    </p>
      )
    }
  }

  const calcWorkoutStats = () => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    for (let i = 0; i < workout.length; i++) {
        totalVolume += workout[i].weight * workout[i].reps;
        totalSets ++;
        totalReps += workout[i].reps;

    }
    //setWorkoutStats({totalVolume: totalVolume, totalSets: totalSets, totalReps: totalReps});
    return (
      <div>
        <h4 className="flex-summary-item">Sets: {totalSets }</h4>
        <h4 className="flex-summary-item">Reps: {(totalReps).toFixed(0) }</h4>
        <h4 className="flex-summary-item">Volume: {(totalVolume/1000).toFixed(1)} t</h4>
      </div>
    )
  }

  async function addFistBump() {
    const data = {
      workoutId: workout[0].id
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
  


   
    if (!loading && workout.length > 0) {
      return (



              <div>
                <div className="container-box"> 
                  <h5 className="user-name"><a href={'/users/' + workout[0].user_id}>{workout[0].first_name} {workout[0].surname}</a></h5>

                  {calcWorkoutTimeAndDate()}
                  
                  <h3 className="workout-name"><a href={"/workouts/" + workout[0].id}>{workout[0].workout_name}</a></h3>
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
                            <td width="70%">{workout.lift_name}</td>
                            <td width="10%">{workout.weight} <span className="unit">kg</span></td>
                            <td width="10%">{workout.reps}</td> 
                          </tr>)
                          
                        })}
                    </tbody>
                  </table>
                  <div className="flex-container comment-section">
                    <span onClick={toggleModal}>
                      { (fistBumpsCount > 0) 
                      ? <span>{fistBumpsCount} fist bumps!</span> 
                      : <span>Be the first one to bump your bro!</span>}
                            
                    </span>
                    <div id="button-container">
                      <button type="button" className="comment-button" onClick={addFistBump}>
                        { hasUserBumped() ? <i className="fas fa-hand-rock" ></i> 
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
                          return fistBump.workout_id === workout.workout_id ? 
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

export default DetailedWorkout;
