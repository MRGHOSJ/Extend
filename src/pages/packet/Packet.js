import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFoote,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import * as Icons from "@material-ui/icons";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min.js";
import { Link } from "react-router-dom/cjs/react-router-dom";
import s from "./Packet.module.scss";
import { connect } from "react-redux";
import firestore from "../../database/firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Stepper from "./components/Stepper.js";

const Packet = ({ user, users, Packets }) => {
  const [learningTime, setLearningTime] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [Packet, setPacket] = useState({
    title: "Beginner Fundamentals: Html,Css,Javascript",
    createdBy: "Codi Ur Project",
    createdAt: "12-07-2023",
    price: 0,
    validation: "",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    outCome: ["outcome1", "outcome2", "outcome3"],
    audience:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    Courses: [
      {
        title: "Introduction to React",
        status: "Done", // Pending, Done, Locked, Paid
        time: 30, // time in minutes
      },
      {
        title: "Advanced JavaScript",
        status: "Pending", // Pending, Done, Locked, Paid
        time: 45,
      },
      {
        title: "Web Development with Node.js",
        status: "Pending", // Pending, Done, Locked, Paid
        time: 60,
      },
      {
        title: "Database Management",
        status: "Pending", // Pending, Done, Locked, Paid
        time: 50,
      },
    ],
    faq: [
      {
        question: "Question 1",
        answer: "Answer 2",
      },
      {
        question: "Question 2",
        answer: "Answer 2",
      },
      {
        question: "Question 3",
        answer: "Answer 2",
      },
      {
        question: "Question 4",
        answer: "Answer 2",
      },
      {
        question: "Question 5",
        answer: "Answer 2",
      },
    ],
  });
  const history = useHistory();
  const { currentPacket } = useParams();
  const [PacketProgress, setPacketProgress] = useState(0);
  const [PacketPaid, setPacketPaid] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalOpenPayment, setModalOpenPayment] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [alert, setAlert] = useState({
    color: "",
    messsage: "",
  });
  const [completedPacket, setCompletedPacket] = useState(null);
  const [paidPacket, setPaidPacket] = useState(null);
  const toggle = () => setModal(!modal);
  const toggleModalPayment = () => {
    setModalOpenPayment(!modalOpenPayment);
  };
  const isValidImageUrl = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleItem = (index) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const isGitHubRepo = (link) => {
    const githubRepoRegex =
      /^https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
    return githubRepoRegex.test(link);
  };

  const handleSendGithubRepo = async () => {
    if (isGitHubRepo(githubUrl)) {
      try {
        const userDocRef = doc(firestore, "users", user.user.slice(1, -1));

        // Fetch the user document
        const userDocSnapshot = await getDoc(userDocRef);

        // Get the current Packets array from the user document
        const completedPackets = userDocSnapshot.data()?.completedPackets || [];

        // Check if the current Packet title already exists
        const existingPacketIndex = completedPackets.findIndex(
          (Packet) => Packet.title === currentPacket
        );

        if (existingPacketIndex !== -1) {
          const updatedcompletedPackets = [...completedPackets];
          // If the Packet exists, update the completedCourses array
          if (
            updatedcompletedPackets[existingPacketIndex].status == "Pending"
          ) {
            setAlert({
              color: "danger",
              messsage:
                "You have already given your github repository to be handled, so you should wait for our team to validate it.",
            });
            return;
          } else if (
            updatedcompletedPackets[existingPacketIndex].status == "Validated"
          ) {
            setAlert({
              color: "danger",
              messsage: "Your GitHub repository has already been verified.",
            });
            return;
          } else {
            let currentDate = new Date();

            updatedcompletedPackets[existingPacketIndex].status = "Pending";
            updatedcompletedPackets[existingPacketIndex].date =
              currentDate.toDateString();
            updatedcompletedPackets[existingPacketIndex].githubUrl = githubUrl;

            await updateDoc(userDocRef, {
              completedPackets: updatedcompletedPackets,
            });
          }
        } else {
          // If the Packet doesn't exist, create a new object with the title and completed Course
          await updateDoc(userDocRef, {
            completedPackets: [
              ...completedPackets,
              {
                title: currentPacket,
                status: "Pending",
                githubUrl: githubUrl,
              },
            ],
          });
        }
        setAlert({
          color: "primary",
          messsage:
            "The Github repository was successfully sent; please wait 48 hours for approval.",
        });
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    } else {
      setAlert({
        color: "danger",
        messsage: "The Github repository is invalid.",
      });
    }
  };

  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Packets")); // Fetch 'Packets' collection
        const packetsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        packetsData.forEach((packet) => {
          if (packet.title === currentPacket) {
            setPacket(packet);
            let totatTime = 0;
            packet.Courses.map((course) => {
              totatTime += parseInt(course.mins);
            });
            setLearningTime(totatTime);
          }
        });
      } catch (error) {
        console.error("Error fetching packets:", error);
      }
    };

    fetchPackets();
  }, []);

  return (
    <div>
      <Row className="gutter">
        <Col md={8} xs={12}>
          <Widget>
            <div className="d-flex flex-wrap align-items-center justify-content-center">
              <div className="d-flex justify-content-center col-12 col-xl-6">
                <img
                  className="p-4 img-fluid"
                  style={{ width: "100%", objectFit: "cover", height: "205px" }}
                  src={
                    isValidImageUrl(Packet.image)
                      ? Packet.image
                      : "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
                  }
                  alt="..."
                />
              </div>
              <div className="d-flex flex-column col-12 col-xl-6 p-sm-4">
                <p className="headline-1">{Packet.title}</p>
                {paidPacket ? (
                  <Button
                    className="mt-2"
                    color={
                      paidPacket?.status == "Validated" ? "success" : "danger"
                    }
                    disabled={paidPacket?.status == "Declined" ? false : true}
                    onClick={() => {
                      if (
                        paidPacket?.status == "Pending" ||
                        paidPacket?.status == "Declined"
                      )
                        toggleModalPayment();
                    }}
                  >
                    {paidPacket?.status == "Validated"
                      ? "Unlocked Full Packet"
                      : paidPacket?.status == "Declined"
                      ? "Unlock failed reason for declination " +
                        paidPacket.reasonDeclined +
                        " . Retry to unlock Full Packet (" +
                        Packet.price +
                        " DT)"
                      : "Pending payment verification..."}
                  </Button>
                ) : (
                  <Button
                    className="mt-2"
                    color="success"
                    onClick={toggleModalPayment}
                  >
                    Unlock Full Packet ({Packet.price ? Packet.price : "N/A"}
                    DT)
                  </Button>
                )}

                <>
                  {PacketProgress < 100 ? (
                    <></>
                  ) : (
                    <>
                      {completedPacket?.status == "Validated" ? (
                        <Button
                          className="mt-2"
                          color="success"
                          disabled={PacketProgress == 100 ? false : true}
                          onClick={() => {
                            history.push(
                              "/app/Packets/" +
                                Packet.title +
                                "/certificate/" +
                                user.user.slice(1, -1)
                            );
                          }}
                        >
                          View Certificate
                        </Button>
                      ) : (
                        <Button
                          className="mt-2"
                          color="success"
                          disabled={PacketProgress == 100 ? false : true}
                          onClick={toggle}
                        >
                          {completedPacket?.githubUrl
                            ? completedPacket?.status == "Declined"
                              ? "Complete Packet (Declination reason: " +
                                completedPacket?.reasonDeclined +
                                ")"
                              : "Complete Packet (Pending...)"
                            : "Complete Packet"}
                        </Button>
                      )}
                    </>
                  )}

                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Complete Packet</ModalHeader>
                    <ModalBody>
                      {alert.messsage.length > 0 && alert.color.length > 0 ? (
                        <Alert color={alert.color}>{alert.messsage}</Alert>
                      ) : (
                        <></>
                      )}
                      Validation Project: <br />
                      {Packet.validation}
                      <Form className="pt-4">
                        <FormGroup>
                          <Label for="currentPacketTitle">
                            Github repository (public repository)
                          </Label>
                          <Input
                            type="text"
                            placeholder="Link for github repository"
                            name="currentPacketTitle"
                            id="currentPacketTitle"
                            value={githubUrl}
                            disabled={
                              completedPacket?.githubUrl
                                ? completedPacket?.status == "Declined"
                                  ? false
                                  : true
                                : false
                            }
                            onChange={(e) => {
                              setGithubUrl(e.target.value);
                            }}
                          />
                          {completedPacket?.status == "Declined" ? (
                            <Label
                              for="currentPacketTitle"
                              style={{ color: "red" }}
                            >
                              Validation Declined for:{" "}
                              {completedPacket.reasonDeclined}
                            </Label>
                          ) : (
                            <></>
                          )}
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onClick={() => {
                          handleSendGithubRepo();
                        }}
                        disabled={
                          completedPacket?.githubUrl
                            ? completedPacket?.status == "Declined"
                              ? false
                              : true
                            : false
                        }
                      >
                        {completedPacket?.githubUrl
                          ? completedPacket?.status == "Declined"
                            ? "Resend github repository"
                            : "Pending..."
                          : "Send github repository"}
                      </Button>{" "}
                      <Button color="secondary" onClick={toggle}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                  <Modal isOpen={modalOpenPayment} toggle={toggleModalPayment}>
                    <ModalHeader toggle={toggleModalPayment}>
                      Payment System
                    </ModalHeader>
                    <ModalBody>
                      <Stepper packet={Packet} user={user} />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="secondary" onClick={toggleModalPayment}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Modal>
                </>
              </div>
            </div>

            <div className="pt-2" style={{ borderBottom: "1px black solid" }}>
              <span
                className={`btn  ${
                  activeTab === "overview" ? s.Tabactive : ""
                }`}
                onClick={() => handleTabClick("overview")}
              >
                Overview
              </span>
              <span
                className={`btn ${activeTab === "faq" ? s.Tabactive : ""}`}
                onClick={() => handleTabClick("faq")}
              >
                FAQ
              </span>
            </div>
            <div className="p-4">
              {activeTab === "overview" && (
                <div>
                  <p className="headline-3">Packet Description</p>
                  <p className="body-3 muted">{Packet.description}</p>
                  <p className="headline-3 pt-4">Packet Outcomes</p>
                  <ul
                    style={{ "list-style-type": "disc", paddingLeft: "20px" }}
                  >
                    <Row>
                      {Packet.outCome.map((out) => {
                        return (
                          <Col xs={6}>
                            <li>{out}</li>
                          </Col>
                        );
                      })}
                    </Row>
                  </ul>
                  <p className="headline-3 pt-4">Audience</p>
                  <p className="body-3 muted">{Packet.audience}</p>
                </div>
              )}
              {activeTab === "faq" && (
                <div>
                  {Packet.faq.map((f, index) => {
                    return (
                      <div key={index} className="mb-4">
                        <p
                          className="headline-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleItem(index)}
                        >
                          {f.question}
                          <i
                            className={"eva eva-expand-outline ml-2"}
                            style={{ fontSize: "15px" }}
                          />
                        </p>
                        {expandedItems.includes(index) && (
                          <p className="body-3 muted">{f.answer}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Widget>
        </Col>
        <Col md={4} xs={12}>
          <Widget className="widget-p-lg">
            <div className="d-flex">
              <div className={s.userInfo}>
                <p className="headline-2">Packet Content</p>
                <p className="body-3 muted">
                  Course{Packet.Courses.length > 1 ? "s" : ""}:{" "}
                  {Packet.Courses.length} | Learning Time: {learningTime} min
                  {learningTime > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <p className="headline-3" style={{ paddingTop: "20px" }}>
              Course{Packet.Courses.length > 1 ? "s" : ""}
            </p>
            {Packet.Courses.map((Course) => {
              return (
                <Link>
                  <div
                    className={`mt-3 ${s.widgetBlock}`}
                    style={{
                      backgroundColor: Course.status == "Done" ? "#43BC13" : "",
                      cursor:
                        Course.status != "Pending"
                          ? paidPacket?.status == "Validated"
                            ? "pointer"
                            : "auto"
                          : "pointer",
                    }}
                  >
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        {Course.status == "Done" ? (
                          <i
                            className={
                              "eva eva-checkmark-outline img-fluid mr-2"
                            }
                            style={{ fontSize: "50px", color: "white" }}
                          />
                        ) : (
                          <></>
                        )}

                        <div className="d-flex flex-column">
                          <p className="body-2">
                            <span
                              style={{
                                color:
                                  Course.status != "Pending"
                                    ? paidPacket?.status == "Validated"
                                      ? Course.status == "Done"
                                        ? "white"
                                        : ""
                                      : "white"
                                    : "",
                              }}
                            >
                              {Course.title}
                            </span>
                          </p>
                          <div
                            className="d-flex muted"
                            style={{
                              color:
                                paidPacket?.status == "Validated"
                                  ? Course.status == "Done"
                                    ? "white"
                                    : ""
                                  : "white",
                            }}
                          >
                            <i
                              className={"eva eva-clock-outline"}
                              style={{ fontSize: "20px", color: "black" }}
                            />
                            <p className="body-3" style={{ color: "black" }}>
                              {Course.mins} Min{Course.mins > 1 ? "s" : ""}{" "}
                              (Presentiel)
                            </p>
                          </div>
                        </div>
                      </div>
                      {Course.status != "Pending" ? (
                        paidPacket?.status == "Validated" ? (
                          Course.status == "Done" ? (
                            <></>
                          ) : (
                            <div className="checkbox checkbox-primary">
                              <i
                                className={"eva eva-expand-outline"}
                                style={{ fontSize: "20px" }}
                              />
                            </div>
                          )
                        ) : (
                          <></>
                        )
                      ) : (
                        <div className="checkbox checkbox-primary">
                          <i
                            className={"eva eva-expand-outline"}
                            style={{ fontSize: "20px" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  users: state.users,
  Packets: state.Packets,
});

export default connect(mapStateToProps)(Packet);
