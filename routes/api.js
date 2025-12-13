// api.js
// Handles the AJAX search used on the Search Records page

const express = require("express");
const router = express.Router();

// AJAX SEARCH: looks up patient name or appointment type
router.get("/search", (req, res) => {
  const db = req.db;
  const query = req.query.query || ""; // text entered by the user

  // Query joins appointments with patients and searches both fields
  const sql = `
        SELECT 
            a.appointment_id,
            a.appointment_date,
            a.appointment_time,
            a.appointment_type,
            p.name AS patient_name
        FROM appointments a
        INNER JOIN patients p ON a.patient_id = p.patient_id
        WHERE p.name LIKE ? 
        OR a.appointment_type LIKE ?
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
        LIMIT 10
    `;

  const wildcard = `%${query}%`; // add wildcards for partial matching

  // Run the query and return search results to the frontend
  db.query(sql, [wildcard, wildcard], (err, results) => {
    if (err) {
      return res.json([]); // fail silently if db error occurs
    }
    res.json(results); // send results back as JSON
  });
});

module.exports = router; // export router so index.js can use it
