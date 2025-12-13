USE health;

-- Required for marking
INSERT INTO users (username, first_name, last_name, email, password)
VALUES (
    'gold',
    'Gold',
    'User',
    'gold@example.com',
    '$2b$10$Of5yMeUxRH3rAsb1dbl4KeWraAEai9yWfGQyHXzBOCc2bHIQ9aN1q'
);


-- Sample patients
INSERT INTO patients (name, email, phone, dob) VALUES
('John Doe', 'john@example.com', '07123456789', '1985-04-10'),
('Sarah Smith', 'sarah@example.com', '07987654321', '1990-09-15');

-- Appointments
INSERT INTO appointments (patient_id, appointment_date, appointment_time, appointment_type, notes) VALUES
(1,'2025-01-20','10:00:00','checkup','Routine checkup'),
(2,'2025-01-22','14:30:00','consultation','Discuss ongoing symptoms');
