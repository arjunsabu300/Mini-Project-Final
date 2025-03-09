import React, { useState,useEffect } from "react";
import "./warranty.css";
import { FaSearch, FaUser, FaBars, FaBell, FaFilter } from "react-icons/fa";
import AccountMenu from "../assets/Usermenu";
import Button  from "@mui/material/Button";
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import UpdateIcon from '@mui/icons-material/Update';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Sidebars from "../assets/sidebar";


const Stockwarranty = () => {
  const [stocks, setStocks] = useState([
    { id: "#7876", invoice: "30/06/2024", indent: "01/07/2024", name: "CPU", description: "Intel i5 12th gen", Warrantystatus: "In Warranty", status: "Working" },
    { id: "#7877", invoice: "30/06/2024", indent: "01/07/2024", name: "CPU", description: "Intel i5 12th gen", Warrantystatus: "In Warranty", status: "Not Working" },
    { id: "#7878", invoice: "28/06/2024", indent: "30/06/2024", name: "Monitor", description: "Monitor DELL", Warrantystatus: "Out Of Warranty", status: "Not Working" },
    { id: "#7879", invoice: "28/06/2024", indent: "30/06/2024", name: "Monitor", description: "Monitor DELL", Warrantystatus: "In Warranty", status: "Working" },
    { id: "#7880", invoice: "28/06/2024", indent: "30/06/2024", name: "Monitor", description: "Monitor DELL", Warrantystatus: "In Warranty", status: "Working" },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [role,setRole]=useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFilterMenu = () => setFilterOpen(!filterOpen);

   useEffect(() => {
      const token = sessionStorage.getItem("token"); // Retrieve token from localStorage
      if (token) {
        try {
          const decoded = jwtDecode(token); // Decode token to get user info
          setRole(decoded.designation);
        } catch (error) {
          console.error("Invalid Token:", error);
        }
      }
    }, []);

  return (
    <div className="swstocks-container">
      {/* Sidebar */}
      <Sidebars sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} role={role} />

      {/* Main Content */}
      <div className="swmain-content">
        <header className="headerstockwarranty">
          <h2>Stock Warranty</h2>
          <div className="swsearch-bar">
            <FaSearch className="swsearch-icon" />
            <input type="text" placeholder="Search Item ID" />
            </div>
            <input className="swdatetype" type="date" />
            <button className="swfilter-btn" onClick={toggleFilterMenu}>
              <FaFilter /> Filter
            </button>
            
            <div className="swbuttons">
            <Button variant="contained">Export</Button>
            <Button variant="contained" className="swnew-item-btn">+ New Items</Button>
          </div>

          <div className="swheader-icons">
            <FaBell className="swnotification-icon" />
            <div className="swuser-menu">
              <AccountMenu/>
            </div>
          </div>
        </header>

        {/* Filter Dropdown */}
        {filterOpen && (
          <div className="swfilter-menu">
            <label>Status:
              <select>
                <option value="all">All</option>
                <option value="Working">Working</option>
                <option value="Not Working">Not Working</option>
              </select>
            </label>
            <label>Product:
              <select>
                <option value="all">All</option>
                <option value="CPU">CPU</option>
                <option value="Monitor">Monitor</option>
              </select>
            </label>
          </div>
        )}

        {/* Stock Table */}
        <table className="swstock-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Date of Invoice</th>
              <th>Date of Indent</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Warranty Status</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={index}>
                <td>{stock.id}</td>
                <td>{stock.invoice}</td>
                <td>{stock.indent}</td>
                <td>{stock.name}</td>
                <td>{stock.description}</td>
                <td>
                  <span className={`swwarranty-label ${stock.Warrantystatus === "In Warranty" ? "swin-warranty" : "swout-of-warranty"}`}>
                    {stock.Warrantystatus}
                  </span>
                </td>
                <td>
                  <span className={`swstatus-label ${stock.status === "Working" ? "swworking" : "swnot-working"}`}>
                    {stock.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stockwarranty;
