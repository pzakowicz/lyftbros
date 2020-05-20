//imports 
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {useParams} from 'react-router-dom';
import BroSummary from './bro-summary';
import Last4Weeks from '../feed/last4weeks';
import UserFeed from './user-feed';
import Prs from './prs';


//creating the master component
function UserDetails({workouts}) {

  const [thisUser, setThisUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userWorkouts, setUserWorkouts] = useState();


  let {user_id} = useParams();

  const findUser = () => {
    for (let i=0; i<workouts.length; i++) {
      if (workouts[i].user_id === Number(user_id)) {
        setThisUser({id: workouts[i].user_id, first_name: workouts[i].first_name, surname: workouts[i].surname, gender: workouts[i].gender});
        break
      }
    }
  }

  const findUserWorkouts = () => {
    let uniqueWorkoutsIds = []; 
    let uniqueWorkouts = [];
    for (let i = 0; i < workouts.length; i++) {
      if (!uniqueWorkoutsIds.includes(workouts[i].id) && workouts[i].user_id === Number(user_id)) {
        uniqueWorkoutsIds.push(workouts[i].id);
        uniqueWorkouts.push(workouts[i]);
      }
    }
    setUserWorkouts(uniqueWorkouts);
  
  }


  useEffect(() => {

    findUser();
    findUserWorkouts();
    setLoading(false);
    


  },[]) 

  if (!loading) {

    return (
      <main>
        <div className="container-box tile" id="user-summary-container">
          <BroSummary thisUser={thisUser} />
          <Last4Weeks user={thisUser} workouts={userWorkouts} />
        </div>
        <div id="user-activity-container">
          <UserFeed userWorkouts={userWorkouts} />
        </div>
        <div className="container-box tile" id="user-prs-container">
          <Prs thisUser={thisUser} workouts={userWorkouts} />
        </div>
      </main>

    )
  } else {
    return (

      <div>Loading...</div>
    )
  }

  
      

}



const mapStateToProps = state => ({
  isLoading: state.isLoading,
  workouts: state.workouts,
  fistBumps: state.fistBumps,
  user: state.user,
  sets: state.sets,
});

export default connect(mapStateToProps)(UserDetails);
