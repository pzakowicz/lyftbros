// IMPORTING ACTIONS
import { 
  CREATE_TODO, REMOVE_TODO,
  LOAD_WORKOUTS_IN_PROGRESS, LOAD_WORKOUTS_SUCCESS, LOAD_WORKOUTS_FAILURE, 
  LOAD_USER_IN_PROGRESS, LOAD_USER_SUCCESS, LOAD_USER_FAILURE,
  LOAD_FISTBUMPS_IN_PROGRESS, LOAD_FISTBUMPS_SUCCESS, LOAD_FISTBUMPS_FAILURE, 
  LOAD_SETS_IN_PROGRESS, LOAD_SETS_SUCCESS, LOAD_SETS_FAILURE,
} from './actions';

//ADDING AND REMOVING A TODO EXAMPLE
export const todos = (state=[], action) => {
  const { type, payload} = action;

  switch (type) {
    case CREATE_TODO: {
      const { text } = payload;
      const newTodo = {
        text,
        isCompleted: false,
      };
      return state.concat(newTodo)
    }
    case REMOVE_TODO: {
      const { text} = payload;
      return state.filter(todo => todo.text !== text);
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

