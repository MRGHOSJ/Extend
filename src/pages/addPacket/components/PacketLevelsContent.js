import React, { useState } from "react";
import { Col, Row, Button, FormGroup, Label, Input } from "reactstrap";
import s from "../AddPacket.module.scss";

const PacketLevelsContent = (props) => {
  const [expandedcourses, setExpandedcourses] = useState([]);
  const { setPacketcourses, Packetcourses, PacketOld } = props;
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const toggleQuestion = (index) => {
    const newExpandedQuestions = [...expandedQuestions];
    if (newExpandedQuestions.includes(index)) {
      newExpandedQuestions.splice(newExpandedQuestions.indexOf(index), 1);
    } else {
      newExpandedQuestions.push(index);
    }
    setExpandedQuestions(newExpandedQuestions);
  };

  const toggleExpand = (index) => {
    setExpandedcourses((prevExpandedcourses) => {
      const isExpanded = prevExpandedcourses.includes(index);
      if (isExpanded) {
        return prevExpandedcourses.filter(
          (expandedIndex) => expandedIndex !== index
        );
      } else {
        return [...prevExpandedcourses, index];
      }
    });
  };

  const addRemoveCource = (action) => {
    let currentNbcourse = Packetcourses.length;

    if (action === "add") {
      setPacketcourses((prev) => [
        ...prev,
        {
          title: "title",
          mins: 0,
          status: "Pending"
        },
      ]);
    } else if (action === "remove" && currentNbcourse > 1) {
      setPacketcourses((prev) => prev.slice(0, -1));
    }
  };

  const removePacket = (index) => {
    setPacketcourses((prev) => prev.filter((Packet, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...Packetcourses];
    updatedCourses[index][field] = value;
    setPacketcourses(updatedCourses);
  };

  return (
    <div
      style={{
        height: "700px",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Row className="pt-4 pb-2">
        <Col xs={11}>
          <Button
            type="submit"
            color="primary"
            style={{ marginRight: "4px" }}
            onClick={(e) => {
              props.handleSavePacket(e, {
                ...PacketOld,
                Courses: Packetcourses,
              });
            }}
          >
            Save Changes
          </Button>
        </Col>
        <Col xs={1}>
          <span
            className="ml-2"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              addRemoveCource("add");
            }}
          >
            +
          </span>
          <span
            className="ml-4"
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              addRemoveCource("remove");
            }}
          >
            -
          </span>
        </Col>
      </Row>
      {Packetcourses.map((course, index) => {
        const isExpanded = expandedcourses.includes(index);
        return (
          <div key={index} className={`mt-3 ${s.widgetBlock}`}>
            <div className={s.widgetBody}>
              <div className="d-flex">
                <div className="body-2">course {index}</div>
                <div
                  className="body-3 muted"
                  onClick={() => toggleExpand(index)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <i
                    className={`eva ${
                      isExpanded ? "eva-collapse" : "eva-expand"
                    }`}
                  ></i>
                </div>
                {index == -1 ? (
                  <></>
                ) : (
                  <Button
                    type="submit"
                    color="danger"
                    className="ml-4"
                    style={{ marginRight: "4px" }}
                    onClick={() => {
                      removePacket(index);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            {isExpanded && (
              <div className="pt-4">
                <Row className="pl-4 pr-4">
                  <Col xs={6}>
                    <FormGroup>
                      <Label for="Title">Title</Label>
                      <Input
                        type="text"
                        name="Title"
                        id="Title"
                        value={course.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value)
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={6}>
                    <FormGroup>
                      <Label for="Title">Time</Label>
                      <Input
                        type="number"
                        name="Time"
                        id="Time"
                        value={course.mins}
                        onChange={(e) =>
                          handleInputChange(index, "mins", e.target.value)
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PacketLevelsContent;
