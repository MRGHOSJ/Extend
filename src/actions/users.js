export const SET_USERS = "SET_USERS";
export const CLEAR_USERS = "CLEAR_USERS";

export const setUsers = (users) => ({
  type: SET_USERS,
  payload: users,
});

export const clearUsers = () => ({
  type: CLEAR_USERS,
});
