import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/token";




export const login = (userData) => {
  localStorage.setItem('admin', JSON.stringify(userData));
  return {
    type: 'LOGIN',
    payload: userData,
  };
};

export const logout = () => {
  localStorage.removeItem('admin');
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  return {
    type: 'LOGOUT',
  };
};


