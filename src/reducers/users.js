import { SET_USERS, CLEAR_USERS } from "../actions/users";

const initialState = {
  users: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case CLEAR_USERS:
      return {
        ...state,
        users: null,
      };
    default:
      return state;
  }
};

export default rootReducer;
