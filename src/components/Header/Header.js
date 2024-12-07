import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  InputGroupAddon,
  InputGroup,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
} from "reactstrap";
import * as Icons from "@material-ui/icons";

import { logoutUser } from "../../actions/auth";
import { closeSidebar, openSidebar } from "../../actions/navigation";
import MenuIcon from "../Icons/HeaderIcons/MenuIcon";
import SearchBarIcon from "../Icons/HeaderIcons/SearchBarIcon";
import SearchIcon from "../Icons/HeaderIcons/SearchIcon";

import ProfileIcon from "../../assets/navbarMenus/pfofileIcons/ProfileIcon";
import MessagesIcon from "../../assets/navbarMenus/pfofileIcons/MessagesIcon";
import TasksIcon from "../../assets/navbarMenus/pfofileIcons/TasksIcon";

import logoutIcon from "../../assets/navbarMenus/pfofileIcons/logoutOutlined.svg";
import basketIcon from "../../assets/navbarMenus/basketIcon.svg";
import calendarIcon from "../../assets/navbarMenus/calendarIcon.svg";
import envelopeIcon from "../../assets/navbarMenus/envelopeIcon.svg";
import mariaImage from "../../assets/navbarMenus/mariaImage.jpg";
import notificationImage from "../../assets/navbarMenus/notificationImage.jpg";
import userImg from "../../assets/user.svg";

import s from "./Header.module.scss";
import "animate.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { collection, getDocs } from "firebase/firestore";
import firestore from "../../database/firebase";

const Header = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const toggleLanguage = () => {
    setLanguageOpen(!languageOpen);
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

        usersDataBase?.forEach((user) => {
          if (user.id === userid) {
            setCurrentUser(user);
          }
        });
      } catch (error) {
        console.error("Error fetching packets:", error);
      }
    };

    fetchPackets();
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSidebar = () => {
    if (props.sidebarOpened) {
      props.dispatch(closeSidebar());
    } else {
      const paths = props.location.pathname.split("/");
      paths.pop();
      props.dispatch(openSidebar());
    }
  };

  const doLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    history.push("/login");
  };
  const [currentLanguage, setCurrentLanguage] = useState("EN");
  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <Navbar className={`${s.root} d-print-none`}>
      <div>
        <NavLink
          onClick={() => toggleSidebar()}
          className={`d-md-none mr-3 ${s.navItem}`}
          href="#"
        >
          <MenuIcon className={s.menuIcon} />
        </NavLink>
      </div>
      <Nav className="ml-auto">
        <NavItem className="d-sm-none mr-4">
          <NavLink className="" href="#">
            <SearchIcon />
          </NavLink>
        </NavItem>

        {/* Language Switcher */}
        <Dropdown
          isOpen={languageOpen}
          toggle={() => toggleLanguage()}
          nav
          className="ml-3"
        >
          <div
            className="d-flex align-items-center justify-content-center mr-4 p-2 rounded-pill bg-light border"
            style={{ minWidth: "150px" }}
          >
            <DropdownToggle nav caret className="navbar-dropdown-toggle">
              {currentLanguage == "EN" ? (
                <>
                  <img
                    src="https://media.istockphoto.com/id/1513978246/vector/united-kingdom-flag-vector-illustration-eps10.jpg?s=612x612&w=0&k=20&c=CZzB6tSqcpyzDJzMnF0xOLy3MlyvPTGHw-Y1zu62zOk="
                    alt="English Flag"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  English
                </>
              ) : (
                <>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnRwI8eUTEAnhsr6xyhd-5n-7yPVAW13fZDA&s"
                    alt="French Flag"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                  />
                  Français
                </>
              )}
            </DropdownToggle>
            <DropdownMenu className="language-dropdown">
              <DropdownItem onClick={() => changeLanguage("EN")}>
                <img
                  src="https://media.istockphoto.com/id/1513978246/vector/united-kingdom-flag-vector-illustration-eps10.jpg?s=612x612&w=0&k=20&c=CZzB6tSqcpyzDJzMnF0xOLy3MlyvPTGHw-Y1zu62zOk="
                  alt="English Flag"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                />
                English
              </DropdownItem>
              <DropdownItem onClick={() => changeLanguage("FR")}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnRwI8eUTEAnhsr6xyhd-5n-7yPVAW13fZDA&s"
                  alt="French Flag"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "10px",
                  }}
                />
                Français
              </DropdownItem>
              {/* Add other languages as needed */}
            </DropdownMenu>
          </div>
        </Dropdown>
        <Dropdown
          isOpen={notificationsOpen}
          toggle={() => toggleNotifications()}
          nav
          id="basic-nav-dropdown"
        >
          <div
            className="d-flex align-items-center justify-content-center mr-4 p-2 rounded-pill bg-light border"
            style={{ minWidth: "150px" }}
          >
            <Icons.AttachMoney
              style={{ fontSize: "20px", marginRight: "8px", color: "#4CAF50" }}
            />
            <span className="text-dark font-weight-bold">
              {currentUser?.credits || 0} Credits
            </span>
          </div>

          <Dropdown
            nav
            isOpen={menuOpen}
            toggle={() => toggleMenu()}
            className="tutorial-dropdown mr-2 mr-sm-3"
          >
            <DropdownToggle nav>
              <div className={s.navbarBlock}>
                <i className={"eva eva-bell-outline"} />
                <div className={s.count}></div>
              </div>
            </DropdownToggle>
            <DropdownMenu
              right
              className="navbar-dropdown notifications-dropdown"
              style={{ width: "340px" }}
            >
              <DropdownItem>
                <img src={basketIcon} alt="Basket Icon" />
                <span>3 new packets have been added today</span>
              </DropdownItem>
              <DropdownItem>
                <img src={calendarIcon} alt="Calendar Icon" />
                <span>1 event has been canceled and ...</span>
              </DropdownItem>
              <DropdownItem>
                <img src={envelopeIcon} alt="Envelope Icon" />
                <span>you have 2 new messages</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <DropdownToggle nav caret className="navbar-dropdown-toggle">
            <span className={`${s.avatar} rounded-circle float-left mr-2`}>
              <img
                src={
                  "https://api.dicebear.com/9.x/thumbs/svg?seed=" +
                  currentUser?.name
                }
                style={{ width: "100px" }}
                alt="User"
              />
              <span
                className="position-absolute bottom-0 right-0 bg-success rounded-circle"
                style={{
                  width: "12px",
                  height: "12px",
                  marginLeft: "40px",
                  marginBottom: "40px",
                  border: "2px solid white",
                }}
              ></span>
            </span>
            <span className="small d-none d-sm-block ml-1 mr-2 body-1">
              {currentUser?.email}
            </span>
          </DropdownToggle>
          <DropdownMenu
            className="navbar-dropdown profile-dropdown"
          >
            <DropdownItem className={s.dropdownProfileItem}>
              <ProfileIcon />
              <span>Profile</span>
            </DropdownItem>
            <DropdownItem className={s.dropdownProfileItem}>
              <TasksIcon />
              <span>Tasks</span>
            </DropdownItem>
            <DropdownItem className={s.dropdownProfileItem}>
              <MessagesIcon />
              <span>Messages</span>
            </DropdownItem>
            <NavItem>
              <NavLink onClick={(e) => doLogout(e)} href="#">
                <button
                  className="btn btn-primary rounded-pill mx-auto logout-btn"
                  type="submit"
                >
                  <img src={logoutIcon} alt="Logout" />
                  <span className="ml-1">Logout</span>
                </button>
              </NavLink>
            </NavItem>
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool,
};

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
