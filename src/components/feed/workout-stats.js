//imports 
import React from 'react';

//creating the master component
function WorkoutStats({workouts, workout_id}) {

  const calcWorkoutStats = () => {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    for (let i = 0; i < workouts.length; i++) {
      if (workouts[i].id === workout_id) {
        totalVolume += (workouts[i].avg_weight * workouts[i].avg_reps * workouts[i].sets);
        totalSets += workouts[i].sets;
        totalReps += workouts[i].avg_reps * workouts[i].sets;
      }
    }
  
    return (
      <div className="flex-container workout-summary">
        <h4 className="flex-summary-item">Sets: { totalSets }</h4>
        <h4 className="flex-summary-item">Reps: {(totalReps).toFixed(0) }</h4>
        <h4 className="flex-summary-item">Volume: {(totalVolume/1000).toFixed(1)} t</h4>
      </div>
    )
  }

  return (
    calcWorkoutStats(workouts, workout_id)
  )

}

export default WorkoutStats;