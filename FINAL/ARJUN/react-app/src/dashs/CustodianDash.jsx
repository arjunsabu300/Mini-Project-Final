import React, { useState,useEffect } from 'react';
import './PrincipalDash.css';
import { FaUserCircle, FaSignOutAlt, FaChartBar, FaCheckCircle, FaListAlt, FaBars } from 'react-icons/fa';
import AccountMenu from '../assets/Usermenu';
import Button from '@mui/material/Button';
import Sidebardash from '../assets/Sidebarfordash';
import {jwtDecode} from "jwt-decode";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const handleLogout = (navigate) => {
    sessionStorage.removeItem("token"); // Remove the token from storage
    navigate("/", {replace: true}); // Redirect to login page
    window.location.reload(); // Ensure the page reloads completely
    window.history.pushState(null,null,"/");
  };

const CustodianDash = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [username,setusername]= useState("");
    const [currentdate,setdate]=useState("");
    const [premisename,setPremisename]= useState("");
    const [role,setRole]=useState(null);
    const [notifications, setNotifications] = useState([]);
    const navigate= useNavigate();

    useEffect(() => {
                const fetchNotifications = async () => {
                    try {
                        const token = sessionStorage.getItem("token");
                        if (!token) return;
        
                        const decoded = jwtDecode(token);
                        setusername(decoded.name);
                        const userEmail = decoded.email;
        
                        const response = await axios.get(`http://localhost:5000/api/notifications?receiver=${userEmail}`);
                        
                        console.log("Dashboard Notifications:", response.data); // Debugging
        
                        setNotifications(response.data);
                    } catch (error) {
                        console.error("Error fetching notifications:", error);
                    }
                };
        
                fetchNotifications();
            }, []);

    useEffect(()=>{
        const today = new Date().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
        setdate(today);
        const token = sessionStorage.getItem("token");
        if(token){
            try{
                const decoded = jwtDecode(token);
                setusername(decoded.name);
            }catch(error){
                console.error("Error decoding token : ",error);
            }
        }
        
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode token to get user info
                setRole(decoded.designation);
                setPremisename(decoded.roomname);
                } catch (error) {
                    console.error("Invalid Token:", error);
                }
            }
    },[]);

    return (
        <div className="app-container">
            <Header username={username} currentdate={currentdate} premisename={premisename}/>
            <div className="main-area">
                <Sidebardash sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role={role} />
                <Dashboard notifications={notifications} navigate={navigate} />
            </div>
        </div>
    );
};

const Header = ({username,currentdate,premisename}) => (
    <header className="header">
        <div className="header-left">
            <span>Welcome, {username}</span>
            <span>{currentdate}</span>
        </div>
        <div className="header-right">
           <span>{premisename}</span>
            <AccountMenu />
        </div>
    </header>
);


const Dashboard = ({notifications,navigate}) => (
    <main className="dashboard">
        <div className="dashboard-header">
            <h1>Dashboard</h1>
            <Notifications notifications={notifications} />
        </div>
        <div className="actions">
                <Link to="/maintenance"><Button className='action-button' variant="contained">Maintenance List</Button></Link>
                <Link to="/maintenancehist"><Button className='action-button' variant="contained">Maintenance History</Button></Link>
                <Button onClick={()=>{handlesendmail()}} className='action-button' variant="contained">Send Email</Button>
                <Button className='action-button' variant="contained">Transfer Log Details</Button>
                <Button className='action-button' variant="contained">Stock Handover</Button>
        </div>
        <LogoutButton navigate={navigate} />
    </main>
);

const Notifications = ({ notifications }) => (
    <div className="notifications">
        <div className="notification-header">
            <h2>Notifications</h2>
        </div>
        <ul>
        {notifications.length > 0 ? (
                notifications.map((n, i) => (
                    <li key={i}>{n.message || "New notification received"}</li>
                ))
            ) : (
                <li>No new notifications</li>
            )}
        </ul>
        <Link to="/notify">View All</Link>
    </div>
);

const LogoutButton = ({navigate}) => (
    <button className="logout-button">
        <FaSignOutAlt className="logout-icon" onClick={()=>{handleLogout(navigate)}}/>
        Logout
    </button>
);

export default CustodianDash;
