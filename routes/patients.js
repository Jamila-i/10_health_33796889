const express = require("express");
const router = express.Router();

// GET: List all patients
router.get("/", (req, res) => {
  const db = req.db;

  // Fetch newest patients first for convenience
  const sql = "SELECT * FROM patients ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      req.flash("error", "Could not load patients.");
      return res.render("patients", { patients: [] });
    }

    res.render("patients", { patients: results });
  });
});

// GET: Add patient form
router.get("/add", (req, res) => {
  res.render("add_patient"); // simply show the form
});

// POST: Add patient
router.post("/add", (req, res) => {
  const db = req.db;

  // Clean inputs to avoid malicious characters
  req.body.name = req.sanitize(req.body.name);
  req.body.email = req.sanitize(req.body.email);
  req.body.phone = req.sanitize(req.body.phone);

  const { name, email, phone, dob } = req.body;
  const errors = [];

  // Basic validation for required fields
  if (!name || name.trim().length === 0) {
    errors.push("Name is required.");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required.");
  } else if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    errors.push("Invalid email format.");
  }

  if (!dob) {
    errors.push("Date of birth is required.");
  }

  // If validation fails, show all messages at once
  if (errors.length > 0) {
    req.flash("error", errors);
    return res.redirect("/patients/add");
  }

  // Check if the email is already used by another patient
  const checkSql = "SELECT * FROM patients WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      req.flash("error", "Database error.");
      return res.redirect("/patients/add");
    }

    if (results.length > 0) {
      req.flash("error", "Email already registered as a patient.");
      return res.redirect("/patients/add");
    }

    // Insert the new patient into the database
    const insertSql = `
            INSERT INTO patients (name, email, phone, dob)
            VALUES (?, ?, ?, ?)
        `;
    db.query(insertSql, [name, email, phone || null, dob], (err2) => {
      if (err2) {
        req.flash("error", "Could not add patient.");
        return res.redirect("/patients/add");
      }

      req.flash("success", "Patient added successfully.");
      return res.redirect("/patients");
    });
  });
});

module.exports = router;
