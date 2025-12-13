# ClinicConnect – Clinical Management Web Application

ClinicConnect is a full-stack Node.js and MySQL web application designed to simplify small-clinic operations. The system allows staff to register patients, schedule appointments, and perform real-time AJAX search across records, all inside a modern, responsive medical-themed interface.

---

## Features

### 1. User Authentication

- Secure registration and login using bcrypt hashing
- Session-based authentication with protected routes
- Flash messages for form validation and feedback
- Protected routes ensure only authenticated users can access patient, appointment, and search pages

### 2. Patient Management

- Register new patients with full validation (name, email format, DOB, duplicates)
- View all patient records in a responsive table
- Automatic timestamp for registration

### 3. Appointment Scheduling

- Create appointments linked to registered patients
- Includes date, time, type, and notes
- Sorted chronologically for readability
- Form validation and sanitisation for safer input handling

### 4. Live AJAX Search

- Real-time search for appointments by:
  - Patient name
  - Appointment type
- Results appear instantly without page reload
- Card-style results for clarity and fast scanning

### 5. Fully Styled Frontend

ClinicConnect includes:

- Hero section
- Feature cards
- Styled tables with hover animations
- Modern forms
- Responsive layout
- Custom navbar and footer

---

## Advanced Features

- Modularised Express routes

- MySQL connection pooling for efficient performance

- Server-side sanitisation against injection attacks

- AJAX/JSON API responses for dynamic UI updates

- Reusable EJS components for maintainable front-end

---

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Backend        | Node.js, Express.js     |
| Database       | MySQL                   |
| Authentication | bcrypt, express-session |
| Views          | EJS templates           |
| Frontend       | CSS, FontAwesome        |
| Security       | express-sanitizer       |

---

## Project Structure

```
10_HEALTH_33796889
│
├── node_modules/
│
├── public/
│   └── css/
│       └── style.css        # Full UI theme and layout
│
├── routes/
│   ├── api.js               # AJAX search endpoint
│   ├── appointments.js      # Appointment routes (list/add)
│   ├── auth.js              # Login/Register logic
│   ├── patients.js          # Patient routes (list/add)
│   └── search.js            # Search page loader
│
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── about.ejs
│   ├── add_appointment.ejs
│   ├── add_patient.ejs
│   ├── appointments.ejs
│   ├── error_404.ejs
│   ├── error_500.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── patients.ejs
│   ├── register.ejs
│   └── search.ejs
│
├── .env
├── .gitignore
│
├── create_db.sql            # Schema
├── insert_test_data.sql     # Sample data
│
├── index.js                 # Core server + middleware + routing
│
├── package.json
├── package-lock.json
│
├── README.md
└── report.pdf
```

## How to run it

1. Install dependencies

```
npm install
```

2. Start MySQL and create the database

```
mysql -u root -p
source create_db.sql;
source insert_test_data.sql;
```

3. Run the server

```
node index.js
```

Then visit:

```
http://localhost:8000
```
