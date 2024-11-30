import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { Container, Row, Col, Button, FormGroup, FormText, Input } from "reactstrap";
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
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const doRegister = async (event) => {
    event.preventDefault();

    const { name, email, password, phone } = state;

    // Check if all fields are filled
    if (!name || !email || !password || !phone) {
      setState({ ...state, error: "All fields are required." });
      return;
    }

    try {

      // Create a user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Store additional user data in Firestore
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        email,
        phone,
      });

      // Redirect or perform other actions after successful registration
      props.history.push("/template");
    } catch (error) {
      // Handle registration errors
      setState({ ...state, error: error.message });
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
                  <SofiaLogo />
                  <p className="mb-0">SOFIA</p>
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
                  <Button className="rounded-pill my-3" type="submit" color="secondary-red">
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
