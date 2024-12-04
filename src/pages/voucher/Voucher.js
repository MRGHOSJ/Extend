import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Pagination,
} from "reactstrap";
import * as Icons from "@material-ui/icons";
import "./Dashboard.module.scss"; // Custom CSS for additional styling

const Voucher = () => {
  const [vouchersData, setVouchersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vouchersPerPage = 6;

  useEffect(() => {
    // Example data, replace this with actual voucher data
    const fetchVouchers = () => {
      const vouchers = [
        {
          id: 1,
          logo: "https://via.placeholder.com/150",
          name: "Restaurant A",
          totalSales: 50,
          vouchersOffered: 150,
          credits: 40,
        },
        {
          id: 2,
          logo: "https://via.placeholder.com/150",
          name: "Restaurant B",
          totalSales: 30,
          vouchersOffered: 100,
          credits: 35,
        },
        {
          id: 3,
          logo: "https://via.placeholder.com/150",
          name: "Product X",
          totalSales: 15,
          vouchersOffered: 80,
          credits: 25,
        },
        {
          id: 4,
          logo: "https://via.placeholder.com/150",
          name: "Product Y",
          totalSales: 40,
          vouchersOffered: 120,
          credits: 50,
        },
        // Add more vouchers here...
      ];
      setVouchersData(vouchers);
    };

    fetchVouchers();
  }, []);

  // Pagination Logic
  const totalVouchers = vouchersData.length;
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = vouchersData.slice(
    indexOfFirstVoucher,
    indexOfLastVoucher
  );

  const maxPage = Math.ceil(totalVouchers / vouchersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBuyVoucher = (voucher) => {
    // Logic for handling the voucher purchase (e.g., API call)
    alert(
      `Voucher for ${voucher.name} purchased for ${voucher.credits} credits`
    );
  };

  return (
    <Row className="voucher-row">
      {currentVouchers.map((voucher) => (
        <Col md={6} key={voucher.id} className="mb-4">
          <Card className="voucher-card shadow-sm">
            <CardBody className="voucher-card-body">
              <Row>
                <Col
                  xs={3}
                  className="d-flex justify-content-center align-items-center"
                >
                  <img
                    src={voucher.logo}
                    alt={voucher.name}
                    className="voucher-logo"
                    style={{ maxWidth: "100%" }}
                  />
                </Col>
                <Col
                  xs={9}
                  className="d-flex flex-column justify-content-center"
                >
                  <CardTitle tag="h6" className="voucher-name">
                    {voucher.name}
                  </CardTitle>
                  <Row>
                    <Col>
                      <Row>
                        <Col xs={2}>
                          <Icons.AttachMoney />
                        </Col>
                        <Col>
                          <CardText>
                            <strong>Total Sales:</strong>
                          </CardText>
                          <CardText>
                            %{voucher.totalSales} <strong>OFF</strong>
                          </CardText>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <Row>
                        <Col xs={2}>
                          <Icons.Money />
                        </Col>
                        <Col>
                          <CardText className="voucher-info">
                            <strong>Offere:</strong>
                          </CardText>
                          <CardText className="voucher-info">
                            {voucher.vouchersOffered}
                            <strong> Credits</strong>
                          </CardText>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  color="outline-success"
                  className="voucher-btn manage-btn"
                  style={{ width: "48%" }}
                >
                  Get Voucher
                </Button>
                <Button
                  color="success"
                  className="voucher-btn visit-btn"
                  style={{ width: "48%" }}
                >
                  Visit shop
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
      <Col xs={12} className="d-flex justify-content-center mt-4">
        <Pagination className="pagination">
          {Array.from({ length: maxPage }, (_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              active={currentPage === index + 1}
            >
              {index + 1}
            </Button>
          ))}
        </Pagination>
      </Col>
    </Row>
  );
};

export default Voucher;
