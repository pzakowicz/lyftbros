// IMPORTING ACTIONS
import { 
  ADD_SET, CLEAR_CURRENT_WORKOUT,
  LOAD_WORKOUTS_IN_PROGRESS, LOAD_WORKOUTS_SUCCESS, LOAD_WORKOUTS_FAILURE, 
  LOAD_USER_IN_PROGRESS, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
  LOAD_FISTBUMPS_IN_PROGRESS, LOAD_FISTBUMPS_SUCCESS, LOAD_FISTBUMPS_FAILURE, 
  LOAD_SETS_IN_PROGRESS, LOAD_SETS_SUCCESS, LOAD_SETS_FAILURE,
  LOAD_LIFTS_IN_PROGRESS, LOAD_LIFTS_SUCCESS, LOAD_LIFTS_FAILURE, 

} from './actions';

//ADDING AND REMOVING A TODO EXAMPLE
export const currentWorkout = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case ADD_SET: {
      const { set } = payload;
      return state.concat(set)
    }
    case CLEAR_CURRENT_WORKOUT: {
      return [];
    }
    default:
      return state
  }
}

//adding the workouts reducers
export const workouts = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case LOAD_WORKOUTS_SUCCESS: {
      const { workouts } = payload;
      return workouts;
    }
    case LOAD_WORKOUTS_IN_PROGRESS:
    case LOAD_WORKOUTS_FAILURE:
    default:
      return state
  }
}

//adding the user reducers
export const user = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case LOAD_USER_SUCCESS: {
      const { user } = payload;
      return user;
    }
    case LOAD_USER_IN_PROGRESS:
    case LOAD_USER_FAILURE:
    default:
      return state
  }
}

//adding the fist-bumps reducers
export const fistBumps = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case LOAD_FISTBUMPS_SUCCESS: {
      const { fistBumps } = payload;
      return fistBumps;
    }
    case LOAD_FISTBUMPS_IN_PROGRESS:
    case LOAD_FISTBUMPS_FAILURE:
    default:
      return state
  }
}

//adding the sets reducers
export const sets = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case LOAD_SETS_SUCCESS: {
      const { sets } = payload;
      return sets;
    }
    case LOAD_SETS_IN_PROGRESS:
    case LOAD_SETS_FAILURE:
    default:
      return state
  }
}

//adding the lifts reducers
export const lifts = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case LOAD_LIFTS_SUCCESS: {
      const { lifts } = payload;
      return lifts;
    }
    case LOAD_LIFTS_IN_PROGRESS:
    case LOAD_LIFTS_FAILURE:
    default:
      return state
  }
}


//adding the loading state reducer
export const isLoading = (state=false, action) => {
  const { type } = action;

  switch (type) {
    case LOAD_WORKOUTS_IN_PROGRESS:
    case LOAD_USER_IN_PROGRESS:
      return true;
    case LOAD_WORKOUTS_SUCCESS:
    case LOAD_WORKOUTS_FAILURE:
    case LOAD_USER_SUCCESS:
    case LOAD_USER_FAILURE:
      return false;
    default: 
      return state;
    }
}

