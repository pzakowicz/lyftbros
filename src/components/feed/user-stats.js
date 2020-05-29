//imports 
import React, {Component} from 'react';
import LatestWorkout from './latest-workout';
import Last4Weeks from './last4weeks';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';


//creating the master component
class UserStats extends Component {
   
  render() {
    const { user, workouts } = this.props;



      return (
        <div className="container-box" id="stat-container">
                    
          <h4>Welcome <Link to={'/users/' + user.id}>{user.first_name}!</Link></h4>  
  
          <LatestWorkout />
          <Last4Weeks user={user} workouts={workouts}/>
  
        </div>
      
    )     

  }

}

const mapStateToProps = state => ({
  user: state.user,
  workouts: state.workouts,
  isLoading: state.isLoading,
});

export default connect(mapStateToProps)(UserStats);
