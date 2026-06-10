CREATE TABLE IF NOT EXISTS Events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location TEXT,
    required_volunteers INTEGER DEFAULT 1,
<<<<<<< HEAD
=======
    end_date DATETIME,
    category TEXT DEFAULT 'General',
    is_recurring INTEGER DEFAULT 0,
    recurrence_pattern TEXT,
>>>>>>> origin/master
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS EventVolunteers (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    hours_logged REAL DEFAULT 0,
    status TEXT DEFAULT 'Pending',
<<<<<<< HEAD
    FOREIGN KEY(event_id) REFERENCES Events(id),
    FOREIGN KEY(user_id) REFERENCES Users(id)
=======
    time_slot_id TEXT,
    signup_type TEXT DEFAULT 'Full Day',
    FOREIGN KEY(event_id) REFERENCES Events(id),
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(time_slot_id) REFERENCES EventTimeSlots(id)
>>>>>>> origin/master
);
