import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Progress,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import { Link } from "react-router-dom/cjs/react-router-dom";
import newPacketImage from "../../assets/Packets/newPacket.png";
import { connect } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import firestore from "../../database/firebase.js";


const Packets = () => {
  const [filter, setFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("progress");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentpackets, setCurrentpackets] = useState([]);

  const sortpackets = (a, b) => {
    const multiplier = sortOrder != "asc" ? 1 : -1;

    if (sortOption === "progress") {
      return multiplier * (b.progress - a.progress);
    } else if (sortOption === "Courses") {
      return multiplier * (a.Courses.length - b.Courses.length);
    } else if (sortOption === "mins") {
      return multiplier * (a.mins - b.mins);
    }

    return 0;
  };

  const isValidImageUrl = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };
  const filteredpackets =
    currentpackets.length > 0
      ? currentpackets
          .filter((course) => {
            const titleMatch = course.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

            if (filter === "all") {
              return titleMatch;
            } else if (filter === "available") {
              return course.status === "Available" && titleMatch;
            } else if (filter === "comingSoon") {
              return course.status === "ComingSoon" && titleMatch;
            } else if (filter === "Locked") {
              return course.status === "Locked" && titleMatch;
            }

            return true;
          })
          .sort(sortpackets)
      : [];

  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Packets")); // Fetch 'Packets' collection
        const packetsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCurrentpackets(packetsData);
      } catch (error) {
        console.error("Error fetching packets:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const userid = JSON.parse(localStorage.getItem("user"));
        if (!userid) return; // Ensure userid exists

        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersDataBase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        usersDataBase?.forEach((user) => {
          if (user.id === userid && user.role == "admin") {
            setIsAdmin(true);
          }
        });

      } catch (error) {
        console.error("Error fetching packets:", error);
      }
    };
    fetchUsers();
    fetchPackets();
  }, []);

  return (
    <div>
      <Row className="gutter">
        <Col className="mb-4" xs={6}>
          <Row>
            <Col
              xl={filter != "all" ? (filter == "comingSoon" ? 3 : 3) : 2}
              xs={4}
              className={filter != "comingSoon" ? "mr-2" : "mr-4"}
            >
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setFilter("all")}>
                    All
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilter("available")}>
                    Available
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilter("comingSoon")}>
                    Coming Soon
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilter("Locked")}>
                    Buy Now
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col>
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  Sort:{" "}
                  {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSortOption("progress")}>
                    By Progress
                  </DropdownItem>
                  <DropdownItem onClick={() => setSortOption("Courses")}>
                    By Courses
                  </DropdownItem>
                  <DropdownItem onClick={() => setSortOption("mins")}>
                    By Mins
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xl={3} xs={6}>
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  Order: {sortOrder.toUpperCase()}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSortOrder("asc")}>
                    Ascending
                  </DropdownItem>
                  <DropdownItem onClick={() => setSortOrder("desc")}>
                    Descending
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
        </Col>
        <Col className="mb-4" xs={6}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control mb-3"
          />
        </Col>
      </Row>
      <Row className="gutter">
        {isAdmin ? (
          <>
            <Col className="mb-4" xs={12} sm={6} xl={3}>
              <Widget className="widget-p-sm">
                <Link to={"/app/packets/add"}>
                  <div>
                    <div className="d-flex mb-2">
                      <img
                        src={newPacketImage}
                        className="py-1 mr-2 img-fluid"
                      />
                    </div>
                  </div>
                </Link>
              </Widget>
            </Col>
          </>
        ) : (
          <></>
        )}

        {filteredpackets.map((course) => {
          return (
            <Col className="mb-4" xs={12} sm={6} xl={3}>
              <Widget className="widget-p-sm">
                {isAdmin && (
                  <Link
                    isOpen={true}
                    to={"/app/packets/add/" + course.title}
                    style={{ position: "absolute", right: "15px" }}
                  >
                    <i className="eva eva-menu"></i>
                  </Link>
                )}

                <Link
                  to={
                    course.status != "ComingSoon" ? (
                      "/app/packets/" + course.title
                    ) : (
                      <></>
                    )
                  }
                >
                  <div style={{ color: "black" }}>
                    <div className="d-flex mb-2">
                      <img
                        className="py-1 mr-2 img-fluid"
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          height: "150px",
                        }}
                        src={
                          isValidImageUrl(course.image)
                            ? course.image
                            : "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
                        }
                        alt="..."
                      />
                    </div>
                    <div>
                      <p className="headline-3 mb-2">{course.title}</p>
                      <Row className="gutter mb-2">
                        <Col xs={5} className="d-flex mb-2">
                          <i
                            className={"eva eva-monitor-outline"}
                            style={{ fontSize: "20px" }}
                          />
                          <p className="body-3 text-muted mb-0">
                            {course.Courses.length} Course
                            {course.Courses.length > 1 ? "s" : ""}
                          </p>
                        </Col>
                        <Col xs={6} className="d-flex mb-2">
                          <i
                            className={"eva eva-clock-outline"}
                            style={{ fontSize: "20px" }}
                          />
                          <p className="body-3 text-muted mb-0">
                            120 Mins
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        {course.status == "Available" ? (
                          course.progress == 100 ? (
                            <>
                              <Col
                                xs={12}
                                className="d-flex"
                                style={{ color: "#43BC13" }}
                              >
                                <i
                                  className={"eva eva-checkmark-outline "}
                                  style={{ fontSize: "20px" }}
                                />
                                <span className={"body-3 mb-0 "}>
                                  Completed
                                </span>
                              </Col>
                            </>
                          ) : course.progress > 0 ? (
                            <>
                              <Col xs={9}>
                                <Progress
                                  color="success"
                                  className={`progress-xs mt-2`}
                                  value={course.progress}
                                />
                              </Col>
                              <Col xs={3} className="d-flex mb-2">
                                <span className={"body-3 text-muted mb-0 "}>
                                  {course.progress}%
                                </span>
                              </Col>
                            </>
                          ) : (
                            <>
                              <Col
                                xs={12}
                                className="d-flex"
                                style={{ color: "#4c54e3" }}
                              >
                                <i
                                  className={"eva eva-info-outline "}
                                  style={{ fontSize: "20px" }}
                                />
                                <span className={"body-3 mb-0 "}>
                                  Available
                                </span>
                              </Col>
                            </>
                          )
                        ) : course.status == "ComingSoon" ? (
                          <>
                            <Col xs={12} className="d-flex text-muted">
                              <i
                                className={"eva eva-lock-outline "}
                                style={{ fontSize: "20px" }}
                              />
                              <span className={"body-3 mb-0 "}>
                                Coming Soon
                              </span>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col
                              xs={12}
                              className="d-flex"
                              style={{ color: "#ff5668" }}
                            >
                              <i
                                className={"eva eva-lock-outline "}
                                style={{ fontSize: "20px" }}
                              />
                              <span className={"body-3 mb-0 boldFont "}>
                                Buy now {course.price}DT
                              </span>
                            </Col>
                          </>
                        )}
                      </Row>
                    </div>
                  </div>
                </Link>
              </Widget>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  users: state.users,
  packets: state.packets,
});

export default connect(mapStateToProps)(Packets);
