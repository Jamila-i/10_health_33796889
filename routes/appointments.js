// appointments.js
// Routes for viewing, adding and managing appointments

const express = require("express");
const router = express.Router();

// GET: List all appointments
router.get("/", (req, res) => {
  const db = req.db;

  // Pull appointment details along with associated patient names
  const sql = `
        SELECT 
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.appointment_type,
            a.notes,
            p.name AS patient_name
        FROM appointments a
        INNER JOIN patients p ON a.patient_id = p.patient_id
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `;

  db.query(sql, (err, results) => {
    if (err) {
      req.flash("error", "Could not load appointments.");
      return res.render("appointments", { appointments: [] });
    }

    res.render("appointments", { appointments: results });
  });
});

// GET: Add appointment form
router.get("/add", (req, res) => {
  const db = req.db;

  // Get patient names for the dropdown list
  const sql = "SELECT patient_id, name FROM patients ORDER BY name ASC";

  db.query(sql, (err, results) => {
    if (err) {
      req.flash("error", "Could not load patient list.");
      return res.redirect("/appointments");
    }

    res.render("add_appointment", { patients: results });
  });
});

// POST: Add appointment
router.post("/add", (req, res) => {
  const db = req.db;

  // Clean up the notes text so users cannot inject unwanted content
  req.body.notes = req.sanitize(req.body.notes);

  const { patient_id, date, time, type, notes } = req.body;
  const errors = [];

  // Basic form validation
  if (!patient_id) errors.push("Please select a patient.");
  if (!date) errors.push("Appointment date is required.");
  if (!time) errors.push("Appointment time is required.");
  if (!type) errors.push("Appointment type is required.");

  // If validation fails, send messages and reload form
  if (errors.length > 0) {
    req.flash("error", errors);
    return res.redirect("/appointments/add");
  }

  // Insert appointment into database
  const sql = `
        INSERT INTO appointments 
        (patient_id, appointment_date, appointment_time, appointment_type, notes)
        VALUES (?, ?, ?, ?, ?)
    `;

  db.query(sql, [patient_id, date, time, type, notes || null], (err) => {
    if (err) {
      req.flash("error", "Could not add appointment.");
      return res.redirect("/appointments/add");
    }

    req.flash("success", "Appointment added successfully.");
    res.redirect("/appointments");
  });
});

module.exports = router;
