import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function receiveLogin() {
  return {
    type: LOGIN_SUCCESS
  };
}

function loginError(payload) {
  return {
    type: LOGIN_FAILURE,
    payload,
  };
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
  };
}

// logs the user out
export function logoutUser() {
  return (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('user');
    dispatch(receiveLogout());
  };
}

export function loginUser(creds) {
  return (dispatch) => {
    dispatch(receiveLogin());

    // Email validation: standard email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(creds.email);

    // Password validation: at least 8 characters, one uppercase, one number, one symbol
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isPasswordValid = passwordRegex.test(creds.password);

    if (!isEmailValid) {
      dispatch(loginError('Invalid email format. Please enter a valid email address.'));
      return;
    }

    if (!isPasswordValid) {
      dispatch(
        loginError(
          'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.'
        )
      );
      return;
    }
    const history = useHistory();

    signInWithEmailAndPassword(auth, creds.email, creds.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user.uid));
        history.push("/app");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setErrorLogin("Error: " + errorCode);
      });
  };
}

