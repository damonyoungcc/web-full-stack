import { GET_PERSONS_LIST } from './action-type';
const initState = {
  data: [],
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_PERSONS_LIST:
      return {
        ...state,
        data: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
