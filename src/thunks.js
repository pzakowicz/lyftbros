import { loadWorkoutsInProgress, loadWorkoutsSuccess, loadWorkoutsFailure} from './actions'


export const loadWorkouts = () => async (dispatch, getState) => {
  try {
    dispatch(loadWorkoutsInProgress());
    const response = await fetch('../api/workouts/')
    const workouts = await response.json();
  
    dispatch(loadWorkoutsSuccess(workouts));
  } catch(error) {
    dispatch(loadWorkoutsFailure());
    dispatch(displayAlert(error))
  }
  


}

export const displayAlert = text => () => {
  alert(text);
}