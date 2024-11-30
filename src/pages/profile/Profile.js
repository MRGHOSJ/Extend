import React, { useState } from "react";
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
  Form,
  FormGroup, 
  Label, 
  Input, 
} from "reactstrap";
import * as Icons from "@material-ui/icons";
import Widget from "../../components/Widget/Widget.js";
import heartRed from "../../assets/dashboard/heartRed.svg";
import heartTeal from "../../assets/dashboard/heartTeal.svg";
import heartViolet from "../../assets/dashboard/heartViolet.svg";
import heartYellow from "../../assets/dashboard/heartYellow.svg";
import gymIcon from "../../assets/dashboard/gymIcon.svg";
import therapyIcon from "../../assets/dashboard/therapyIcon.svg";
import user from "../../assets/user.svg";
import statsPie from "../../assets/dashboard/statsPie.svg";

import s from "./Dashboard.module.scss";

const Profile = () => {
  const [checkboxes, setCheckboxes] = useState([true, false])

  const [activeTab, setActiveTab] = useState('EditProfile');
  const [payment, setPayment] = useState([
    {
      date:'2023-12-08',
      price:20,
      product:'SDL Menu',
      image:'https://upload.wikimedia.org/wikipedia/commons/1/16/Simple_DirectMedia_Layer%2C_Logo.svg',
    },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleCheckbox = (id) => {
    setCheckboxes(checkboxes => checkboxes
      .map((checkbox, index) => index === id ? !checkbox : checkbox))
  }
  return (
    <Row>
      <Col className="mt-4 mt-lg-0 pl-grid-col" md={4} xs={12}>
        <Widget className="widget-p-lg">
          <div className="d-flex">
            <img className={s.image} src={user} alt="..." />
            <div className={s.userInfo}>
              <p className="headline-3">Christina Karey</p>
              <p className="body-3 muted">Brasil</p>
            </div>
          </div>
          <div className={s.userParams}>
            <div className="d-flex flex-column">
              <p className="headline-3">63 kg</p>
              <p className="body-3 muted">Weight</p>
            </div>
            <div className="d-flex flex-column">
              <p className="headline-3">175 sm</p>
              <p className="body-3 muted">Height</p>
            </div>
            <div className="d-flex flex-column">
              <p className="headline-3">28 y.</p>
              <p className="body-3 muted">Age</p>
            </div>
          </div>
          <div className={s.goals}>
            <div className={s.goalsTitle}>
              <p className="headline-3">Your Goals</p>
              <UncontrolledDropdown>
                <DropdownToggle caret>
                  &nbsp; Weekly &nbsp;
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Daily</DropdownItem>
                  <DropdownItem>Weekly</DropdownItem>
                  <DropdownItem>Monthly</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            <div className={s.smallWidget}>
              <div className="d-flex mb-4">
                <img className="py-1 mr-2 img-fluid" src={heartViolet} alt="..." />
                <div className="d-flex flex-column">
                  <p className="headline-3">Qt</p>
                  <p className="body-2">Num<span className="body-3 muted">/ ber</span></p>
                </div>
              </div>
              <div>
                <Progress color="violet" className={`progress-xs ${s.mutedViolet}`} value="100" />
              </div>
            </div>
            <div className={s.smallWidget}>
              <div className="d-flex mb-4">
                <img className="py-1 mr-2 img-fluid" src={heartYellow} alt="..." />
                <div className="d-flex flex-column">
                  <p className="headline-3">Web</p>
                  <p className="body-2">Num<span className="body-3 muted">/ ber</span></p>
                </div>
              </div>
              <div>
                <Progress color="violet" className={`progress-xs ${s.mutedViolet}`} value="75" />
              </div>
            </div>
            <div className={s.smallWidget}>
              <div className="d-flex mb-4">
                <img className="py-1 mr-2 img-fluid" src={heartTeal} alt="..." />
                <div className="d-flex flex-column">
                  <p className="headline-3">SDL</p>
                  <p className="body-2">Num<span className="body-3 muted">/ ber</span></p>
                </div>
              </div>
              <div>
                <Progress color="violet" className={`progress-xs ${s.mutedViolet}`} value="0" />
              </div>
            </div>
            <div className={s.smallWidget}>
              <div className="d-flex mb-4">
                <img className="py-1 mr-2 img-fluid" src={heartRed} alt="..." />
                <div className="d-flex flex-column">
                  <p className="headline-3">Mobile</p>
                  <p className="body-2">Num<span className="body-3 muted">/ ber</span></p>
                </div>
              </div>
              <div>
                <Progress color="violet" className={`progress-xs ${s.mutedViolet}`} value="0" />
              </div>
            </div>
          </div>
        </Widget>
      </Col>
      <Col className="mt-4 mt-lg-0 pl-grid-col" md={8} xs={12}>
        <Widget className="widget-p-lg">
        <p className="headline-2">Profile Settings</p>
          <div className="pt-4" style={{ borderBottom: "1px black solid" }}>
            <span
              className={`btn  ${activeTab === 'EditProfile' ? s.Tabactive : ''}`}
              onClick={() => handleTabClick('EditProfile')}
            >
              Personal Details
            </span>
            <span
              className={`btn ${activeTab === 'ChangePassword' ? s.Tabactive : ''}`}
              onClick={() => handleTabClick('ChangePassword')}
            >
              Change Password
            </span>
            <span
              className={`btn ${activeTab === 'Payment' ? s.Tabactive : ''}`}
              onClick={() => handleTabClick('Payment')}
            >
              Payment
            </span>
          </div>
        {activeTab === 'EditProfile' && (
          <Form className="pt-4">
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                  />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label for="lastName">Email</Label>
                  <Input
                    type="text"
                    name="email"
                    id="email"
                  />
                </FormGroup>
              </Col>
              <Col xs={12}>
                <FormGroup>
                  <Label for="lastName">Adress</Label>
                  <Input
                    type="text"
                    name="adress"
                    id="adress"
                  />
                </FormGroup>
              </Col>              
              <Col xs={12}>
                <FormGroup>
                  <Label for="lastName">Phone number</Label>
                  <Input
                    type="number"
                    name="Phonenumber"
                    id="Phonenumber"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label for="lastName">Country</Label>
                  <Input
                    type="text"
                    name="country"
                    id="country"
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label for="lastName">City</Label>
                  <Input
                    type="text"
                    name="city"
                    id="city"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="pt-3" style={{position:"absolute",right:"30px"}}>
            <Col xs={12}  >
              <Button type="submit" color="primary" style={{marginRight:"4px"}}>
              Save Changes
            </Button>
              <Button type="button" style={{backgroundColor:"white",color:"#4d53e0",borderColor:"#4d53e0"}}>
              Cancel
            </Button>
              </Col>
            </Row>
            
            <br/>
            <br/>
          </Form>
        )}
        {activeTab === 'ChangePassword' && (
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
            <Row className="pt-3" style={{position:"absolute",right:"30px"}}>
            <Col xs={12}  >
              <Button type="submit" color="primary" style={{marginRight:"4px"}}>
              Save Changes
            </Button>
              <Button type="button" style={{backgroundColor:"white",color:"#4d53e0",borderColor:"#4d53e0"}}>
              Cancel
            </Button>
              </Col>
            </Row>
            
            <br/>
            <br/>
          </Form>
        )}
        {activeTab === 'Payment' && (
       <div style={{height:'700px',overflowY:'auto'}}>
        {
          payment.map((pay)=>{
            return(
            <div className={`mt-3 ${s.widgetBlock}`}>
              <div className={s.widgetBody}>
                <div className="d-flex">
                  <Icons.AttachMoneyOutlined
                    className={"img-fluid mr-2"}
                    style={{ fontSize: "40px", color: "#43BC13" }}
                  />
                  <div className="d-flex flex-column">
                    <p className="body-2">{pay.date}</p>
                    <p className="body-3 muted">{pay.price} DT, {pay.product}</p>
                  </div>
                </div>
              </div>
            </div>
            )
          })
        }
       
       </div>
      )}
        </Widget>
      </Col>
    </Row>
  )
}

export default Profile;
