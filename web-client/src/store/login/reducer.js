import { USER_LOGIN, GET_USER_AUTH } from './action-type';
const initState = {
  data: {
    isLogin: false, // 是否登录
    isAuth: false, // 是否有权限
    isAdminAuth: false, // 是否是超级管理员
    username: null,
  },
};
const reducer = (state = initState, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        data: action.data,
      };
    case GET_USER_AUTH:
      return {
        ...state,
        data: action.data,
      }
    default:
      return state;
  }
};

export default reducer;
