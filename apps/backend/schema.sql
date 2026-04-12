CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS AuditLogs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    target_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Patients (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    encrypted_medical_history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    appointment_time DATETIME NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY(patient_id) REFERENCES Patients(id),
    FOREIGN KEY(doctor_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS VolunteerProfiles (
    user_id TEXT PRIMARY KEY,
    background_check_status TEXT,
    skills TEXT,
    onboarding_completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Shifts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    role_assigned TEXT,
    status TEXT,
    FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Inventory (
    id TEXT PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    expiration_date DATE
);

CREATE TABLE IF NOT EXISTS Donations (
    id TEXT PRIMARY KEY,
    donor_id TEXT NOT NULL,
    amount_or_item TEXT NOT NULL,
    tax_receipt_url TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(donor_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Grants (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    agency TEXT,
    deadline DATE,
    requirements_text TEXT,
    url TEXT
);
