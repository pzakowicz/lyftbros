//imports 
import React, { Component, } from 'react';
import { connect } from 'react-redux';

 
class History extends Component {

  populateHistory = () => {
    let userWorkouts = this.props.workouts.filter(workout => workout.user_id === this.props.user.id);
    
  }

  render() {
    const { workouts } = this.props;

    return (

      <div id="History" className="tab container-box">
        {this.populateHistory()}



      </div>

    )
  }
  
}

const mapStateToProps = state => ({
  workouts: state.workouts,
  user: state.user,
});






export default connect(mapStateToProps)(History);