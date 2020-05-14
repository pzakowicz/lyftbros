//imports 
import React, {Component} from 'react';
import LatestWorkout from './latest-workout';
import Last4Months from './last4months';
import { connect } from 'react-redux';


//creating the master component
class UserStats extends Component {
   
  render() {
    const { user } = this.props;


      return (
        <div className="container-box" id="stat-container">
                    
          <h4>Welcome <a href={'/users/' + user.id}>{user.first_name}!</a></h4>  

          <LatestWorkout />
          <Last4Months />

        </div>
      
    )     

  }

}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(UserStats);
