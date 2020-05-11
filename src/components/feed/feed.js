//imports 
import React, {Component} from 'react';
import UserStats from './user-stats';
import FeedMain from './feed-main';

export const WorkoutContext = React.createContext();
export const UserContext = React.createContext();
export const FistBumpsContext = React.createContext();

//creating the master component
class Feed extends Component {
  
  //setting state object for the master component
  state = { 
    loading: true,
    workouts: [],
    fistBumps: [],
    user: {}
   }

   async componentDidMount() {
    this.setState({loading: true})
   await fetch('api/workouts/')
   .then(data => data.json())
   .then(workouts => this.setState({workouts}))
   
   await fetch('api/workouts/fist-bumps/')
   .then(data => data.json())
   .then(fistBumps => this.setState({fistBumps}))

   await fetch('api/users/session/')
   .then(data => data.json())
   .then(user => this.setState({user, loading: false}))





 }


  render() {

    if (!this.state.loading){
      return (
        <WorkoutContext.Provider value={this.state.workouts}>
          <UserContext.Provider value={this.state.user}>
            <FistBumpsContext.Provider value={this.state.fistBumps}>
  
              <UserStats user={this.state.user} />
              <FeedMain />

            </FistBumpsContext.Provider>
          </UserContext.Provider>
        </WorkoutContext.Provider>
      )
    } else {
      return (
        <div className="flex-container">
        <h5>Loading..</h5>
      </div>
      )

    }


  }

}

export default Feed;