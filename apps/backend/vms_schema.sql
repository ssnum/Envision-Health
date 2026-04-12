CREATE TABLE IF NOT EXISTS Events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location TEXT,
    required_volunteers INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS EventVolunteers (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    hours_logged REAL DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    FOREIGN KEY(event_id) REFERENCES Events(id),
    FOREIGN KEY(user_id) REFERENCES Users(id)
);
