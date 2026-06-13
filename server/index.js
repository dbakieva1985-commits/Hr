require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes       = require("./routes/auth");
const servicesRoutes   = require("./routes/services");
const requestsRoutes   = require("./routes/requests");
const analyticsRoutes  = require("./routes/analytics");

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",      authRoutes);
app.use("/api/services",  servicesRoutes);
app.use("/api/requests",  requestsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`HR Portal API running on port ${PORT}`));
