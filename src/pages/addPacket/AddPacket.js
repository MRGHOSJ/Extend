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
import Widget from "../../components/Widget/Widget.js";

import s from "./AddPacket.module.scss";
import PacketDetails from "./components/packetDetails.js";
import PacketLevelsContent from "./components/PacketLevelsContent.js";
import firestore from "../../database/firebase.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min.js";
import { connect } from "react-redux";

const AddPacket = () => {
  const { currentPacket } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState(null);
  const [Packets, setPackets] = useState([]); // To store all packets fetched from Firebase
  const [Packet, setPacket] = useState({
    title: "",
    image: "",
    description: "",
    outCome: [""],
    price: 0,
    validation: "",
    audience: "",
    status: "Available",
    faq: [{ question: "", answer: "" }],
  });
  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState("PacketDetails");
  const [PacketLevels, setPacketLevels] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleSavePacket = async (e, PacketToSave) => {
    console.log(PacketToSave);
    if (PacketToSave != null) {
      setPacket(PacketToSave);
    }
    e.preventDefault();
    if (
      !Packet.title ||
      !Packet.description ||
      !Packet.audience ||
      Packet.outCome.length === 0 ||
      !Packet.outCome[0] ||
      !Packet.faq.some((entry) => entry.question || entry.answer)
    ) {
      setShowAlert(true);
      return;
    }

    try {
      const PacketWithCourses = {
        ...Packet,
        Courses: [],
      };
      const PacketsCollectionRef = collection(firestore, "Packets");
      if (currentPacket) {
        const querySnapshot = await getDocs(
          query(PacketsCollectionRef, where("title", "==", currentPacket))
        );

        if (!querySnapshot.empty) {
          const existingPacketDoc = querySnapshot.docs[0];
          await updateDoc(
            doc(PacketsCollectionRef, existingPacketDoc.id),
            PacketToSave
          );
          setAlert({
            type: "success",
            message: "Packet updated successfully!",
          });
        } else {
          await addDoc(PacketsCollectionRef, PacketWithCourses);
          setAlert({
            type: "success",
            message: "Packet added successfully!",
          });
          history.push("/app/Packets/add/" + Packet.title);
        }
      } else {
        await addDoc(PacketsCollectionRef, PacketWithCourses);
        setAlert({
          type: "success",
          message: "Packet added successfully!",
        });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        message: "Error saving/updating Packet:" + error,
      });
    }
  };
  const history = useHistory();

  useEffect(() => {
    const fetchPackets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Packets")); // Fetch 'Packets' collection
        const packetsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackets(packetsData);

        if (packetsData && currentPacket) {
          const packetFound = packetsData.find(
            (Packet) =>
              Packet.title.toLowerCase() === currentPacket.toLowerCase()
          );

          if (packetFound) {
            setPacket(packetFound);
            setPacketLevels(packetFound.Courses);
            setEdit(true);
          } else {
            history.push("/app/Packets/add");
          }
        }
      } catch (error) {
        console.error("Error fetching packets:", error);
      }
    };

    fetchPackets();
  }, []); // Empty dependency array ensures this runs only once


  const [PacketToDelete, setPacketToDelete] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    if (PacketToDelete.toLowerCase() != currentPacket.toLowerCase()) {
      setAlert({
        type: "danger",
        message: "Wrong Packet Title",
      });
      return;
    }
    try {
      const querySnapshot = await getDocs(
        query(
          collection(firestore, "Packets"),
          where("title", "==", PacketToDelete)
        )
      );

      if (querySnapshot.empty) {
        setAlert({
          type: "danger",
          message: "Packet Not Found",
        });
        return;
      }
      const PacketDoc = querySnapshot.docs[0];
      await deleteDoc(doc(firestore, "Packets", PacketDoc.id));

      history.push("/app/Packets");
    } catch (error) {
      setAlert({
        type: "danger",
        message: "Error deleting Packet:" + error,
      });
    }
  };
  return (
    <Row>
      <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12}>
        {alert && (
          <Alert color={alert.type} isOpen={true} toggle={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}
        <Widget className="widget-p-lg">
          <p className="headline-2">Packet Settings</p>
          <div className="pt-4" style={{ borderBottom: "1px black solid" }}>
            <span
              className={`btn  ${
                activeTab === "PacketDetails" ? s.Tabactive : ""
              }`}
              onClick={() => handleTabClick("PacketDetails")}
            >
              Packet Details
            </span>
            {edit == true ? (
              <>
                <span
                  className={`btn ${
                    activeTab === "PacketLevels" ? s.Tabactive : ""
                  }`}
                  onClick={() => handleTabClick("PacketLevels")}
                >
                  Packet Courses
                </span>
                <span
                  className={`btn ${
                    activeTab === "PacketDelete" ? s.Tabactive : ""
                  }`}
                  onClick={() => handleTabClick("PacketDelete")}
                >
                  Delete Packet
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
          {activeTab === "PacketDetails" && (
            <PacketDetails
              Packet={Packet}
              setPacket={setPacket}
              setShowAlert={setShowAlert}
              handleSavePacket={handleSavePacket}
            />
          )}
          {activeTab === "PacketDelete" && (
            <Form className="pt-4">
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="currentPacketTitle">ReWrite Packet Title</Label>
                    <Input
                      type="text"
                      name="currentPacketTitle"
                      id="currentPacketTitle"
                      value={PacketToDelete}
                      onChange={(e) => {
                        setPacketToDelete(e.target.value);
                      }}
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
                    color="danger"
                    style={{ marginRight: "4px" }}
                    onClick={(e) => {
                      handleDelete(e);
                    }}
                  >
                    Delete Packet
                  </Button>
                </Col>
              </Row>

              <br />
              <br />
            </Form>
          )}
          {activeTab === "PacketLevels" && (
            <PacketLevelsContent
              Packet={Packet}
              setPacketcourses={setPacketLevels}
              Packetcourses={PacketLevels}
              handleSavePacket={handleSavePacket}
            />
          )}
        </Widget>
      </Col>
    </Row>
  );
};

export default AddPacket;
