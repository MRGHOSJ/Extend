import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Alert,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const PacketDetails = (props) => {
  let { handleSavePacket } = props;
  const [Packet, setPacket] = useState({
    title: "",
    image: "",
    description: "",
    outCome: [""],
    price: 0,
    audience: "",
    status: "Available",
    faq: [{ question: "", answer: "" }],
  });
  useEffect(() => {
    setPacket(props.Packet);
  }, [props.Packet, handleSavePacket, props.setPacket]);
  const changeFaQNb = (action) => {
    let currentFaqNB = Packet.faq.length;
    if (action === "add") {
      setPacket((prev) => ({
        ...prev,
        faq: [...prev.faq, { question: "", answer: "" }],
      }));
    } else if (action === "sub" && currentFaqNB > 1) {
      setPacket((prev) => ({
        ...prev,
        faq: prev.faq.slice(0, -1),
      }));
    }
  };

  const handleQuestionChange = (index, value) => {
    setPacket((prev) => {
      const updatedPairs = [...prev.faq];
      updatedPairs[index].question = value;
      return { ...prev, faq: updatedPairs };
    });
  };

  const handleAnswerChange = (index, value) => {
    setPacket((prev) => {
      const updatedPairs = [...prev.faq];
      updatedPairs[index].answer = value;
      return { ...prev, faq: updatedPairs };
    });
  };

  const renderQuestionAnswerPairs = () => {
    return (
      <>
        {Packet.faq.map((pair, index) => (
          <Col xs={12} key={index}>
            <FormGroup>
              <Label for={`question${index}`}>Question {index}</Label>
              {index == 0 ? (
                <>
                  <span
                    className="ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      changeFaQNb("add");
                    }}
                  >
                    +
                  </span>
                  <span
                    className="ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      changeFaQNb("sub");
                    }}
                  >
                    -
                  </span>
                </>
              ) : (
                <></>
              )}

              <Input
                type="text"
                id={`question${index}`}
                value={pair.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
              />
              <Label for={`answer${index}`}>Answer {index}</Label>
              <Input
                type="text"
                id={`answer${index}`}
                value={pair.answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </FormGroup>
          </Col>
        ))}
      </>
    );
  };
  return (
    <Form className="pt-4">
      <Row>
        <Col xs={6}>
          <FormGroup>
            <Label for="Title">Title</Label>
            <Input
              type="text"
              value={Packet.title}
              onChange={(e) => {
                setPacket((prev) => {
                  return {
                    ...prev,
                    title: e.target.value,
                  };
                });
              }}
              name="Title"
              id="Title"
            />
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <Label for="Image">Image</Label>
            <Input
              type="text"
              value={Packet.image}
              onChange={(e) => {
                setPacket((prev) => {
                  return {
                    ...prev,
                    image: e.target.value,
                  };
                });
              }}
              name="Image"
              id="Image"
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <Label for="lastName">Description</Label>
            <Input
              type="text"
              value={Packet.description}
              onChange={(e) => {
                setPacket((prev) => {
                  return {
                    ...prev,
                    description: e.target.value,
                  };
                });
              }}
              name="description"
              id="description"
            />
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <Label for="lastName">
              Out Comes ( Separate each outcome with a ',' )
            </Label>
            <Input
              type="text"
              name="outCome"
              value={Packet.outCome.join(",")}
              onChange={(event) => {
                const newCome = event.target.value
                  .split(",")
                  .map((item) => item.trim());
                setPacket({ ...Packet, outCome: newCome });
              }}
              id="OutCome"
            />
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <Label for="lastName">Audience</Label>
            <Input
              type="text"
              value={Packet.audience}
              onChange={(e) => {
                setPacket((prev) => {
                  return {
                    ...prev,
                    audience: e.target.value,
                  };
                });
              }}
              name="audience"
              id="audience"
            />
          </FormGroup>
        </Col>

        <Col xs={6}>
          <FormGroup>
            <Label for="type">Type</Label>
            <Input
              type="select"
              name="type"
              id="type"
              value={Packet.status}
              onChange={(e) => {
                setPacket((prev) => {
                  return {
                    ...prev,
                    status: e.target.value,
                  };
                });
              }}
            >
              <option value="Available">Available</option>
              <option value="Locked">Locked</option>
              <option value="ComingSoon">Coming Soon</option>
            </Input>
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup>
            <Label for="Price">Price in DT (Optional)</Label>
            <Input
              type="number"
              value={Packet.price}
              onChange={(e) => {
                setPacket((prev) => {
                  return {
                    ...prev,
                    price: e.target.value,
                  };
                });
              }}
              name="price"
              id="price"
            />
          </FormGroup>
        </Col>
        {renderQuestionAnswerPairs()}
      </Row>
      <Row className="pt-3" style={{ position: "absolute", right: "30px" }}>
        <Col xs={12}>
          <Button
            type="submit"
            color="primary"
            style={{ marginRight: "4px" }}
            onClick={(e) => {
              handleSavePacket(e, Packet);
            }}
          >
            Save Changes
          </Button>
        </Col>
      </Row>

      <br />
      <br />
    </Form>
  );
};

export default PacketDetails;
