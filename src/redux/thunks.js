//importing actions
import { 
  loadWorkoutsInProgress, loadWorkoutsSuccess, loadWorkoutsFailure,
  loadUserInProgress, loadUserSuccess, loadUserFailure,
  loadFistBumpsInProgress, loadFistBumpsSuccess, loadFistBumpsFailure,
  loadSetsInProgress, loadSetsSuccess, loadSetsFailure,
  loadLiftsInProgress, loadLiftsSuccess, loadLiftsFailure,
  loadCommentsInProgress, loadCommentsSuccess, loadCommentsFailure,
} from './actions'

//adding thunk for getting workouts
export const loadWorkouts = () => async (dispatch, getState) => {
  try {
    dispatch(loadWorkoutsInProgress());
    const response = await fetch('/api/workouts/')
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
      const response = await fetch('/api/users/session/')
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
    const response = await fetch('/api/fist-bumps/')
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
    const response = await fetch('/api/workouts/sets/')
    const sets = await response.json();
    dispatch(loadSetsSuccess(sets));
  } catch(error) {
    dispatch(loadSetsFailure());
    dispatch(displayAlert(error))
  }
}

//adding thunk for getting lifts
export const loadLifts = () => async (dispatch, getState) => {
  try {
    dispatch(loadLiftsInProgress());
    const response = await fetch('/api/exercises/')
    const lifts = await response.json();
    dispatch(loadLiftsSuccess(lifts));
  } catch(error) {
    dispatch(loadLiftsFailure());
    dispatch(displayAlert(error))
  }
}

//adding thunk for getting comments
export const loadComments = () => async (dispatch, getState) => {
  try {
    dispatch(loadCommentsInProgress());
    const response = await fetch('/api/comments/')
    const comments = await response.json();
    dispatch(loadCommentsSuccess(comments));
  } catch(error) {
    dispatch(loadCommentsFailure());
    dispatch(displayAlert(error))
  }
}

export const displayAlert = text => () => {
  alert(text);
}