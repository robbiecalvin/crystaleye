CREATE TABLE IF NOT EXISTS appointments (
 id TEXT PRIMARY KEY,
 starts_at TEXT NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 method TEXT NOT NULL CHECK(method IN ('video','phone')),
 phone TEXT,
 status TEXT NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','confirmed','cancelled')),
 created_at TEXT NOT NULL,
 consent_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS appointment_active_slot ON appointments(starts_at) WHERE status IN ('requested','confirmed');
CREATE INDEX IF NOT EXISTS appointment_email_created ON appointments(email,created_at);
