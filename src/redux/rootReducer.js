// ** Redux Imports
import { combineReducers } from 'redux';

// ** Reducers Imports
import auth from './reducers/auth';

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
