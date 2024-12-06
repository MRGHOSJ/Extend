import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormText,
  Input,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import Footer from "../../components/Footer/Footer.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import loginImage from "../../assets/registerImage.svg";
import SofiaLogo from "../../components/Icons/SofiaLogo.js";
import GoogleIcon from "../../components/Icons/AuthIcons/GoogleIcon.js";
import TwitterIcon from "../../components/Icons/AuthIcons/TwitterIcon.js";
import FacebookIcon from "../../components/Icons/AuthIcons/FacebookIcon.js";
import GithubIcon from "../../components/Icons/AuthIcons/GithubIcon.js";
import LinkedinIcon from "../../components/Icons/AuthIcons/LinkedinIcon.js";
import firestore, { auth } from "../../database/firebase.js";

const Register = (props) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    error: "",
    referral: "",
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(props.location.search);
    const referralCode = urlParams.get("referral"); // Assuming the referral is passed as ?referral=somecode
    if (referralCode) {
      setState((prevState) => ({ ...prevState, referral: referralCode }));
    }
  }, [props.location.search]);
  const doRegister = async (event) => {
    event.preventDefault();

    const { name, email, password, phone, referral } = state;

    // Regular expressions for validation
    const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Strong password
    const phoneRegex = /^\d+$/; // Only digits

    // Input validation
    if (!name || !nameRegex.test(name)) {
      setState({
        ...state,
        error: "Name must contain only letters and spaces.",
      });
      return;
    }

    if (!email || !emailRegex.test(email)) {
      setState({ ...state, error: "Invalid email address." });
      return;
    }

    if (!password || !strongPasswordRegex.test(password)) {
      setState({
        ...state,
        error:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      });
      return;
    }

    if (!phone || !phoneRegex.test(phone)) {
      setState({ ...state, error: "Phone number must contain only digits." });
      return;
    }

    try {
      // Create a user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Store additional user data in Firestore
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        email,
        phone,
        referral,
        role: "user",
      });

      // Redirect or perform other actions after successful registration
      props.history.push("/app");
    } catch (error) {
      // Handle Firebase registration errors with meaningful messages
      let errorMessage = "An error occurred during registration.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "The email address is already in use by another account.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is invalid.";
          break;
        case "auth/weak-password":
          errorMessage =
            "The password is too weak. Please use a stronger password.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
          break;
        default:
          errorMessage = error.message; // Use default Firebase error message for unexpected errors
      }
      setState({ ...state, error: errorMessage });
    }
  };

  return (
    <div className="auth-page">
      <Container className="col-12">
        <Row className="d-flex align-items-center">
          <Col xs={12} lg={6} className="left-column">
            <Widget className="widget-auth widget-p-lg">
              <div className="d-flex align-items-center justify-content-between py-3">
                <p className="auth-header mb-0">Sign Up</p>
                <div className="logo-block">
                  <p className="mb-0">EXTEND</p>
                </div>
              </div>
              {state.error && <div className="text-danger">{state.error}</div>}
              <form onSubmit={doRegister}>
                <FormGroup className="my-3">
                  <FormText>Name</FormText>
                  <Input
                    id="name"
                    className="input-transparent pl-3"
                    value={state.name}
                    onChange={changeCred}
                    type="text"
                    required
                    name="name"
                    placeholder="Your Full Name"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <FormText>Email</FormText>
                  <Input
                    id="email"
                    className="input-transparent pl-3"
                    value={state.email}
                    onChange={changeCred}
                    type="email"
                    required
                    name="email"
                    placeholder="Your Email Address"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <FormText>Phone</FormText>
                  <Input
                    id="phone"
                    className="input-transparent pl-3"
                    value={state.phone}
                    onChange={changeCred}
                    type="tel"
                    required
                    name="phone"
                    placeholder="Your Phone Number"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <FormText>Password</FormText>
                  <Input
                    id="password"
                    className="input-transparent pl-3"
                    value={state.password}
                    onChange={changeCred}
                    type="password"
                    required
                    name="password"
                    placeholder="Choose a Password"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button
                    className="rounded-pill my-3"
                    type="submit"
                    color="secondary-red"
                  >
                    Sign Up
                  </Button>
                </div>
                <p className="dividing-line my-3">&#8195;Or&#8195;</p>
                <div className="d-flex align-items-center my-3">
                  <p className="social-label mb-0">Login with</p>
                  <div className="socials">
                    <a href="https://flatlogic.com/">
                      <GoogleIcon />
                    </a>
                    <a href="https://flatlogic.com/">
                      <TwitterIcon />
                    </a>
                    <a href="https://flatlogic.com/">
                      <FacebookIcon />
                    </a>
                    <a href="https://flatlogic.com/">
                      <GithubIcon />
                    </a>
                    <a href="https://flatlogic.com/">
                      <LinkedinIcon />
                    </a>
                  </div>
                </div>
                <Link to="/login">Enter the account</Link>
              </form>
            </Widget>
          </Col>
          <Col xs={0} lg={6} className="right-column">
            <div>
              <img src={loginImage} alt="Error page" />
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

Register.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(Register);
