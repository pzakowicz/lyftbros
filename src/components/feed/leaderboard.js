//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';



//creating the master component
function Leaderboard() {

  //setting state
  const [workoutLeader, setWorkoutLeader] = useState([]);
  const [volumeLeader, setVolumeLeader] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect( () => {

    async function getWorkoutLeaderboard() {
      await fetch('api/workouts/workoutLeader/')
     .then(data => data.json())
     .then(table => setWorkoutLeader(table))
    }

    getWorkoutLeaderboard();

    async function getVolumeLeaderboard() {
      await fetch('api/workouts/volumeLeader/')
      .then(data => data.json())
      .then(table => setVolumeLeader(table))
    }

    getVolumeLeaderboard();

    setLoading(false);

  }, []);
   
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
                    <span>{(i+1) + '. ' + user.first_name + ' ' + user.surname}</span>
                  </a>
                  <span className="value">{user.workouts}</span>
                </div> 
              })}
          </div>

          <div className="inner-container">

              <h5>Total volume:</h5>
              {volumeLeader.map((user, i) => {
                return <div key={i} className="flex-container list-item">
                  <a href={"/users/" + user.id}>
                    <span>{(i+1) + '. ' + user.first_name + ' ' + user.surname}</span>
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
