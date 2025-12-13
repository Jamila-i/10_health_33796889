// auth.js
// Handles user registration, login and logout functionality
// (Sanitise middleware already active from index.js)

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Password pattern: ensures good security for all accounts
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// GET: show registration page
router.get("/register", (req, res) => {
  res.render("register");
});

// POST: handle registration form
router.post("/register", async (req, res) => {
  // Clean user input before using it anywhere
  req.body.username = req.sanitize(req.body.username);
  req.body.first_name = req.sanitize(req.body.first_name);
  req.body.last_name = req.sanitize(req.body.last_name);
  req.body.email = req.sanitize(req.body.email);

  const { username, first_name, last_name, email, password, confirm } =
    req.body;
  const errors = [];

  // Required field checks
  if (!username || username.trim() === "") errors.push("Username is required.");
  if (!first_name || first_name.trim() === "")
    errors.push("First name is required.");
  if (!last_name || last_name.trim() === "")
    errors.push("Last name is required.");
  if (!email || email.trim() === "") errors.push("Email is required.");

  // Basic email format check
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (email && !emailRegex.test(email)) errors.push("Invalid email format.");

  // Password rules based on coursework requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    errors.push(
      "Password must be 8+ chars, include upper, lower, number and special character."
    );
  }

  // Both passwords must match
  if (password !== confirm) errors.push("Passwords do not match.");

  // If errors exist, show them and reload page
  if (errors.length > 0) {
    req.flash("error", errors);
    return res.redirect("./register");
  }

  const db = req.db;

  // Check if username or email is already registered
  db.query(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    async (err, results) => {
      if (err) {
        req.flash("error", "Database error.");
        return res.redirect("./register");
      }

      if (results.length > 0) {
        req.flash("error", "Username or email already registered.");
        return res.redirect("./register");
      }

      // Hash the password before storing it
      const hashed = await bcrypt.hash(password, 10);

      const insertSql = `
      INSERT INTO users (username, first_name, last_name, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;

      // Insert the new account into the database
      db.query(
        insertSql,
        [username, first_name, last_name, email, hashed],
        (err2) => {
          if (err2) {
            req.flash("error", "Could not create account.");
            return res.redirect("./register");
          }

          req.flash("success", "Account created successfully.");
          res.redirect("./login");
        }
      );
    }
  );
});

// GET: show login page
router.get("/login", (req, res) => {
  res.render("login");
});

// POST: handle login
router.post("/login", (req, res) => {
  // Clean the username field
  req.body.username = req.sanitize(req.body.username);

  const { username, password } = req.body;
  const db = req.db;

  // Find the user by username
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0) {
        req.flash("error", "Invalid username or password.");
        return res.redirect("./login");
      }

      const user = results[0];

      // Compare entered password with stored hash
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        req.flash("error", "Invalid username or password.");
        return res.redirect("./login");
      }

      // Save minimal user info into the session
      req.session.user = {
        id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };

      req.flash("success", "Logged in successfully.");
      res.redirect("./");
    }
  );
});

// GET: logout and clear session
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("./login");
  });
});

module.exports = router;
