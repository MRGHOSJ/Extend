import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  FormGroup,
  Label,
  Card,
  CardBody,
  CardTitle,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as Icons from "@material-ui/icons";
import { collection, getDocs } from "firebase/firestore";
import firestore from "../../database/firebase";
import plusImage from "../../assets/Packets/newPacket.png";

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [activeTab, setActiveTab] = useState("FriendList");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const friendsPerPage = 6;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch friends data from Firestore
    const userid = JSON.parse(localStorage.getItem("user"));
    const fetchFriends = async () => {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const friends = [];
      const allUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      allUsers.forEach((user) => {
        if (user.id !== userid) {
          friends.push(user);
        } else {
          setUserData(user);
        }
      });
      setFriendsData(friends);
      setFilteredFriends(friends);
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    let updatedFriends = friendsData;

    // Filter friends based on search query
    if (searchQuery) {
      updatedFriends = updatedFriends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort friends based on selected criteria
    updatedFriends = updatedFriends.sort((a, b) => {
      if (sortBy === "name") {
        if (sortOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (sortBy === "email") {
        if (sortOrder === "asc") {
          return a.email.localeCompare(b.email);
        } else {
          return b.email.localeCompare(a.email);
        }
      }
      return 0;
    });

    setFilteredFriends(updatedFriends);
  }, [friendsData, searchQuery, sortBy, sortOrder]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInviteFriend = () => {
    if (inviteEmail) {
      // Logic for sending an invite (e.g., via email or API)
      alert(`Invite sent to ${inviteEmail}`);
      setInviteEmail(""); // Clear the input field
    } else {
      alert("Please enter an email address.");
    }
  };

  const copyToClipboard = () => {
    const referralLink = "http://extend-five.vercel.app/register?referral="+userData?.id; // Adjust this to your actual referral link
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Pagination Logic
  const totalFriends = filteredFriends.length;
  const activeFriends = filteredFriends.filter(
    (friend) => friend.isActive
  ).length;
  const indexOfLastFriend = currentPage * friendsPerPage;
  const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
  const currentFriends = filteredFriends.slice(
    indexOfFirstFriend,
    indexOfLastFriend
  );

  const maxPage = Math.ceil(totalFriends / friendsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Row>
      <Col lg={12} className="card p-4">
        <div className="tab-nav">
          <Button
            onClick={() => handleTabClick("FriendList")}
            active={activeTab === "FriendList"}
          >
            Friend List
          </Button>
          <Button
            onClick={() => handleTabClick("ShareInvite")}
            active={activeTab === "ShareInvite"}
          >
            Share/Invite
          </Button>
        </div>

        {activeTab === "FriendList" && (
          <div className="friend-list pt-4">
            <Input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="d-flex justify-content-between mt-3">
              <Dropdown>
                <DropdownToggle caret>
                  Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => setSortBy("name")}>
                    Name
                  </DropdownItem>
                  <DropdownItem onClick={() => setSortBy("email")}>
                    Email
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
            <p>Total Friends: {totalFriends}</p>
            <p>Active Friends: {activeFriends}</p>
            <Row>
              {currentFriends.map((friend, index) => (
                <Col md={4} key={index} className="mb-4">
                  <Card className="friend-card">
                    <CardBody>
                      <div className="friend-header d-flex align-items-center">
                        <img
                          src={
                            friend.avatar ||
                            "https://api.dicebear.com/9.x/thumbs/svg?seed=" +
                              friend.name
                          }
                          alt={friend.name}
                          style={{ width: "50px", borderRadius: "50px" }}
                          className="mr-3"
                        />
                        <CardTitle tag="h5">{friend.name}</CardTitle>
                        {friend.isActive ? (
                          <Badge color="success" className="ml-auto">
                            Active
                          </Badge>
                        ) : (
                          <Badge color="secondary" className="ml-auto">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="friend-details mt-3">
                        <p>
                          <strong>Email:</strong> {friend.email}
                        </p>
                        {friend.phone && (
                          <p>
                            <strong>Phone:</strong> {friend.phone}
                          </p>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
              {currentPage == maxPage &&
                totalFriends / friendsPerPage != maxPage && (
                  <Col md={4} className="mb-4">
                    <Card className="friend-card">
                      <CardBody
                        style={{
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        <Button
                          onClick={() => handleTabClick("ShareInvite")}
                          style={{
                            backgroundColor: "white",
                            borderColor: "white",
                          }}
                        >
                          <Icons.AddBoxOutlined
                            style={{
                              fontSize: "100px",
                              color: "black",
                            }}
                          />
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                )}
            </Row>
            <div className="pagination mt-4">
              {Array.from({ length: maxPage }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  active={currentPage === index + 1}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ShareInvite" && (
          <div className="share-invite pt-4">
            <p>Share your referral link:</p>
            <Button color="primary" onClick={copyToClipboard}>
              {isCopied ? "Link Copied!" : "Copy Referral Link"}
            </Button>
            <div className="mt-3">
              <p>Or invite a friend by email:</p>
              <Form>
                <FormGroup>
                  <Label for="email">Friend's Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" onClick={handleInviteFriend}>
                  Invite Friend
                </Button>
              </Form>
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Friends;
