import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import s from "./Dashboard.module.scss";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    searchEngineIndexing: false,
  });

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setPrivacy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={s.settingsPage}>
      <Row>
        {/* Notification Settings */}
        <Col xs={12} md={6}>
          <Card className={s.card}>
            <CardBody>
              <CardTitle tag="h4" className="mb-4">
                Notification Settings
              </CardTitle>
              <Form>
                <FormGroup check className="mb-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => toggleNotification("email")}
                    />
                    Email Notifications
                  </Label>
                </FormGroup>
                <FormGroup check className="mb-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={() => toggleNotification("sms")}
                    />
                    SMS Notifications
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => toggleNotification("push")}
                    />
                    Push Notifications
                  </Label>
                </FormGroup>
                <Button color="primary" className="mt-3">
                  Update Notifications
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* Privacy Settings */}
        <Col xs={12} md={6}>
          <Card className={s.card}>
            <CardBody>
              <CardTitle tag="h4" className="mb-4">
                Privacy Settings
              </CardTitle>
              <Form>
                <FormGroup>
                  <Label for="profileVisibility">Profile Visibility</Label>
                  <Input
                    type="select"
                    id="profileVisibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </Input>
                </FormGroup>
                <FormGroup check className="mt-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={privacy.searchEngineIndexing}
                      onChange={(e) =>
                        handlePrivacyChange("searchEngineIndexing", e.target.checked)
                      }
                    />
                    Allow Search Engine Indexing
                  </Label>
                </FormGroup>
                <Button color="primary" className="mt-3">
                  Save Privacy Settings
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Account Management */}
      <Row className="mt-4">
        <Col xs={12}>
          <Card className={s.card}>
            <CardBody>
              <CardTitle tag="h4" className="mb-4">
                Account Management
              </CardTitle>
              <p className="text-muted">
                Deactivate or delete your account if you no longer wish to use our services.
              </p>
              <Button color="warning" className="mr-3">
                Deactivate Account
              </Button>
              <Button color="danger">Delete Account</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
