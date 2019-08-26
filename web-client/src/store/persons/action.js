import axios from 'axios';
import { GET_PERSONS_LIST } from './action-type';

export const getPersonsList = () => {
  return (dispatch) => {
    return axios.get('http://localhost:8080/api/persons/list').then((res) => {
      if (res.data.success) {
        dispatch({
          type: GET_PERSONS_LIST,
          data: res.data.data,
        });
      }
    });
  };
};
