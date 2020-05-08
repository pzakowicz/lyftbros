//imports 
import React, {Component} from 'react';
import UserStats from './user-stats';
import {WorkoutProvider} from '../../context/workoutContext';


//creating the master component
class Feed extends Component {
  
  //setting state object for the master component
  state = { 

   }

  toggleForms = () => {
    this.setState(prevState => ({

    }))
  }


  render() {

    return (
      <WorkoutProvider>
    <div className="flex-container">
      <UserStats />
    </div>
    </WorkoutProvider>
    )
  }

}

export default Feed;