import { combineReducers } from 'redux';
import personsListData from './persons/reducer';
import userAuthData from './login/reducer';

export default combineReducers({
  personsListData,
  userAuthData,
});
