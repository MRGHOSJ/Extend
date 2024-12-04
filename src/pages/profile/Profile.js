import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import IconsPage from "../uielements/icons/IconsPage.js";

import {
  Col,
  Row,
  Progress,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import * as Icons from "@material-ui/icons";
import Widget from "../../components/Widget/Widget.js";
import user from "../../assets/user.svg";

import s from "./Dashboard.module.scss";
import { Hidden } from "@material-ui/core";
import { collection, getDocs } from "firebase/firestore";
import firestore from "../../database/firebase.js";

const Profile = () => {
  const [checkboxes, setCheckboxes] = useState([true, false]);
  const [users, setUsers] = useState(null);
  const [treeCount, setTreeCount] = useState(0);
  const [content, setContent] = useState({
    age: 28,
    invitedBy: "John Doe", // Person who invited you
    referralLink:
      "http://localhost:3000/register?referral=GbElSj7q99hSzPnMkLWojm35n4w1", // Referral link
    coursesAttended: 5, // Number of courses attended
    totalCourses: 20,
  });
  const [activeTab, setActiveTab] = useState("EditProfile");
  const [payment, setPayment] = useState([
    {
      date: "2023-12-08",
      price: 20,
      product: "SDL Menu",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/1/16/Simple_DirectMedia_Layer%2C_Logo.svg",
    },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleCheckbox = (id) => {
    setCheckboxes((checkboxes) =>
      checkboxes.map((checkbox, index) => (index === id ? !checkbox : checkbox))
    );
  };

  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content.referralLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const [isHovered, setIsHovered] = useState(false);

  const Node = ({ node }) => (
    <div
      className={s.node}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${s.nodeName} ${s[`grade${node.grade}Node`]}`}>
        {node.name} (Grade {node.grade})
      </div>
      {isHovered && (
        <div className={s.popup}>
          <p>Grade: {node.grade}</p>
          <p>{node.grade == 2 && <>20%</>}</p>
          <p>{node.grade == 3 && <>10%</>}</p>
          <p>{node.grade == 4 && <>15%</>}</p>
          <p>{node.grade == 5 && <>3%</>}</p>
          <p>{node.grade == 6 && <>1%</>}</p>
          {/* You can add more details or content here */}
        </div>
      )}
      {node.children?.length > 0 && (
        <div className={s.childNodes}>
          {node.children.map((child, index) => (
            <Node key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );

  const [userData, setUserData] = useState(null);
  const [hierarchyData, setHierarchyData] = useState(null); // State to store hierarchy data

  const buildHierarchy = (usersData, userid, grade = 1) => {
    let hierarchy = {
      name: "Me", // Or any other identifier for the top-level user
      grade: grade,
      children: [],
    };

    usersData.forEach((user) => {
      // Set user data if it matches
      if (user.id === userid) {
        setUserData(user);
      }

      // Check if this user is referred by the current user
      if (user.referral === userid) {
        // Add the user as a child of the current hierarchy
        const childHierarchy = buildHierarchy(usersData, user.id, grade + 1); // Increase grade for children
        hierarchy.children.push({
          name: user.name,
          grade: grade + 1,
          children: childHierarchy.children, // Recursively add their children
        });
      }
    });

    return hierarchy;
  };

  const countGrade6 = (node) => {
    let count = 0;
    if (node.grade === 6) {
      count++;
    }

    if (node.children) {
      for (const child of node.children) {
        count += countGrade6(child);
      }
    }
    return count;
  };

  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const userid = JSON.parse(localStorage.getItem("user"));
        if (!userid) return; // Ensure userid exists

        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersDataBase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersDataBase);

        console.log(usersDataBase);
        usersDataBase?.forEach((user) => {
          if (user.id === userid) {
            setUserData(user);
          }
        });

        const hierarchyData = buildHierarchy(usersDataBase, userid);

        setHierarchyData(hierarchyData);
        setTreeCount(countGrade6(hierarchyData));
        console.log(hierarchyData);
      } catch (error) {
        console.error("Error fetching packets:", error);
      }
    };

    fetchPackets();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Form submitted with: ",
      userData.name,
      userData.email,
      userData.phone
    );
  };
  const trees = Array.from({ length: treeCount }, (_, index) => (
    <Icons.Nature key={index} className="tree-icon" />
  ));
  return (
    <Row>
      <Col className="mt-4 mt-lg-0 pl-grid-col" md={4} xs={12}>
        <Widget className="widget-p-lg">
          {/* User Profile */}
          <div className="d-flex align-items-center mb-4">
            <img
              className="image"
              src={
                "https://api.dicebear.com/9.x/thumbs/svg?seed=" + userData?.name
              }
              style={{ width: "100px" }}
              alt="Profile"
            />
            <div className="userInfo">
              <p className="headline-3" style={{ marginLeft: "15px" }}>
                {userData?.name}
              </p>
              <p className="body-3 muted" style={{ marginLeft: "15px" }}>
                Tunisia
              </p>
            </div>
            <div style={{ marginLeft: "40px", font: "40px" }}>
              {userData?.role == "admin" ? (
                <>
                  <Icons.Person
                    style={{ fontSize: "70px", color: "#FF4B23" }}
                  />

                  <p className="body-3 muted" style={{ marginLeft: "12px" }}>
                    Admin
                  </p>
                </>
              ) : (
                <>
                  <Icons.Person
                    style={{ fontSize: "70px", color: "#43BC13" }}
                  />

                  <p className="body-3 muted" style={{ marginLeft: "20px" }}>
                    User
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="progress-section">
            <p className="headline-3 mb-2">Expert Level</p>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    (content.coursesAttended / content.totalCourses) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p className="body-3 muted mt-2">
              {content.coursesAttended} of {content.totalCourses} Packets
              Completed
            </p>
          </div>

          {/* User Parameters */}
          <div className="userParams">
            {/* Personal Info Section */}
            <div className="info-section mb-4 d-flex align-items-center">
              <Icons.Cake className="info-icon" />
              <div style={{ paddingTop: "30px" }}>
                <p className="headline-3">{content.age} y.</p>
                <p className="body-3 muted">Age</p>
              </div>
            </div>

            {/* Invitation Info Section */}
            <div className="info-section mb-4 d-flex align-items-center">
              <Icons.People className="info-icon" />
              <div style={{ paddingTop: "30px" }}>
                <p className="headline-3">
                  {userData?.referral
                    ? users?.map((user) => {
                        if (user.id == userData.referral) return user.name;
                      })
                    : "N/A"}
                </p>
                <p className="body-3 muted">Invited By</p>
              </div>
            </div>

            {/* Courses Attended Section */}
            <div className="info-section mb-4 d-flex align-items-center">
              <Icons.Layers className="info-icon" />
              <div style={{ paddingTop: "20px" }}>
                <p className="headline-3">{content.coursesAttended} Courses </p>
                <p className="body-3 muted"> Attended</p>
              </div>
            </div>

            <p className="body-3 muted">
              Referral Link
              <button
                onClick={copyToClipboard}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6A1B9A",
                  fontSize: "18px",
                }}
                aria-label="Copy link"
              >
                <Icons.FileCopy className="info-icon" />
              </button>
            </p>

            {/* Referral Link Section */}
            <div className="info-section mb-4 d-flex align-items-center">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f4f4f4",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: "16px",
                    cursor: "not-allowed",
                    opacity: "0.6",
                  }}
                >
                  <span
                    style={{
                      flexGrow: "1",
                      wordWrap: "break-word",
                      color: "#777",
                      maxWidth: "300px",
                      overflow: "Hidden",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {content.referralLink}
                  </span>
                </div>
              </div>
            </div>

            {isCopied && (
              <span
                style={{
                  color: "green",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Link Copied!
              </span>
            )}
            {/* Progress Bar Section */}

            <div>
              <p className="body-3 muted">
                <Icons.Nature className="info-icon" />
                Planted Trees ({treeCount > 0 ? treeCount : 0})
              </p>
              <p className="body-3 muted mt-2">
                {treeCount > 0 ? trees : "Nothing yet..."}
              </p>
            </div>
          </div>
        </Widget>
      </Col>

      <Col className="mt-4 mt-lg-0 pl-grid-col" md={8} xs={12}>
        <Widget className="widget-p-lg">
          <p className="headline-2">Profile Settings</p>
          <div className="pt-4" style={{ borderBottom: "1px black solid" }}>
            <span
              className={`btn  ${
                activeTab === "EditProfile" ? s.Tabactive : ""
              }`}
              onClick={() => handleTabClick("EditProfile")}
            >
              Personal Details
            </span>
            <span
              className={`btn ${
                activeTab === "ChangePassword" ? s.Tabactive : ""
              }`}
              onClick={() => handleTabClick("ChangePassword")}
            >
              Change Password
            </span>
            <span
              className={`btn ${activeTab === "Payment" ? s.Tabactive : ""}`}
              onClick={() => handleTabClick("Payment")}
            >
              Payment
            </span>
            <span
              className={`btn  ${
                activeTab === "EditProfile" ? s.Tabactive : ""
              }`}
              onClick={() => handleTabClick("Hierarchy")}
            >
              Hierarchy
            </span>
          </div>
          {userData && activeTab === "EditProfile" && (
            <Form onSubmit={handleSubmit} className="pt-4">
              <Row>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="lastName">Name</Label>
                    <Input
                      type="text"
                      name="Name"
                      id="Name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          name: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="text"
                      name="email"
                      id="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          email: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="phoneNumber">Phone number</Label>
                    <Input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData((prevState) => ({
                          ...prevState,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row
                className="pt-3"
                style={{ position: "absolute", right: "30px" }}
              >
                <Col xs={12}>
                  <Button
                    type="submit"
                    color="primary"
                    style={{ marginRight: "4px" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "white",
                      color: "#4d53e0",
                      borderColor: "#4d53e0",
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {activeTab === "ChangePassword" && (
            <Form className="pt-4">
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="CurrentPassword">Current Password</Label>
                    <Input
                      type="password"
                      name="CurrentPassword"
                      id="CurrentPassword"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="NewPassword">New Password</Label>
                    <Input
                      type="password"
                      name="NewPassword"
                      id="NewPassword"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="ConfirmerPassword">Confirmer Password</Label>
                    <Input
                      type="password"
                      name="ConfirmerPassword"
                      id="ConfirmerPassword"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row
                className="pt-3"
                style={{ position: "absolute", right: "30px" }}
              >
                <Col xs={12}>
                  <Button
                    type="submit"
                    color="primary"
                    style={{ marginRight: "4px" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    style={{
                      backgroundColor: "white",
                      color: "#4d53e0",
                      borderColor: "#4d53e0",
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>

              <br />
              <br />
            </Form>
          )}
          {activeTab === "Payment" && (
            <div style={{ height: "700px", overflowY: "auto" }}>
              {payment.map((pay) => {
                return (
                  <div className={`mt-3 ${s.widgetBlock}`}>
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        <Icons.AttachMoneyOutlined
                          className={"img-fluid mr-2"}
                          style={{ fontSize: "40px", color: "#43BC13" }}
                        />
                        <div className="d-flex flex-column">
                          <p className="body-2">{pay.date}</p>
                          <p className="body-3 muted">
                            {pay.price} DT, {pay.product}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <br />
          <br />

          {activeTab === "Payment" && (
            <div style={{ height: "700px", overflowY: "auto" }}>
              {payment.map((pay) => {
                return (
                  <div className={`mt-3 ${s.widgetBlock}`}>
                    <div className={s.widgetBody}>
                      <div className="d-flex">
                        <Icons.AttachMoneyOutlined
                          className={"img-fluid mr-2"}
                          style={{ fontSize: "40px", color: "#43BC13" }}
                        />
                        <div className="d-flex flex-column">
                          <p className="body-2">{pay.date}</p>
                          <p className="body-3 muted">
                            {pay.price} DT, {pay.product}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {activeTab === "Hierarchy" && (
            <div
              style={{
                height: "700px",
                overflowY: "auto",
                padding: "20px",
                fontFamily: "Spartan, sans-serif",
              }}
            >
              <div className={s.treeContainer}>
                <Node node={hierarchyData} />
              </div>
            </div>
          )}
        </Widget>
      </Col>
    </Row>
  );
};

export default Profile;
