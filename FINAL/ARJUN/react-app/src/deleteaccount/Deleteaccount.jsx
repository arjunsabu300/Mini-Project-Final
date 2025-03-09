import React, { useState } from "react";
import "./deleteacc.css";
import loginimage from "../assets/loginimg.png";

function Deleteacc() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Email:", email);
  };

  return (
    <div className="deleteacc-page">
      <div className="deleteacc-container">
        <div className="dc-form-container">
          <div className="dc-header">
            <div className="box">
                
            </div>
            <h1>Remove Account</h1>
          </div>
          <form onSubmit={handleSubmit} className="dc-form">
            <div className="dc-input">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="delete-button">
              <button type="submit">Delete Account</button>
            </div>
            
          </form>
        </div>
        <div className="dc-image-container">
          <img
            src= {loginimage}
            alt="Illustration"
            className="dc-image"
          />
        </div>
      </div>
    </div>
  );
}

export default Deleteacc;
