//imports 
import React, {useState} from 'react';
import { connect } from 'react-redux';
import { loadWorkouts, loadSets } from '../../redux/thunks';
import { clearCurrentWorkout, removeSet } from '../../redux/actions';
import { Redirect } from 'react-router-dom';
 
function NewWorkout({selectRow, clearWorkout, deleteThisSet, currentWorkout, startLoadingWorkouts, startLoadingSets, sets, user }) {

  const [savingWorkout, setSavingWorkout] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const saveWorkout = async () => {
    if (currentWorkout.length > 0) {
      let workoutName = prompt("Give your workout a name", "Lyft session");
      if (workoutName) {
        setSavingWorkout(true);
        //save workout
        let data = {
          name: workoutName,
        };
        let response = await fetch(`/api/workouts/`,
        {
           method: "POST",
           headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify(data)
        })
        let json = await response.json();

        let workoutId = json.workout[0].id;
        if (response.status === 201) {
            //save sets
            const data = {};
            data.sets = [];
            for (let i = 0; i < currentWorkout.length; i++) { 
              data.sets.push([currentWorkout[i].lift_id, currentWorkout[i].weight, currentWorkout[i].reps, workoutId, currentWorkout[i].pr]);
            };
            let response = await fetch(`/api/sets/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            })
            if (response.status === 201) {
              startLoadingWorkouts();
              startLoadingSets();
              setSavingWorkout(false);
              setRedirect(true);
              clearWorkout();
              
            } else {
              alert("Failed to save sets, try again.");
              setSavingWorkout(false);
            }
          } else {
            alert("Failed to save workout, try again.");
            setSavingWorkout(false);
          }
      } else {
        alert("Workout name cannot be empty")
      }

    } else {
      alert("Add at least one set to save a workout.")
    }

  }

    const populateSets = () => {
    let sortedSets = currentWorkout.sort((a,b) => (a.lift_name > b.lift_name) ? 1 : ((b.lift_name > a.lift_name) ? -1 : 0)); 
    return sortedSets.map((set, i) => {
      return (
        <tr onClick={() => selectRow(i)} key={i}>
          <td width="70%">{set.lift_name}</td>
          <td width="10%"><span className="weight">{set.weight}</span><span className="unit"> kg</span>{set.pr === 3 && <i className="fas fa-trophy gold"></i>}{set.pr === 2 && <i className="fas fa-trophy silver"></i>}{set.pr === 1 && <i className="fas fa-trophy bronze"></i>}</td>
          <td width="10%">{set.reps}</td>
          <td width="10%"><i className="fas fa-trash icon" onClick={() => deleteThisSet(i)}></i></td>
        </tr>
      )
    })
  }

    return (
      <div className="container-box" id="new-workout-container"> 
        <div id="workout-table-container">
          <table id="workout-table">
            <thead>
            <tr>
              <th width="60%">Lyft</th>
              <th width="10%">Weight</th>
              <th width="10%">Reps</th>
              <th width="10%"><i className="fas fa-info-circle tooltip icon"><span className="tooltiptext">Tip: Tap a set to pre-fill the logger.</span></i></th>
            </tr>
            </thead>
            <tbody>
              {populateSets()}
            </tbody>
          </table>
          <div className="flex-container button-container">
            {savingWorkout ? 
            <button type="button" id="save-workout-button">Saving...</button> : 
            <button onClick={saveWorkout} type="button" id="save-workout-button">Save workout</button>
            }
            <button onClick={clearWorkout} type="button" id="clear-workout-button">Clear workout</button>
          </div>
        </div>
        {redirect && <Redirect push to="/feed" />}
      </div> 
    )
}

const mapStateToProps = state => ({
  user: state.user,
  lifts: state.lifts,
  currentWorkout: state.currentWorkout,
  sets: state.sets,
});

const mapDispatchToProps = dispatch => ({
  clearWorkout: () => dispatch(clearCurrentWorkout()),
  deleteThisSet: (key) => dispatch(removeSet(key)),
  startLoadingWorkouts: () => dispatch(loadWorkouts()),
  startLoadingSets: () => dispatch(loadSets()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewWorkout);