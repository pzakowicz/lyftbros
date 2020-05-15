//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';



//creating the master component
function Leaderboard({workouts, user}) {

  //setting state
  const [workoutLeader, setWorkoutLeader] = useState([]);
  const [volumeLeader, setVolumeLeader] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect( () => {

    findVolumeLeader();
    findWorkoutLeader();

    setLoading(false);

  }, []);

  const findWorkoutLeader = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    let now = new Date();
    var tempResult = {}

    for(let { user_id, first_name, surname, date_time } of workouts)
    if ((Math.round(Math.abs((new Date(Date.parse(date_time)) - now) / oneDay))) <30 ) {
      tempResult[user_id] = { 
          id: user_id, 
          name: (first_name + ' ' + surname), 
          count: tempResult[user_id] ? tempResult[user_id].count + 1 : 1
      }      
    }

    let result = Object.values(tempResult)

    result.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

    setWorkoutLeader(result);
  }

  const findVolumeLeader = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    let now = new Date();
    var tempResult = {}

    for(let { user_id, first_name, surname, date_time, sets, avg_reps, avg_weight } of workouts)
    if ((Math.round(Math.abs((new Date(Date.parse(date_time)) - now) / oneDay))) <30 ) {
      tempResult[user_id] = { 
          id: user_id, 
          name: (first_name + ' ' + surname), 
          volume: tempResult[user_id] ? tempResult[user_id].volume + (sets * avg_reps * avg_weight) : (sets * avg_reps * avg_weight)
      }      
    }

    let result = Object.values(tempResult)

    result.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
    setVolumeLeader(result);
  }
   
    if (!loading) {

      return (
        <div className="container-box" id="leaderboard-container">

          <h4 id="leaderboard-heading">Leaderboards</h4>
          <p className="subtitle">(Last 4 weeks)</p>

          <div className="inner-container">
              <h5>Most workouts:</h5>

              {workoutLeader.map((user, i) => {
                return <div key={i} className="flex-container list-item">
                  <a href={"/users/" + user.id}>
                    <span>{(i+1) + '. ' + user.name}</span>
                  </a>
                  <span className="value">{user.count}</span>
                </div> 
              })}
          </div>

          <div className="inner-container">

              <h5>Total volume:</h5>
              {volumeLeader.map((user, i) => {
                return <div key={i} className="flex-container list-item">
                  <a href={"/users/" + user.id}>
                    <span>{(i+1) + '. ' + user.name}</span>
                  </a>
                  <span className="value">{(user.volume/1000).toFixed(1) + ' t'}</span>
                </div> 
              })}

          </div>

        </div>
          
          
    )


    } else {
      return (
        <div className="container-box" id="leaderboard-container">
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

export default connect(mapStateToProps)(Leaderboard);
