import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/Backend/database.js";
import loginauthRoutes from "./src/Backend/loginauth.js";
import registerRoutes from "./src/Backend/register.js";
import RoomRoutes from "./src/Backend/Room.js";
import StockdetailsRoutes from "./src/Backend/Stockdetails.js";
import StockstatusupdateRoutes from "./src/Backend/stockstatusupdate.js";
import addstocksicRoutes from "./src/Backend/addstocksic.js";
import RegistercomplaintRoutes from "./src/Backend/Registercomplaint.js";
import maintenanceRoutes from "./src/Backend/maintenance.js";
import ClearancestockRoutes from "./src/Backend/Clearancestock.js";
import AssignfacultyprincipalRoutes from "./src/Backend/Assignfacultyprincipal.js";
import notificationRoutes from "./src/Backend/notification.js";
import notificationcontrollerRoutes from "./src/Backend/notificationcontrollerarjun.js";
import AddaccountbynotiRoutes from "./src/Backend/Addaccountbynoti.js";
import profilebackRoutes from "./src/Backend/profileback.js";
import VerificationRoutes from "./src/Backend/Verification.js";
import reportfetchRoutes from "./src/Backend/reportfetch.js";
import requeststockdetailsRoutes from "./src/Backend/requeststockdetails.js";
import AssignedfacultyfetchRoutes from "./src/Backend/Assignedfacultyfetch.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/loginauth", loginauthRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/Room", RoomRoutes);
app.use("/api/stock", StockdetailsRoutes);
app.use("/api/ustock", StockstatusupdateRoutes); // ✅ Add new endpoint for stock status updates
app.use("/",addstocksicRoutes);
app.use("/api/complaints",RegistercomplaintRoutes);
app.use("/api/maintenance",maintenanceRoutes);
app.use("/api",ClearancestockRoutes);
app.use(AssignfacultyprincipalRoutes);
app.use(notificationRoutes);
app.use(notificationcontrollerRoutes);
app.use(AddaccountbynotiRoutes);
app.use("/api/profile",profilebackRoutes);
app.use("/api/stockverify",VerificationRoutes);
app.use("/api/report",reportfetchRoutes);
app.use("/api/request",requeststockdetailsRoutes);
app.use("/api/faculty",AssignedfacultyfetchRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));