import { Step, StepButton, Stepper } from "@material-ui/core";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  Alert,
} from "reactstrap";

import { ReactComponent as Discord } from "../../../assets/social/discord.svg";
import { ReactComponent as Facebook } from "../../../assets/social/facebook.svg";
import { ReactComponent as Mail } from "../../../assets/social/mail.svg";
import s from "../Packet.module.scss";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import firestore from "../../../database/firebase";
const PaymentSystem = (props) => {
  const { packet, user } = props;
  const [step, setStep] = useState(0);

  //Choose method
  const [paymentMethod, setPaymentMethod] = useState("");

  //Enable Contact
  const [enableDiscord, setEnableDiscord] = useState(false);
  const [enableFacebook, setEnableFacebook] = useState(false);
  const [enableMail, setEnableMail] = useState(false);

  //Variables
  const [senderName, setSenderName] = useState(""); // Mandat Minute
  const [senderFacebook, setSenderFacebook] = useState("");
  const [senderDiscord, setSenderDiscord] = useState("");
  const [senderMail, setSenderMail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");

  const [alert, setAlert] = useState({
    color: "",
    messsage: "",
  });

  const isFacebookProfileLink = (link) => {
    let regex =
      /^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[a-zA-Z0-9.]+)\/?$/;
    return regex.test(link);
  };
  const isEmailAddress = (input) => {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input);
  };

  const isDiscordUsername = (input) => {
    let regex = /^(?!.*?\.{2,})[a-z0-9_\.]{2,32}$/;
    return regex.test(input);
  };

  const handlePayRequest = async () => {
    try {
      const userDocRef = doc(firestore, "users", user.user.slice(1, -1));

      // Fetch the user document
      const userDocSnapshot = await getDoc(userDocRef);

      // Get the current packets array from the user document
      const paidpackets = userDocSnapshot.data()?.paidpackets || [];

      // Check if the current packet title already exists
      const existingpacketIndex = paidpackets.findIndex(
        (packet) => packet.title === packet.title
      );

      if (existingpacketIndex !== -1) {
        const updatedpaidpackets = [...paidpackets];
        // If the packet exists, update the completedLevels array
        if (updatedpaidpackets[existingpacketIndex].status == "Pending") {
          setAlert({
            color: "danger",
            messsage:
              "You have already given your payment to be handled, so you should wait for our team to validate it.",
          });
          return;
        } else if (
          updatedpaidpackets[existingpacketIndex].status == "Validated"
        ) {
          setAlert({
            color: "danger",
            messsage: "Your payment has already been verified.",
          });
          return;
        } else {
          let currentDate = new Date();

          updatedpaidpackets[existingpacketIndex].status = "Pending";
          updatedpaidpackets[existingpacketIndex].date =
            currentDate.toDateString();
            updatedpaidpackets[existingpacketIndex].price = packet.price;
            updatedpaidpackets[existingpacketIndex].paymentMethod = paymentMethod;
            updatedpaidpackets[existingpacketIndex].senderName = senderName;
            updatedpaidpackets[existingpacketIndex].senderFacebook = senderFacebook;
            updatedpaidpackets[existingpacketIndex].senderDiscord = senderDiscord;
            updatedpaidpackets[existingpacketIndex].senderMail = senderMail;
            updatedpaidpackets[existingpacketIndex].senderMessage = senderMessage;
          

          await updateDoc(userDocRef, {
            paidpackets: updatedpaidpackets,
          });
        }
      } else {
        let currentDate = new Date();
        // If the packet doesn't exist, create a new object with the title and completed level
        await updateDoc(userDocRef, {
          paidpackets: [
            ...paidpackets,
            {
              title: packet.title,
              status: "Pending",
              date: currentDate.toDateString(),
              price: packet.price,
              paymentMethod,
              senderName,
              senderFacebook,
              senderDiscord,
              senderMail,
              senderMessage
            },
          ],
        });
      }
      setAlert({
        color: "primary",
        messsage:
          "The payment was successfully sent; please wait 48 hours for approval.",
      });
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  const handleNext = () => {
    switch (step) {
      case 0:
        if (paymentMethod == "")
          setAlert({
            color: "danger",
            messsage: "No payment method was selected.",
          });
        else {
          setStep(1);
          setAlert({
            color: "",
            messsage: "",
          });
        }
        break;
      case 1:
        let error = "";

        if (paymentMethod == "Mandat Minute" && senderName == "")
          error = "Sender's name should not be empty.";
        if (!enableDiscord && !enableFacebook && !enableMail)
          error = "Sender's should select contact way.";
        if (enableDiscord && senderDiscord == "")
          error = "Sender's discord should not be empty.";
        if (enableFacebook && senderFacebook == "")
          error = "Sender's facebook should not be empty.";
        if (enableMail && senderMail == "")
          error = "Sender's mail should not be empty.";

        if (
          enableFacebook &&
          senderFacebook != "" &&
          !isFacebookProfileLink(senderFacebook)
        )
          error = "Sender's facebook isn't in the correct format.";
        if (enableMail && senderMail != "" && !isEmailAddress(senderMail))
          error = "Sender's mail isn't in the correct format.";
        if (
          enableDiscord &&
          senderDiscord != "" &&
          !isDiscordUsername(senderDiscord)
        )
          error = "Sender's discord isn't in the correct format.";

        if (error != "") {
          setAlert({
            color: "danger",
            messsage: error,
          });
        } else {
          setStep(2);
          setAlert({
            color: "",
            messsage: "",
          });
        }
        break;
      case 2:
        handlePayRequest()
        break;
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const availablePaymentMethod = ["Mandat Minute", "Person To Person"];

  const paymentMethodShow = () => {
    switch (paymentMethod) {
      case "Mandat Minute":
        return (
          <Form>
            <p>
              Method: <strong>{paymentMethod}</strong>
              <br />
              <br />
              <div style={{ border: "2px dashed black", textAlign: "center" }}>
                <strong>
                  <p>Information</p>
                  <br />
                  <p>Benefit: Yassine Bouzouita</p>
                  <p>RIB: 125446215</p>
                  <p>Price: {packet.price} DT</p>
                  <br />
                  <p style={{ fontSize: "10px" }}>
                    Note: We will contact you as soon as we receive notification
                    of your order, and we will need the receipt to authenticate
                    the order.
                  </p>
                </strong>
              </div>
            </p>
            <br />
            <FormGroup>
              <Label for="senderName">Sender's Name</Label>
              <Input
                type="text"
                name="senderName"
                id="senderName"
                value={senderName}
                onChange={(e) => {
                  setSenderName(e.target.value);
                }}
                placeholder="Enter sender's name"
              />
            </FormGroup>
            {selectSocial()}
          </Form>
        );
      case "Person To Person":
        return (
          <Form>
            <p>
              Method: <strong>{paymentMethod}</strong>
            </p>
            <br />
            <div style={{ border: "2px dashed black", textAlign: "center" }}>
              <strong>
                <p>Information</p>
                <br />
                <p>Price: {packet.price} DT</p>
                <br />
                <p style={{ fontSize: "10px" }}>
                  Note: We will contact you as soon as we receive notification
                  of your order.
                </p>
              </strong>
            </div>
            <br />
            {selectSocial()}
            <br />
          </Form>
        );
    }
  };

  const selectSocial = () => {
    return (
      <FormGroup>
        <p>Where can we contact you at?</p>
        <br />
        <Row>
          <Col xs={2}>
            <Discord
              onClick={() => {
                setEnableDiscord(!enableDiscord);
              }}
              className={enableDiscord ? s.SelectedContact : ""}
            />
          </Col>
          <Col xs={2}>
            <Facebook
              onClick={() => {
                setEnableFacebook(!enableFacebook);
              }}
              className={enableFacebook ? s.SelectedContact : ""}
            />
          </Col>
          <Col xs={2}>
            <Mail
              onClick={() => {
                setEnableMail(!enableMail);
              }}
              className={enableMail ? s.SelectedContact : ""}
            />
          </Col>
        </Row>
        <br />
        {enableDiscord && (
          <Input
            type="text"
            name="discordName"
            id="discordName"
            placeholder="Discord Name"
            value={senderDiscord}
            onChange={(e) => {
              setSenderDiscord(e.target.value);
            }}
          />
        )}
        {enableMail && (
          <Input
            type="text"
            name="mail"
            id="mail"
            placeholder="Mail Address"
            value={senderMail}
            onChange={(e) => {
              setSenderMail(e.target.value);
            }}
          />
        )}
        {enableFacebook && (
          <Input
            type="text"
            name="facebook"
            id="facebook"
            placeholder="Facebook Profile Link"
            value={senderFacebook}
            onChange={(e) => {
              setSenderFacebook(e.target.value);
            }}
          />
        )}
        <Label for="messageAutre">Messages (optional)</Label>
        <Input
          type="text"
          name="message"
          id="message"
          placeholder="Message"
          value={senderMessage}
          onChange={(e) => {
            setSenderMessage(e.target.value);
          }}
        />
      </FormGroup>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Form>
            <FormGroup>
              <Label for="paymentSystem">Select Payment Method</Label>
              <Row>
                {availablePaymentMethod.map((method) => {
                  let imageSrc = "";
                  switch (method) {
                    case "Mandat Minute":
                      imageSrc =
                        "https://i0.wp.com/chroniques.tn/wp-content/uploads/2016/07/poste.jpg?fit=1050%2C1137&ssl=1&w=640";
                      break;
                    case "Person To Person":
                      imageSrc =
                        "https://img.freepik.com/premium-vector/peer-peer-trading-p2p-lending-tiny-people-enter-into-deposit-agreement-invest-e-money_501813-1837.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1703721600&semt=ais";
                      break;
                  }
                  return (
                    <Col xs={4} key={method}>
                      <Card
                        style={{
                          height: "180px",
                          border:
                            paymentMethod == method ? "2px solid #5054e4" : "",
                        }}
                        onClick={() => {
                          setPaymentMethod(method);
                        }}
                      >
                        <img
                          alt="Sample"
                          src={imageSrc}
                          style={{ height: "120px", padding: "20px" }}
                        />
                        <center>
                          <p style={{ padding: "2px" }}>{method}</p>
                        </center>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </FormGroup>
          </Form>
        );
      case 1:
        return paymentMethodShow();

      case 2:
        return (
          <div>
            <h4>Payment Confirmation</h4>
            <p>
              Your payment with {paymentMethod} has been successfully processed.
            </p>
            <div
              className="p-2 mt-2 mb-2"
              style={{ border: "2px dashed black" }}
            >
              <p>Payment Information:</p>
              <br />

              {senderName != "" ? (
                <p>
                  Sender's Name: <strong>{senderName}</strong>
                </p>
              ) : (
                <></>
              )}
              {paymentMethod == "Mandat Minute" ? (
                <>
                  <p>
                    Benefit: <strong>Yassine Bouzouita</strong>
                  </p>
                  <p>
                    RIB: <strong>125446215</strong>
                  </p>
                </>
              ) : (
                <></>
              )}

              <p>
                Price: <strong>{packet.price} DT</strong>
              </p>
              <br />
              <p>Your Contact:</p>
              <ul className="pl-4">
                {senderDiscord != "" ? (
                  <li>
                    Discord: <strong>{senderDiscord}</strong>
                  </li>
                ) : (
                  <></>
                )}
                {senderMail != "" ? (
                  <li>
                    Mail: <strong>{senderMail}</strong>
                  </li>
                ) : (
                  <></>
                )}
                {senderFacebook != "" ? (
                  <li>
                    Facebook: <strong>{senderFacebook}</strong>
                  </li>
                ) : (
                  <></>
                )}
              </ul>

              {senderMessage != "" ? (
                <p>
                  Message: <strong>{senderMessage}</strong>
                </p>
              ) : (
                <></>
              )}

              <br />
              <p style={{ fontSize: "10px" }}>
                Note: We will contact you as soon as we receive notification of
                your order, and we will need the receipt to authenticate the
                order.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      {alert.messsage.length > 0 && alert.color.length > 0 ? (
        <Alert color={alert.color}>{alert.messsage}</Alert>
      ) : (
        <></>
      )}
      <Row>
        <Col>
          <Stepper activeStep={step} alternativeLabel>
            {[0, 1, 2].map((label, index) => (
              <Step key={index}>
                <StepButton onClick={() => setStep(index)}>
                  {index == 0
                    ? "Method"
                    : index == 1
                    ? "Information"
                    : index == 2
                    ? "Confirmation"
                    : ""}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <div>{renderStepContent(step)}</div>
            <div>
              <Button
                color="secondary"
                disabled={step === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                color="primary"
                onClick={handleNext}
                style={{ marginLeft: "10px" }}
              >
                {step === 2 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentSystem;
