import axios from 'axios';
import { GET_USER_AUTH } from './action-type';
import Util from '../../js/Util';

const token = Util.getToken();

const actionUserAuthCreator = (data) => {
  const { auth, username } = data;
  return {
    data: {
      type: GET_USER_AUTH,
      isLogin: true, // 是否登录
      isAuth: auth === 1, // 是否有权限
      isAdminAuth: username === 'admin', // 是否是超级管理员
    },
  };
};

export const getUSerAuth = () => {
  return (dispatch) => {
    return axios
      .get('http://localhost:8080/api/users/info', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          dispatch(actionUserAuthCreator(res.data.data));
        }
      });
  };
};
