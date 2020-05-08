//imports 
import React, {Component} from 'react';


//creating the master component
class Last4Months extends Component {
  
  //setting state object for the master component
  state = { 
    loading: true,
    workoutCount: 0,
    totalVolume: 0,
    totalSets: 0,
    totalReps: 0

   }

   
  async componentDidMount() {

    await this.calcUserWorkouts();
    await this.calcWorkoutStats();

    this.setState({loading: false});

  }
    
  calcUserWorkouts = () => {
    let countedWorkouts = [];
    for (let i = 0; i < this.props.workouts.length; i++) {
      if (this.props.workouts[i].email === this.props.user.email && !countedWorkouts.includes(this.props.workouts[i].id)) {
        countedWorkouts.push(this.props.workouts[i].id)
      }
    }
    this.setState({workoutCount: countedWorkouts.length})
  }

  calcWorkoutStats = () => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    for (let i = 0; i < this.props.workouts.length; i++) {
      if (this.props.workouts[i].email === this.props.user.email) {
        totalVolume += (this.props.workouts[i].avg_weight * this.props.workouts[i].avg_reps * this.props.workouts[i].sets);
        totalSets += this.props.workouts[i].sets;
        totalReps += this.props.workouts[i].avg_reps * this.props.workouts[i].sets;
      }
    }
    this.setState({totalVolume: totalVolume, totalSets: totalSets, totalReps: totalReps});
  }


  render() {
    const { workoutCount, totalVolume, totalSets, totalReps } = this.state;




    if (!this.state.loading) {
      
      return (
        <div className="inner-container">
        <h5>Last 4 weeks:</h5>
  
          <div className="flex-container list-item">
            <span>Workouts: </span><span className="value">{workoutCount}</span> 
          </div> 

            <div className="flex-container list-item">
              <span>Sets: </span><span className="value">{ totalSets }</span>
            </div>
            <div className="flex-container list-item">
              <span>Reps: </span><span className="value">{(totalReps).toFixed(0) }</span>
            </div>
            <div className="flex-container list-item">
              <span>Volume: </span><span className="value">{(totalVolume/1000).toFixed(1)} t</span>
            </div>
  
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

export default Last4Months;
