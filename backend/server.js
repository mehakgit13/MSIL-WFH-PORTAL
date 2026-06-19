import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import wfhRoutes from "./routes/wfhRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import teamWFHRoutes from "./routes/teamWFHRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Maruti Workforce API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/wfh", wfhRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/notices", noticeRoutes);
 app.use("/api/notifications", notificationRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/team-wfh", teamWFHRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});