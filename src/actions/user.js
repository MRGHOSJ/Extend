export const SET_USER = "SET_USER";
export const SET_LOADING = "SET_LOADING";
export const CLEAR_USER = "CLEAR_USER";

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});
