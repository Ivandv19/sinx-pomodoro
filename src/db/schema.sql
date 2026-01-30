-- Referencia para tu Base de Datos D1

CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    provider_id TEXT, -- Para GitHub/Google ID
    hashed_password TEXT,
    created_at INTEGER
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expires_at INTEGER,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS pomodoro_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'focus', 'short', 'long'
    minutes INTEGER NOT NULL,
    created_at INTEGER, -- Timestamp
    FOREIGN KEY (user_id) REFERENCES user(id)
);
