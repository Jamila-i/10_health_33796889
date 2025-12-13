const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();

// Parse incoming form data and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sanitise input to prevent script injection
const expressSanitizer = require("express-sanitizer");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressSanitizer());

// Configure user sessions
app.use(
  session({
    secret: "clinicconnect-secret-key", // simple app secret for session signing
    resave: false,
    saveUninitialized: false,
  })
);

// Flash messages (used for success/error notifications)
app.use(flash());

// Serve static assets in /public
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.HEALTH_HOST,
  user: process.env.HEALTH_USER,
  password: process.env.HEALTH_PASSWORD,
  database: process.env.HEALTH_DATABASE,
});

// Make db accessible on every request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Make flash messages and session user available to all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user;
  next();
});

// Simple login guard for protected pages
function ensureLoggedIn(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("./login");
  }
  next();
}

// Route imports
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const searchRoutes = require("./routes/search");
const apiRoutes = require("./routes/api");

// Public pages
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// Auth routes (login/register)
app.use("/", authRoutes);

// Protected routes (require login)
app.use("/patients", ensureLoggedIn, patientRoutes);
app.use("/appointments", ensureLoggedIn, appointmentRoutes);
app.use("/search", ensureLoggedIn, searchRoutes);
app.use("/api", ensureLoggedIn, apiRoutes);

// 404 fallback page
app.use((req, res) => {
  res.status(404).render("error_404");
});

// 500 internal error page
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error_500");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`ClinicConnect running at http://localhost:${PORT}`);
});
