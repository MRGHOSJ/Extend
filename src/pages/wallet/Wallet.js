import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  CardTitle,
  Progress,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";



const Wallet = () => {
  const [activeTab, setActiveTab] = useState("1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="p-3">
            <CardBody className="text-center">
            <i className="eva eva-menu"></i>
            <CardTitle className="headline-3">Total Balance</CardTitle>
              <h1 className="headline-1">$12,345.67</h1>
              <div className="d-flex justify-content-center mt-3">
                <Button color="primary" className="mr-2">
                  Add Funds
                </Button>
                <Button color="secondary">Send Money</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Row>
        <Col xs={12}>
          <Nav tabs className="mb-3">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => toggleTab("1")}
              >
                Overview
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => toggleTab("2")}
              >
                Transactions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => toggleTab("3")}
              >
                Rewards
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>

      <TabContent activeTab={activeTab}>
        {/* Overview Tab */}
        <TabPane tabId="1">
          <Row>
            <Col xs={12} lg={6}>
              <Card className="p-3">
                <CardTitle className="headline-3">Recent Transactions</CardTitle>
                <ul className="list-unstyled mt-3">
                  <li className="d-flex justify-content-between">
                    <span>Amazon Purchase</span>
                    <span>-$120.00</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>PayPal Transfer</span>
                    <span>+$500.00</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Spotify Subscription</span>
                    <span>-$9.99</span>
                  </li>
                </ul>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className="p-3">
                <CardTitle className="headline-3">Spending Breakdown</CardTitle>
                {/* Replace with a pie chart component */}
                <i className="eva eva-menu"></i>
                </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Transactions Tab */}
        <TabPane tabId="2">
          <Card className="p-3">
            <CardTitle className="headline-3">Transaction History</CardTitle>
            <ul className="list-unstyled mt-3">
              <li className="d-flex justify-content-between">
                <span>Amazon Purchase</span>
                <span>-$120.00</span>
              </li>
              <li className="d-flex justify-content-between">
                <span>PayPal Transfer</span>
                <span>+$500.00</span>
              </li>
              <li className="d-flex justify-content-between">
                <span>Spotify Subscription</span>
                <span>-$9.99</span>
              </li>
              {/* Add more transactions here */}
            </ul>
          </Card>
        </TabPane>

        {/* Rewards Tab */}
        <TabPane tabId="3">
          <Card className="p-3">
            <CardTitle className="headline-3">Your Rewards</CardTitle>
            <div className="d-flex align-items-center mt-3">
            <i className="eva eva-menu"></i>
            <div>
                <p className="body-2">Available Points</p>
                <h3 className="headline-2">2,345</h3>
              </div>
            </div>
            <Button color="primary" className="mt-3">
              Redeem Points
            </Button>
          </Card>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Wallet;
