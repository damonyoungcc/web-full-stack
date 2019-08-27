import { combineReducers } from 'redux';
import personsListData from './persons/reducer';
import userData from './login/reducer';

export default combineReducers({
  personsListData,
  userData,
});
