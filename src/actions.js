export const CREATE_TODO = 'CREATE_TODO';
export const createTodo = text => ({
  type: CREATE_TODO,
  payload: { text },
});

export const REMOVE_TODO = 'REMOVE_TODO';
export const removeTodo = text => ({
  type: REMOVE_TODO,
  payload: { text },
});

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