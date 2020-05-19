
//example reducers
export const ADD_SET = 'ADD_SET';
export const addSet = set => ({
  type: ADD_SET,
  payload: { set },
});

export const REMOVE_SET = 'REMOVE_SET';
export const removeSet = (key) => ({
  type: REMOVE_SET,
  payload: { key },
});

export const CLEAR_CURRENT_WORKOUT = 'CLEAR_CURRENT_WORKOUT';
export const clearCurrentWorkout = () => ({
  type: CLEAR_CURRENT_WORKOUT,
  //payload: { text },
});

//getting the workouts into the store
export const LOAD_WORKOUTS_IN_PROGRESS = 'LOAD_WORKOUTS_IN_PROGRESS';
export const loadWorkoutsInProgress = () => ({
  type: LOAD_WORKOUTS_IN_PROGRESS,
})

export const LOAD_WORKOUTS_SUCCESS = 'LOAD_WORKOUTS_SUCCESS';
export const loadWorkoutsSuccess = workouts => ({
  type: LOAD_WORKOUTS_SUCCESS,
  payload: { workouts },
})

export const LOAD_WORKOUTS_FAILURE = 'LOAD_WORKOUTS_FAILURE';
export const loadWorkoutsFailure = () => ({
  type: LOAD_WORKOUTS_FAILURE,
})

//getting the logged in user into the store
export const LOAD_USER_IN_PROGRESS = 'LOAD_USER_IN_PROGRESS';
export const loadUserInProgress = () => ({
  type: LOAD_USER_IN_PROGRESS,
})

export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const loadUserSuccess = user => ({
  type: LOAD_USER_SUCCESS,
  payload: { user },
})

export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';
export const loadUserFailure = () => ({
  type: LOAD_USER_FAILURE,
})

//getting the fist-bumps into the store
export const LOAD_FISTBUMPS_IN_PROGRESS = 'LOAD_FISTBUMPS_IN_PROGRESS';
export const loadFistBumpsInProgress = () => ({
  type: LOAD_FISTBUMPS_IN_PROGRESS,
})

export const LOAD_FISTBUMPS_SUCCESS = 'LOAD_FISTBUMPS_SUCCESS';
export const loadFistBumpsSuccess = fistBumps => ({
  type: LOAD_FISTBUMPS_SUCCESS,
  payload: { fistBumps },
})

export const LOAD_FISTBUMPS_FAILURE = 'LOAD_FISTBUMPS_FAILURE';
export const loadFistBumpsFailure = () => ({
  type: LOAD_FISTBUMPS_FAILURE,
})

//getting the sets into the store
export const LOAD_SETS_IN_PROGRESS = 'LOAD_SETS_IN_PROGRESS';
export const loadSetsInProgress = () => ({
  type: LOAD_SETS_IN_PROGRESS,
})

export const LOAD_SETS_SUCCESS = 'LOAD_SETS_SUCCESS';
export const loadSetsSuccess = sets => ({
  type: LOAD_SETS_SUCCESS,
  payload: { sets },
})

export const LOAD_SETS_FAILURE = 'LOAD_SETS_FAILURE';
export const loadSetsFailure = () => ({
  type: LOAD_SETS_FAILURE,
})

//getting the lifts into the store
export const LOAD_LIFTS_IN_PROGRESS = 'LOAD_LIFTS_IN_PROGRESS';
export const loadLiftsInProgress = () => ({
  type: LOAD_LIFTS_IN_PROGRESS,
})

export const LOAD_LIFTS_SUCCESS = 'LOAD_LIFTS_SUCCESS';
export const loadLiftsSuccess = lifts => ({
  type: LOAD_LIFTS_SUCCESS,
  payload: { lifts },
})

export const LOAD_LIFTS_FAILURE = 'LOAD_LIFTS_FAILURE';
export const loadLiftsFailure = () => ({
  type: LOAD_LIFTS_FAILURE,
})