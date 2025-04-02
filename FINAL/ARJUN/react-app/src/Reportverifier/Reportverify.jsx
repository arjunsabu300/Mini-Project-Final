import React, { useState, useEffect } from "react";
import "./reportdetails.css";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import AccountMenu from "../assets/Usermenu";
import Sidebarprincipalreport from "../assets/sidebarreport";
import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";

const Reportdetails = () => {
  const [reports, setReports] = useState([]);
  const [verifierEmail, setVerifierEmail] = useState("");
  const [dateOfVerify, setDateOfVerify] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproved, setIsApproved] = useState(false); // ✅ Approval status

  const [searchParams] = useSearchParams();
  const notifId = searchParams.get("notifId"); // ✅ Get Notification ID
  console.log("🔍 Notification ID:", notifId);

  const fetchReportDetails = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/report/reportviews",
        { notifId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      setVerifierEmail(data.verifier_email);
      setDateOfVerify(new Date(data.verify_date).toLocaleDateString());
      setReports(data.itemDetails || []);

      // ✅ Fetch approval status separately
      const notificationResponse = await axios.get(
        `http://localhost:5000/api/getNotification/${notifId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ If approval exists and is "Approved", update state
      setIsApproved(notificationResponse.data.approval === "Approved");

      console.log("✅ Report Data:", data);
    } catch (err) {
      console.error("❌ Error fetching reports:", err.response?.data);
      setError(err.response?.data?.message || "Failed to fetch report details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notifId) {
      fetchReportDetails();
    }
  }, [notifId]);

  // ✅ Approve Function
  const handleApprove = async () => {
    if (!notifId) {
      alert("Notification ID is missing!");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("No authentication token found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/approvereport",
        { notifId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Report approved successfully!");

      // ✅ Update UI - Hide button and show "Approved"
      setIsApproved(true);
    } catch (err) {
      console.error("❌ Approval Error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to approve reports");
    }
  };

  return (
    <div className="sdstocks-container">
      <Sidebarprincipalreport sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role={role} />
      <div className="sdmain-content">
        <header className="report-header">
          <h2>Verification Report</h2>
          <div className="header-icons">
            <FaBell className="notification-icon" />
            <AccountMenu />
          </div>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Item No</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Date of Verify</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={`${report.item_no}-${report.date_of_verify}`}>
                  <td>{report.item_no}</td>
                  <td>{report.status}</td>
                  <td>{report.remarks}</td>
                  <td>{new Date(report.date_of_verify).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="approve-container">
          {isApproved ? (
            <p style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>✅ Approved</p>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: "green", color: "white", "&:hover": { backgroundColor: "darkgreen" } }}
              onClick={handleApprove}
            >
              Approve
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reportdetails;
