import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Col,
  Row,
  Progress,
  Button,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import ApexActivityChart from "./components/ActivityChart.js";
import RechartsPieChart from "./components/RechartsPieChart.js";
import meal1 from "../../assets/dashboard/meal-1.svg";
import meal2 from "../../assets/dashboard/meal-2.svg";
import meal3 from "../../assets/dashboard/meal-3.svg";
import upgradeImage from "../../assets/dashboard/upgradeImage.svg";
import heartRed from "../../assets/dashboard/heartRed.svg";
import heartTeal from "../../assets/dashboard/heartTeal.svg";
import heartViolet from "../../assets/dashboard/heartViolet.svg";
import heartYellow from "../../assets/dashboard/heartYellow.svg";

import s from "./Dashboard.module.scss";
import { collection, getDocs } from "firebase/firestore";
import firestore from "../../database/firebase.js";

const Dashboard = () => {
  const [checkboxes, setCheckboxes] = useState([true, false]);
  const [loading, setLoading] = useState(true); // Add loading state

  const toggleCheckbox = (id) => {
    setCheckboxes((checkboxes) =>
      checkboxes.map((checkbox, index) => (index === id ? !checkbox : checkbox))
    );
  };

  // TO BE CHANGED LATER /////////////////////////////////////////////
  const [lesssons, setLessons] = useState(0);
  const [learningTime, setYourActivity] = useState([2, 8, 1, 6, 1, 1, 0]);
  const [yourGoal, setYourGoal] = useState([10, 5, 2, 5, 10, 5, 2]);

  const [yourCourses, setYourCourses] = useState([
    {
      name: "Course 1",
      progress: "100",
      image:
        "https://img.freepik.com/free-vector/flat-design-online-courses-illustration_52683-37617.jpg",
    },
    {
      name: "Course 2",
      progress: "70",
      image:
        "https://img.freepik.com/free-vector/flat-design-online-courses-illustration_52683-37617.jpg",
    },
    {
      name: "Course 3",
      progress: "15",
      image:
        "https://img.freepik.com/free-vector/flat-design-online-courses-illustration_52683-37617.jpg",
    },
  ]);

  const [yourOders, setYourOders] = useState([
    {
      name: "Ahmed",
      placement: "1",
      credits: "5000",
    },
    {
      name: "Youssef",
      placement: "2",
      credits: "4200",
    },
    {
      name: "Mohamed",
      placement: "3",
      credits: "3080",
    },
  ]);

  const getBadge = (placement) => {
    switch (placement) {
      case "1":
        return { badge: "🏆", color: "#FFD700", bgColor: "#FFF9E6" }; // Gold
      case "2":
        return { badge: "🥈", color: "#C0C0C0", bgColor: "#F5F5F5" }; // Silver
      case "3":
        return { badge: "🥉", color: "#CD7F32", bgColor: "#FFF4E6" }; // Bronze
      default:
        return { badge: "🏅", color: "#9E9E9E", bgColor: "#FAFAFA" }; // Others
    }
  };

  const getPlacementText = (placement) => {
    switch (placement) {
      case "1":
        return "1st";
      case "2":
        return "2nd";
      case "3":
        return "3rd";
      default:
        return `${placement}th`;
    }
  };

  const [yourStats, setYourStats] = useState({
    orders: 6,
    completed_courses: 0,
    pending_courses: 0,
    available_courses: 30,
  });

  const [currentUser, setCurrentUser] = useState(null);
  ////////////////////////////////////////////////////////////////

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

        usersDataBase?.forEach((user) => {
          if (user.id === userid) {
            setCurrentUser(user);
          }
        });
      } catch (error) {
        console.error("Error fetching packets:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchPackets();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <Row>
          <Col xs={12}>
            <Row className="gutter mb-4">
              <Col xs={12}>
                <Widget className="widget-p-none">
                  <div className="d-flex flex-wrap align-items-center justify-content-center">
                    <div className="d-flex flex-column align-items-center col-12 col-xl-6 p-sm-4">
                      <p className="headline-1">Welcome {currentUser?.name},</p>
                      <p className="body-3">
                        You have completed {lesssons} lesson
                        {lesssons > 1 ? "s" : ""} in the past few days. Get
                        learning now.
                      </p>
                    </div>
                    <div className="d-flex justify-content-center col-12 col-xl-6">
                      <img
                        className="p-1 img-fluid"
                        src={upgradeImage}
                        alt="..."
                      />
                    </div>
                  </div>
                </Widget>
              </Col>
            </Row>
          </Col>
          <Col className="pr-grid-col" xs={12} lg={12}>
            <Row className="gutter mb-4">
              <Col className="mb-4 mb-md-0" xs={12} md={4}>
                <Widget className="">
                  <div className="d-flex justify-content-between widget-p-md">
                    <div className="headline-3 d-flex align-items-center">
                      Learning Time
                    </div>
                  </div>
                  <ApexActivityChart
                    className="pb-4"
                    series={[
                      {
                        name: "Your Activity",
                        type: "column",
                        data: learningTime,
                      },
                      {
                        name: "Your Goal",
                        type: "line",
                        data: yourGoal,
                      },
                    ]}
                  />
                </Widget>
              </Col>
              <Col xs={12} md={4}>
                <Widget className={`widget-p-md  ${s.widgetOverFlow}`}>
                  <div className="d-flex justify-content-between">
                    <div className="headline-3 d-flex align-items-center">
                      Your Courses
                    </div>
                  </div>
                  {yourCourses.map((course) => (
                    <div key={uuidv4()} className={`mt-4 ${s.widgetBlock}`}>
                      <div className={s.widgetBody}>
                        <div className="d-flex">
                          <img
                            className="img-fluid mr-2"
                            src={course.image}
                            style={{ width: "50px" }}
                            alt="..."
                          />
                          <div className="d-flex flex-column">
                            <p className="body-2">{course.name}</p>
                            {course.progress == "100" ? (
                              <p
                                className="body-3"
                                style={{ color: "#43BC13" }}
                              >
                                Completed
                              </p>
                            ) : (
                              <Progress
                                color="secondary-red"
                                className={`progress-xs ${s.mutedPink}`}
                                value={course.progress}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Widget>
              </Col>
              <Col xs={12} md={4}>
                <Widget className={`widget-p-md`}>
                  <div className="d-flex justify-content-between mb-3">
                    <div className="headline-3">Leaderboard</div>
                  </div>
                  {yourOders.map((order) => {
                    const { badge, color, bgColor } = getBadge(order.placement);
                    const placementText = getPlacementText(order.placement);

                    return (
                      <div
                        key={uuidv4()}
                        className="p-3 rounded mb-3"
                        style={{
                          backgroundColor: bgColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Badge and Name */}
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              fontSize: "24px",
                              marginRight: "16px",
                              color: color,
                            }}
                          >
                            {badge}
                          </div>
                          <div>
                            <p
                              className="mb-1"
                              style={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              {order.name}
                            </p>
                            <span className="body-3 text-muted">
                              {order.credits} credits
                            </span>
                          </div>
                        </div>

                        {/* Placement Text */}
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {placementText}
                        </div>
                      </div>
                    );
                  })}
                </Widget>
              </Col>
            </Row>
            <Row className="gutter">
              <Col className="mb-4 mb-xl-0" xs={6} sm={6} xl={3}>
                <Widget className="widget-p-sm">
                  <div className={s.smallWidget}>
                    <div className="d-flex mb-4">
                      <img
                        className="py-1 mr-2 img-fluid"
                        src={heartRed}
                        alt="..."
                      />
                      <div className="d-flex flex-column">
                        <p className="headline-3">Available Packets</p>
                        <p className="body-2">
                          {yourStats.orders}
                          <span className="body-3 muted">/ Packets</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <Progress
                        color="secondary-red"
                        className={`progress-xs ${s.mutedPink}`}
                        value="75"
                      />
                    </div>
                  </div>
                </Widget>
              </Col>
              <Col className="mb-4 mb-xl-0" xs={6} sm={6} xl={3}>
                <Widget className="widget-p-sm">
                  <div className={s.smallWidget}>
                    <div className="d-flex mb-4">
                      <img
                        className="py-1 mr-2 img-fluid"
                        src={heartYellow}
                        alt="..."
                      />
                      <div className="d-flex flex-column">
                        <p className="headline-3">Total Friends</p>
                        <p className="body-2">
                          {yourStats.completed_courses}
                          <span className="body-3 muted">/ Friends</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <Progress
                        color="secondary-yellow"
                        className={`progress-xs ${s.mutedYellow}`}
                        value="75"
                      />
                    </div>
                  </div>
                </Widget>
              </Col>
              <Col xs={6} sm={6} xl={3}>
                <Widget className="widget-p-sm">
                  <div className={s.smallWidget}>
                    <div className="d-flex mb-4">
                      <img
                        className="py-1 mr-2 img-fluid"
                        src={heartTeal}
                        alt="..."
                      />
                      <div className="d-flex flex-column">
                        <p className="headline-3">Available Vouchers</p>
                        <p className="body-2">
                          {yourStats.pending_courses}
                          <span className="body-3 muted">/ Vouchers</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <Progress
                        color="secondary-cyan"
                        className={`progress-xs ${s.mutedTeal}`}
                        value="75"
                      />
                    </div>
                  </div>
                </Widget>
              </Col>
              <Col xs={6} sm={6} xl={3}>
                <Widget className="widget-p-sm">
                  <div className={s.smallWidget}>
                    <div className="d-flex mb-4">
                      <img
                        className="py-1 mr-2 img-fluid"
                        src={heartViolet}
                        alt="..."
                      />
                      <div className="d-flex flex-column">
                        <p className="headline-3">Available Courses</p>
                        <p className="body-2">
                          {yourStats.available_courses}
                          <span className="body-3 muted">/ Courses</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <Progress
                        color="violet"
                        className={`progress-xs ${s.mutedViolet}`}
                        value="75"
                      />
                    </div>
                  </div>
                </Widget>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
