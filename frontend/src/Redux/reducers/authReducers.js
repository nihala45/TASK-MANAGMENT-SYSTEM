import { ACCESS_TOKEN } from '../../constants/token';
import { combineReducers } from 'redux';

const initialState = {
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN),
  user: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null,
};


const authReducer = (state = initialState, action) => {
  console.log('authReducer action:', action);
  switch (action.type) {
    case 'LOGIN':
      console.log('LOGIN action payload:', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};





export default authReducer;