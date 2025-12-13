const express = require("express");
const router = express.Router();

// GET: show the search page
// (The actual search logic is handled via AJAX in api.js)
router.get("/", (req, res) => {
  res.render("search"); // simply load the search view
});

module.exports = router;
