import express from "express";
import TskNotification from "./tskforwardnotification.js";
import MainStock from "./mainstockmodel.js";
import AssignfacultyNotification from "./Assignfacultyschema.js";
import VerifyNotification from "./Verifynotificationschema.js";


const router = express.Router();

// ✅ Log Receiver Email API
router.get("/api/log-receiver", (req, res) => {
    const { receiver } = req.query;
    if (!receiver) {
        return res.status(400).json({ error: "Receiver email is required" });
    }
    console.log("📩 Receiver Email:", receiver);
    res.json({ message: "Receiver email logged successfully", receiver });
});

// ✅ Fetch & Process Notifications API
router.get("/api/fetch-notifications", async (req, res) => {
    const { receiver } = req.query;
    if (!receiver) {
        return res.status(400).json({ error: "Receiver email is required" });
    }

    try {
        // 🔍 Fetch unread TskForwardNotifications
        // const tskNotifications = await TskNotification.find({ receiver, status: "unread" });
        
        // // 🔍 Fetch unread HodAcceptNotifications
        // const hodNotifications = await HodAcceptNotification.find({ receiver, status: "unread" });

        const assignnotification= await AssignfacultyNotification.find({receiver: receiver,status: "unread"});

        const verifysnotification= await VerifyNotification.find({receiver: receiver,status: "unread"});




        // 🔄 Process TskForwardNotifications
        // const detailedTskNotifications = await Promise.all(
        //     tskNotifications.map(async (notification) => {
        //         if (notification.type === "tskstockforward") {
        //             const { indent_no, sl_no } = notification;
        //             const stock = await MainStock.findOne({ indent_no, sl_no });
        //             return {
        //                 _id: notification._id,
        //                 type: notification.type,
        //                 indent_no,
        //                 sl_no,
        //                 quantity: stock ? stock.quantity : "Not Found",
        //                 status: notification.status,
        //                 createdAt: notification.date,
        //             };
        //         }
        //         return {
        //             _id: notification._id,
        //             type: notification.type,
        //             status: notification.status,
        //             createdAt: notification.date,
        //         };
        //     })
        // );

        // // 🔄 Process HodAcceptNotifications
        // const detailedHodNotifications = hodNotifications.map((notification) => ({
        //     _id: notification._id,
        //     type: notification.type,  // ✅ "hodstockaccept"
        //     indent_no: notification.indent_no,
        //     sl_no: notification.sl_no,
        //     status: notification.status,
        //     createdAt: notification.date,
        // }));

        const assignNotifications = await Promise.all(
            assignnotification.map(async (asnotification) => {
                if (asnotification.type === "principalfacultyassign") {
                    // 🔍 Fetch indent_no & sl_no
                    const { facultyname, facultyemail,premise,last_date } = asnotification;


                    return {
                        _id: asnotification._id,
                        type: asnotification.type, // ✅ Send Type
                        facultyname,
                        facultyemail,
                        premise,
                        last_date,
                        status: asnotification.status,
                        createdAt: asnotification.date
                    };
                }

                // Return other notifications as they are where type is not stock forward
                return {
                    _id: asnotification._id,
                    type: asnotification.type, // ✅ Send Type
                    status: asnotification.status,
                    createdAt: asnotification.date,
                };
            })
        );

        const verifyNotifications = await Promise.all(
            verifysnotification.map(async (vnotification) => {
                if (vnotification.type === "verifier_report") {
                    // 🔍 Fetch indent_no & sl_no
                    const { verifier_name, verifier_email,premise,verify_date } = vnotification;


                    return {
                        _id: vnotification._id,
                        type: vnotification.type, // ✅ Send Type
                        verifier_name,
                        verifier_email,
                        premise,
                        verify_date,
                        status: vnotification.status,
                        createdAt: vnotification.date
                    };
                }

                // Return other notifications as they are where type is not stock forward
                return {
                    _id: vnotification._id,
                    type: vnotification.type, // ✅ Send Type
                    status: vnotification.status,
                    createdAt: vnotification.date,
                };
            })
        );


        // ✅ Merge both notifications
        const allNotifications = [/*...detailedTskNotifications, ...detailedHodNotifications,*/ ...assignNotifications, ...verifyNotifications];

        // ✅ Send processed notifications to frontend
        res.json({ data: allNotifications });
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/api/fetchreport", async (req, res) => {
    const { receiver } = req.query;
    if (!receiver) {
        return res.status(400).json({ error: "Receiver email is required" });
    }

    try {

        const verifysnotification= await VerifyNotification.find({receiver: receiver,status: "read"});


        const verifyNotifications = await Promise.all(
            verifysnotification.map(async (vnotification) => {
                if (vnotification.type === "verifier_report") {
                    // 🔍 Fetch indent_no & sl_no
                    const { verifier_name, verifier_email,premise,verify_date } = vnotification;


                    return {
                        _id: vnotification._id,
                        type: vnotification.type, // ✅ Send Type
                        verifier_name,
                        verifier_email,
                        premise,
                        verify_date,
                        status: vnotification.status,
                        createdAt: vnotification.date
                    };
                }

                // Return other notifications as they are where type is not stock forward
                return {
                    _id: vnotification._id,
                    type: vnotification.type, // ✅ Send Type
                    status: vnotification.status,
                    createdAt: vnotification.date,
                };
            })
        );


        // ✅ Merge both notifications
        const allNotifications = [/*...detailedTskNotifications, ...detailedHodNotifications,*/ ...verifyNotifications];

        // ✅ Send processed notifications to frontend
        res.json({ data: allNotifications });
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;