//imports 
import React, {Component} from 'react';


//creating the master component
class LatestWorkout extends Component {
  
  //setting state object for the master component
  state = { 
    loading: true,
    todayDate: '',
    yesterdayDate: '',
    workoutDate: '',
    workoutTime: '',
    latestWorkout: {}
   }



   
  async componentDidMount() {
    await this.findLatestWorkout();
    this.setWorkoutTimeAndDate();
    this.setState({loading: false});

  }
    
    
  findLatestWorkout = () => {
    for (let i = 0; i < this.props.workouts.length; i++) {
      if (this.props.workouts[i].email === this.props.user.email) {
        this.setState({latestWorkout: this.props.workouts[i]});
        break
      }
    }   
  }
  
  setWorkoutTimeAndDate = () => {

    let today = new Date();
    let offset = today.getTimezoneOffset();
    let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let workoutDateObject = new Date(Date.parse(this.state.latestWorkout.date_time));
    let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
    let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + workoutDateObject.getMinutes();
    this.setState({todayDate: todayDate, yesterdayDate: yesterdayDate, workoutDate: workoutDate, workoutTime: workoutTime });
  }

  render() {
    const { latestWorkout, workoutDate, workoutTime, todayDate, yesterdayDate } = this.state;




    if (!this.state.loading) {
      return (



          <div className="inner-container">

            <h5>Your last workout:</h5>
              <p>
                <a href={"/workouts/" + latestWorkout.id}>{latestWorkout.workout_name} </a>   
                  {(workoutDate === todayDate) && 'Today '}
                  {(workoutDate === yesterdayDate) && 'Yesterday ' }
                  {(workoutDate !== todayDate && workoutDate !== yesterdayDate) && workoutDate + ''}
                @ {workoutTime}
              </p>
          </div> 

    )


    } else {
      return (
        <div className="inner-container">
          <h2>Loading...</h2>
        </div>
      )
    }


      

  }

}

export default LatestWorkout;
