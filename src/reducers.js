// IMPORTING ACTIONS
import { 
  CREATE_TODO, 
  REMOVE_TODO,
  LOAD_WORKOUTS_IN_PROGRESS,
  LOAD_WORKOUTS_SUCCESS,
  LOAD_WORKOUTS_FAILURE 
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



export const isLoading = (state=false, action) => {
  const { type } = action;

  switch (type) {
    case LOAD_WORKOUTS_IN_PROGRESS:
      return true;
    case LOAD_WORKOUTS_SUCCESS:
      return false;
    case LOAD_WORKOUTS_FAILURE:
      return false;
    default: 
      return state;
    }
}