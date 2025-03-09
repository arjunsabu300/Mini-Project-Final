import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./NotificationPanel.css";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    console.error("❌ No token found. User is not authenticated.");
                    return;
                }

                const decoded = jwtDecode(token);
                const userEmail = decoded.email;

                // ✅ Fetch notifications
                const response = await axios.get("http://localhost:5000/api/fetch-notifications", {
                    params: { receiver: userEmail },
                    headers: { Authorization: `Bearer ${token}` } // ✅ Include token in request
                });
                let fetchedNotifications = response.data.data;
                console.log("📩 Raw Notifications:", fetchedNotifications);

                // 🔍 Type-Based Filtering
                const validNotifications = fetchedNotifications.filter((notif) => {
                    if (notif.type === "tskstockforward") {
                        return notif.indent_no && notif.sl_no && notif.quantity;
                    } 
                    if (notif.type === "hodstockaccept") {
                        return notif.indent_no && notif.sl_no;
                    } 
                    if (notif.type === "hodstockforward") {
                        return notif.indent_no && notif.quantity && notif.message;
                    }
                    if (notif.type === "sicstockaccept") {
                        return notif.indent_no && notif.quantity && notif.message;
                    }
                    if (notif.type === "hodstockreject") {
                        return notif.indent_no && notif.sl_no && notif.message;
                    }
                    if (notif.type === "sicstockreject") {
                        return notif.indent_no && notif.message;
                    }
                    if (notif.type === "principalfacultyassign") {
                        return notif.facultyemail && notif.last_date;
                    }
                    if (notif.type === "verifier_report") {
                        return notif.verifier_email && notif.verifier_name && notif.verify_date;
                    }
                    return false; // Exclude all other notification types
                });

                console.log("✅ Filtered Notifications:", validNotifications);
                setNotifications(validNotifications);
            } catch (error) {
                console.error("❌ Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const handleAddacc = async (notifId) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. User is not authenticated.");
                return;
            }
            navigate(`/register?notifId=${notifId}`);

            await axios.post(
                "http://localhost:5000/api/Add-account",
                { notifId },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Include token
            );

            setNotifications(notifications.filter((n) => n._id !== notifId)); // Remove from UI
            console.log(`✅ Notification ${notifId} accepted.`);
        } catch (error) {
            console.error("❌ Error accepting notification:", error);
        }
    };

    const handleview = async (notifId) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. User is not authenticated.");
                return;
            }
            navigate(`/reportverify?notifId=${notifId}`);
            await axios.post(
                "http://localhost:5000/api/report/reportviews",
                { notifId },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Include token
            );
            
            //navigate(`/reportverify/${notifId}`);
            setNotifications(notifications.filter((n) => n._id !== notifId)); // Remove from UI
            
            console.log(`✅ Notification ${notifId} accepted.`);
        } catch (error) {
            console.error("❌ Error accepting notification:", error);
        }
    };


    const handleAccept = async (notifId) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. User is not authenticated.");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/accept-notification",
                { notifId },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Include token
            );

            setNotifications(notifications.filter((n) => n._id !== notifId)); // Remove from UI
            console.log(`✅ Notification ${notifId} accepted.`);
        } catch (error) {
            console.error("❌ Error accepting notification:", error);
        }
    };

    const handleReject = async (notifId) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("❌ No token found. User is not authenticated.");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/reject-notification",
                { notifId },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Include token
            );

            setNotifications(notifications.filter((n) => n._id !== notifId)); // Remove from UI
            console.log(`❌ Notification ${notifId} rejected.`);
        } catch (error) {
            console.error("❌ Error rejecting notification:", error);
        }
    };

    const handleMarkRead = async (notifId) => {
        try {
          await axios.post("http://localhost:5000/api/mark-notification-read", {
            notifId,
          });
          setNotifications(notifications.filter((n) => n._id !== notifId));
        } catch (error) {
          console.error("❌ Error marking notification as read:", error);
        }
      };
    
      const handleAction = async (notifId, action) => {
        try {
          const token = sessionStorage.getItem("token");
          if (!token) {
            console.error("❌ No token found. User is not authenticated.");
            return;
          }
    
          const endpoint =
            action === "accept"
              ? "http://localhost:5000/api/accept-notification-h"
              : "http://localhost:5000/api/reject-notification-h";
    
          await axios.post(
            endpoint,
            { notifId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
    
          setNotifications(notifications.filter((n) => n._id !== notifId));
        } catch (error) {
          console.error(`❌ Error ${action}ing notification:`, error);
        }
      };
    
      const handleHodStockAction = async (notifId, action) => {
        try {
          const token = sessionStorage.getItem("token");
          if (!token) {
            console.error("❌ No token found. User is not authenticated.");
            return;
          }
    
          if (action === "accept") {
            axios
              .post("http://localhost:5000/api/create-sicstockaccept", { notifId })
              .then((response) => {
                console.log(
                  "✅ SicStockAccept Notification Created:",
                  response.data
                );
              })
              .catch((error) => {
                console.error(
                  "❌ Error creating SicStockAccept notification:",
                  error
                );
              })
              .finally(() => {
                navigate(`/addstockforward?notifId=${notifId}`);
              });
          } else {
            //this is to reject forwarded stock by hod by SIC even though api call is called hod-reject
            await axios.post(
              "http://localhost:5000/api/hod-reject-notification",
              { notifId },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(notifications.filter((n) => n._id !== notifId));
          }
        } catch (error) {
          console.error(`❌ Error ${action}ing HOD stock notification:`, error);
        }
      };

    
    return (
        <div className="notidashboard">
          <div className="notisidebar">
            <div className="notisidebar-item active">🔔 Notifications</div>
          </div>
    
          <div className="notinotification-panel">
            <h2>Notifications</h2>
    
            <div className="notinotification-list">
              {notifications.length === 0 ? (
                <p className="empty-message">No new notifications</p>
              ) : (
                <ul>
                  {notifications.map((notif) => (
                    <li key={notif._id} className="notinotification-item">
                      {notif.type === "tskstockforward" && (
                        <div>
                          <strong>TSK FORWARDING STOCK</strong>
                          <br />
                          <strong>Indent No:</strong> {notif.indent_no} <br />
                          <strong>Sl No:</strong> {notif.sl_no} <br />
                          <strong>Quantity:</strong> {notif.quantity} <br />
                          <div className="notibtn-group">
                            <button
                              className="notiaccept-btn"
                              onClick={() => handleAction(notif._id, "accept")}
                            >
                              ✅ Accept
                            </button>
                            <button
                              className="notidecline-btn"
                              onClick={() => handleAction(notif._id, "reject")}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      )}
    
                    {notifications.filter((notif, index, self) =>
                              notif.type === "principalfacultyassign" &&
                              notif.facultyname?.trim() &&
                              notif.facultyemail?.trim() &&
                              notif.premise?.trim() &&
                              notif.last_date &&
                              !isNaN(new Date(notif.last_date).getTime()) &&
                              self.findIndex(n => n._id === notif._id) === index // Prevent duplicate entries
                          ).map((notif) => (
                              notif.type === "principalfacultyassign" ? (
                                  <li key={notif._id} className="notinotification-item">
                                      <div>
                                          <strong>VERIFIER ASSIGNED BY PRINCIPAL</strong><br />
                                          <strong>faculty name:</strong> {notif.facultyname} <br />
                                          <strong>faculty email:</strong> {notif.facultyemail} <br />
                                          <strong>Premise:</strong> {notif.premise} <br />
                                          <strong>Last Date:</strong> {new Date(notif.last_date).toLocaleDateString()} <br />
    
                                      </div>
                                      <div className="notibtn-group">
                                          <button className="notiaccept-btn" onClick={() => handleAddacc(notif._id)}>✅ Add Account</button>
                                      </div>
                                   </li>
                              ) : null
                      ))}
    
              
                    {notifications.map((notif,index) => (
                              notif.type === "verifier_report" ? (
                                  <li key={ `${notif._id}-${index}`} className="notinotification-item">
                                        <div>
                                            <strong>VERIFICATION REPORT BY VERIFIER</strong><br />
                                            <strong>verifier name:</strong> {notif.verifier_name} <br />
                                            <strong>verifier email:</strong> {notif.verifier_email} <br />
                                            <strong>Premise:</strong> {notif.premise} <br />
                                            <strong>Verify Date:</strong> {new Date(notif.verify_date).toLocaleDateString()} <br />
    
                                        </div>
                                        <div className="notibtn-group">
                                            <button className="notiaccept-btn" onClick={() => handleview(notif._id)}>📄 View Report</button>
                                        </div>
                                    </li>
                                ) : null
                          ))}
    
    
                      {notif.type === "hodstockaccept" && (
                        <div>
                          <strong>CSE HOD accepted the Stock</strong>
                          <br />
                          <strong>Indent No:</strong> {notif.indent_no} <br />
                          <strong>Sl No:</strong> {notif.sl_no} <br />
                          <button
                            className="notimark-btn"
                            onClick={() => handleMarkRead(notif._id)}
                          >
                            ✔️
                          </button>
                        </div>
                      )}
    
                      {notif.type === "hodstockforward" && (
                        <div>
                          <strong>HOD FORWARDING STOCK</strong>
                          <br />
                          <strong>Indent No:</strong> {notif.indent_no} <br />
                          <strong>Quantity:</strong> {notif.quantity} <br />
                          <strong>Message:</strong> {notif.message} <br />
                          <div className="notibtn-group">
                            <button
                              className="notiaccept-btn"
                              onClick={() =>
                                handleHodStockAction(notif._id, "accept")
                              }
                            >
                              ✅ Accept
                            </button>
                            <button
                              className="notidecline-btn"
                              onClick={() =>
                                handleHodStockAction(notif._id, "reject")
                              }
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      )}
                      {notif.type === "sicstockaccept" && (
                        <div>
                          <strong>STOCK ALLOCATED SUCCESSFULLY</strong>
                          <br />
                          <strong>Indent No:</strong> {notif.indent_no} <br />
                          <strong>Quantity:</strong> {notif.quantity} <br />
                          <strong>Receiver:</strong> {notif.receiver} <br />
                          <button
                            className="notimark-btn"
                            onClick={() => handleMarkRead(notif._id)}
                          >
                            ✔️
                          </button>
                        </div>
                      )}
                      {notif.type === "hodstockreject" && (
                        <div>
                          <strong>STOCK REJECTED BY HOD. FORWARD AGAIN</strong>
                          <br />
                          <strong>Indent No:</strong> {notif.indent_no} <br />
                          <strong>SL No:</strong> {notif.sl_no} <br />
                          <button
                            className="notimark-btn"
                            onClick={() => handleMarkRead(notif._id)}
                          >
                            ✔️
                          </button>
                        </div>
                      )}
                      {notif.type === "sicstockreject" && (
                        <div>
                          <strong>STOCK REJECTED BY SIC</strong>
                          <br />
                          <strong>Indent No:</strong> {notif.indent_no} <br />
                          <strong>Quantity:</strong> {notif.quantity} <br />
                          <strong>SIC:</strong> {notif.sender} <br />
                          <button
                            className="notimark-btn"
                            onClick={() => handleMarkRead(notif._id)}
                          >
                            ✔️
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    };
    
    export default Notifications;