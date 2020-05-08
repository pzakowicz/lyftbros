//imports 
import React, {Component, useReducer} from 'react';
import LatestWorkout from './latest-workout';
import Last4Months from './last4months';


//creating the master component
class UserStats extends Component {
  
  //setting state object for the master component
  state = { 
    loading: true,
    workouts: [],
    user: {},
   }

   
  async componentDidMount() {
     this.setState({loading: true})
    await fetch('api/workouts/')
    .then(data => data.json())
    .then(workouts => this.setState({workouts}))
    
    await fetch('api/users/session/')
    .then(data => data.json())
    .then(user => this.setState({user, loading: false}))


  }
    



  


  render() {
    const { user, workouts, latestWorkout, workoutDate, workoutTime, todayDate, yesterdayDate  } = this.state;




    if (!this.state.loading) {
      return (
        <div className="container-box flex-container" id="stat-container">
                    
          <h4>Welcome <a href={'/users/' + user.id}>{user.first_name}!</a></h4>  

          <LatestWorkout workouts={this.state.workouts} user={this.state.user}/>
          <Last4Months workouts={this.state.workouts} user={this.state.user}/>

        </div>

          

      
    )


    } else {
      return (
        <div className="container-box" id="stat-container">
          <h2>Loading...</h2>
        </div>
      )
    }


      

  }

}

export default UserStats;
