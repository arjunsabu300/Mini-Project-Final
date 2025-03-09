import React, { useState } from 'react';
import './PrincipalDash.css';
import { FaUserCircle, FaSignOutAlt, FaChartBar, FaCheckCircle, FaListAlt, FaBars } from 'react-icons/fa';
import AccountMenu from '../../../../ARJUN/react-app/src/assets/Usermenu';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import UpdateIcon from '@mui/icons-material/Update';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { jwtDecode } from "jwt-decode";


const notifications = [
    { message: 'New report from Verifier' },
    { message: 'New message from HOD' },
];

const TskDash = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [username,setusername]= useState("");
    const [currentdate,setdate]=useState("");
    
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
        },[]);

    return (
        <div className="app-container">
            <Header username={username} currentdate={currentdate}/>
            <div className="main-area">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Dashboard />
            </div>
        </div>
    );
};

const Header = ({username,currentdate}) => (
    <header className="header">
        <div className="header-left">
            <span>Welcome, {username}</span>
            <span>{currentdate}</span>
        </div>
        <div className="header-right">
           <span>Premise Name</span>
            <AccountMenu />
        </div>
    </header>
);

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <aside className={`clsidebar ${sidebarOpen ? "open" : "closed"}`}>
            <FaBars className="clmenu-icon" onClick={toggleSidebar} />
            {sidebarOpen && (
                <ul>
                    <li><Link to="/Hoddash"><HomeIcon fontSize="medium" /> Dashboard</Link></li>
                    <li><Link to="/stockdetails"><InventoryIcon fontSize="medium" />Main Stock</Link></li>
                   
                </ul>
            )}
        </aside>
    );
};

const Dashboard = () => (
    <main className="dashboard">
        <div className="dashboard-header">
            <h1>Dashboard</h1>
            <Notifications notifications={notifications} />
        </div>
        <div className="actions">
            <Button className='action-button' variant="contained">Forward Stock</Button>
        </div>
        <LogoutButton />
    </main>
);

const Notifications = ({ notifications }) => (
    <div className="notifications">
        <div className="notification-header">
            <h2>Notifications</h2>
        </div>
        <ul>
            {notifications.map((n, i) => (
                <li key={i}>{n.message}</li>
            ))}
        </ul>
        <a href="#">View All</a>
    </div>
);

const LogoutButton = () => (
    <button className="logout-button">
        <FaSignOutAlt className="logout-icon" />
        Logout
    </button>
);

export default TskDash;
