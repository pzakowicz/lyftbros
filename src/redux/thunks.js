//importing actions
import { 
  loadWorkoutsInProgress, loadWorkoutsSuccess, loadWorkoutsFailure,
  loadUserInProgress, loadUserSuccess, loadUserFailure,
  loadFistBumpsInProgress, loadFistBumpsSuccess, loadFistBumpsFailure,
  loadSetsInProgress, loadSetsSuccess, loadSetsFailure,
} from './actions'

//adding thunk for getting workouts
export const loadWorkouts = () => async (dispatch, getState) => {
  try {
    dispatch(loadWorkoutsInProgress());
    const response = await fetch('api/workouts/')
    const workouts = await response.json();
    dispatch(loadWorkoutsSuccess(workouts));
  } catch(error) {
    dispatch(loadWorkoutsFailure());
    dispatch(displayAlert(error))
  }
}

//adding thunk for getting the user
  export const loadUser = () => async (dispatch, getState) => {
    try {
      dispatch(loadUserInProgress());
      const response = await fetch('api/users/session/')
      const user = await response.json();
      dispatch(loadUserSuccess(user));
    } catch(error) {
      dispatch(loadUserFailure());
      dispatch(displayAlert(error))
    }
}

//adding thunk for getting the fist-bumps
export const loadFistBumps = () => async (dispatch, getState) => {
  try {
    dispatch(loadFistBumpsInProgress());
    const response = await fetch('api/fist-bumps/')
    const fistBumps = await response.json();
    dispatch(loadFistBumpsSuccess(fistBumps));
  } catch(error) {
    dispatch(loadFistBumpsFailure());
    dispatch(displayAlert(error))
  }
}

//adding thunk for getting the sets
export const loadSets = () => async (dispatch, getState) => {
  try {
    dispatch(loadSetsInProgress());
    const response = await fetch('api/workouts/sets/')
    const sets = await response.json();
    dispatch(loadSetsSuccess(sets));
  } catch(error) {
    dispatch(loadSetsFailure());
    dispatch(displayAlert(error))
  }
}

export const displayAlert = text => () => {
  alert(text);
}