import Api from '../../js/Api';
import { GET_PERSONS_LIST } from './action-type';

export const getPersonsList = () => {
  return (dispatch) => {
    return Api.get('/persons/list').then((res) => {
      if (res.data.success) {
        dispatch({
          type: GET_PERSONS_LIST,
          data: res.data.data,
        });
      }
    });
  };
};
