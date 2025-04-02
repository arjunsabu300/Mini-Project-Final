import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import VerifyNotification from "./Verifynotificationschema.js";

dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

router.post("/approvereport", async (req, res) => {
  try {
 

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("🔑 User:", decoded.email);

    const { notifId } = req.body;
    if (!notifId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    // ✅ Update only the `approval` field in notification
    const updatedNotification = await VerifyNotification.findByIdAndUpdate(
      notifId,
      { $set: { approval: "Approved" } }, // ✅ Set approval field
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    console.log("✅ Notification Approval Updated:", updatedNotification);

    res.json({
      message: "Approval successfully updated",
      updatedNotification,
    });
  } catch (error) {
    console.error("❌ Error approving reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fetch Approval Status Route
router.get("/getNotification/:notifId", async (req, res) => {
  try {
    const { notifId } = req.params;

    const notification = await VerifyNotification.findById(notifId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ approval: notification.approval || "Pending" }); // ✅ Default to "Pending"
  } catch (error) {
    console.error("❌ Error fetching notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
