import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Badge,
} from "reactstrap";
import classnames from "classnames";
import {
  doc,
  getDoc,
  increment,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import firestore from "../../database/firebase";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [currentUser, setCurrentUser] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] = useState(5); // Number of transactions to show
  const [loading, setLoading] = useState(true);
  const [noMoreTransactions, setNoMoreTransactions] = useState(false);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleAddModal = () => setAddModal(!addModal);
  const toggleWithdrawModal = () => setWithdrawModal(!withdrawModal);

  const handleCreditChange = (e) => {
    setCreditAmount(e.target.value);
  };

  const logTransaction = async (userId, amount, type, description) => {
    if (!userId || typeof amount !== "number" || !type) {
      console.error("Invalid transaction data.");
      return;
    }

    try {
      const transactionsRef = collection(
        firestore,
        "users",
        userId,
        "transactions"
      );
      const transactionDoc = await addDoc(transactionsRef, {
        amount,
        type,
        description,
        timestamp: serverTimestamp(),
      });

      // Append the new transaction to the state
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        {
          id: transactionDoc.id,
          amount,
          type,
          description,
          timestamp: new Date(), // Add a local timestamp for immediate UI update
        },
      ]);
      console.log("Transaction logged successfully.");
    } catch (error) {
      console.error("Error logging transaction:", error);
    }
  };

  const addCredits = async (userId, amount) => {
    if (!userId || typeof amount !== "number") {
      console.error("Invalid user ID or amount.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        credits: increment(amount),
      });

      const newCredits = (currentUser?.credits || 0) + amount;
      setCurrentUser({ ...currentUser, credits: newCredits });

      await logTransaction(userId, amount, "add", "Added credits");
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  const withdrawCredits = async (userId, amount) => {
    if (!userId || typeof amount !== "number") {
      console.error("Invalid user ID or amount.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        credits: increment(-amount),
      });

      const newCredits = (currentUser?.credits || 0) - amount;
      setCurrentUser({ ...currentUser, credits: newCredits });

      await logTransaction(userId, -amount, "withdraw", "Withdrew credits");
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };

  const handleAddCredits = () => {
    const amount = parseInt(creditAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      addCredits(currentUser.id, amount);
      setAddModal(false);
      setCreditAmount("");
    } else {
      alert("Enter a valid amount!");
    }
  };

  const handleWithdrawCredits = () => {
    const amount = parseInt(creditAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      withdrawCredits(currentUser.id, amount);
      setWithdrawModal(false);
      setCreditAmount("");
    } else {
      alert("Enter a valid amount!");
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const userId = JSON.parse(localStorage.getItem("user"));

      // Query Firestore to get transactions sorted by timestamp (descending)
      const transactionsRef = collection(
        firestore,
        "users",
        userId,
        "transactions"
      );
      const transactionsQuery = query(
        transactionsRef,
        orderBy("timestamp", "desc"),
        limit(visibleTransactions)
      );

      const querySnapshot = await getDocs(transactionsQuery);
      const transactionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set the transactions to state
      setTransactions(transactionsData);
      setLoading(false);

      // Check if there are more transactions
      if (transactionsData.length < visibleTransactions) {
        setNoMoreTransactions(true);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const userid = JSON.parse(localStorage.getItem("user"));
      const userRef = doc(firestore, "users", userid); // Get a reference to the specific document
      const userSnapshot = await getDoc(userRef); // Fetch the document

      if (userSnapshot.exists()) {
        setCurrentUser({ ...userSnapshot.data(), id: userid }); // Set the user data
      } else {
        console.error("User not found");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, []);

  const handleShowMore = () => {
    setVisibleTransactions(visibleTransactions + 5); // Show 5 more transactions
  };
  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="p-3 rounded shadow">
            <CardBody className="text-center">
              <CardTitle className="headline-3">Learning Credits</CardTitle>
              <h1 className="headline-1">
                {currentUser?.credits ? currentUser?.credits : 0} Credit
                {currentUser?.credits > 0 ? "s" : ""}
              </h1>
              <p className="text-muted">
                Use your credits to enroll in new courses, unlock resources, or
                access premium content.
              </p>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  color="primary"
                  className="mr-2"
                  onClick={toggleAddModal}
                >
                  Add Credits
                </Button>
                <Button color="secondary" onClick={toggleWithdrawModal}>
                  Withdraw
                </Button>
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
                Achievements
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
              <Card className="p-3 rounded shadow">
                <CardTitle className="headline-3">Recent Activity</CardTitle>
                <ul className="list-unstyled mt-3">
                  <li className="d-flex justify-content-between">
                    <span>Enrolled: JavaScript Basics</span>
                    <span>-50 Credits</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Reward: Quiz Challenge</span>
                    <span>+20 Credits</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Enrolled: Python for Beginners</span>
                    <span>-70 Credits</span>
                  </li>
                </ul>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className="p-3 rounded shadow">
                <CardTitle className="headline-3">Course Progress</CardTitle>
                <ul className="list-unstyled mt-3">
                  <li className="d-flex justify-content-between">
                    <span>JavaScript Basics</span>
                    <span>80% Complete</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Python for Beginners</span>
                    <span>50% Complete</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span>Data Structures</span>
                    <span>30% Complete</span>
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Transactions Tab */}
        <TabPane tabId="2">
          <Card className="p-3 rounded shadow">
            <CardBody>
              <CardTitle className="headline-3 mb-3">
                Transaction History
              </CardTitle>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner type="grow" color="primary" />
                </div>
              ) : (
                <>
                  {transactions.length > 0 ? (
                    <ul className="list-unstyled mt-3">
                      {transactions.map((transaction) => (
                        <li
                          key={transaction.id}
                          className="d-flex justify-content-between align-items-center border-bottom py-2"
                        >
                          <div>
                            <h6 className="mb-0">{transaction.description}</h6>
                            <small className="text-muted">
                              {new Date(
                                transaction.timestamp.seconds * 1000
                              ).toLocaleString()}
                            </small>
                          </div>
                          <div>
                            <span
                              className={`${
                                transaction.amount > 0
                                  ? "text-success"
                                  : "text-danger"
                              } font-weight-bold`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount} Credits
                            </span>
                            <Badge
                              color={
                                transaction.amount > 0 ? "success" : "danger"
                              }
                              className="ml-2"
                            >
                              {transaction.type}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No transactions found.</p>
                  )}
                  {!noMoreTransactions && (
                    <div className="text-center mt-3">
                      <Button color="primary" onClick={handleShowMore}>
                        Show More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </TabPane>

        {/* Achievements Tab */}
        <TabPane tabId="3">
          <Card className="p-3 rounded shadow">
            <CardTitle className="headline-3">Your Achievements</CardTitle>
            <ul className="list-unstyled mt-3">
              <li>
                <h5>🏆 Quiz Champion</h5>
                <p className="text-muted">
                  Completed 10 quizzes with a perfect score.
                </p>
              </li>
              <li>
                <h5>🎓 Dedicated Learner</h5>
                <p className="text-muted">
                  Logged in daily for 30 days straight.
                </p>
              </li>
              <li>
                <h5>📚 Course Master</h5>
                <p className="text-muted">Completed 5 full courses.</p>
              </li>
            </ul>
            <Button color="primary" className="mt-3">
              View More Achievements
            </Button>
          </Card>
        </TabPane>
      </TabContent>

      <Modal isOpen={addModal} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Credits</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="creditAmount">Enter amount to add:</Label>
              <Input
                type="number"
                id="creditAmount"
                placeholder="e.g., 50"
                value={creditAmount}
                onChange={handleCreditChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddCredits}>
            Add
          </Button>
          <Button color="secondary" onClick={toggleAddModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Withdraw Credit Modal */}
      <Modal isOpen={withdrawModal} toggle={toggleWithdrawModal}>
        <ModalHeader toggle={toggleWithdrawModal}>Withdraw Credits</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="creditAmount">Enter amount to withdraw:</Label>
              <Input
                type="number"
                id="creditAmount"
                placeholder="e.g., 50"
                value={creditAmount}
                onChange={handleCreditChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleWithdrawCredits}>
            Withdraw
          </Button>
          <Button color="secondary" onClick={toggleWithdrawModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Wallet;
