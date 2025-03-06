PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Organizations
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    organizerID TEXT,
    inviteCode  TEXT,
    FOREIGN KEY (organizerID) REFERENCES Users (github)
);

CREATE TABLE IF NOT EXISTS Users
(
    github     TEXT PRIMARY KEY,
    realName   TEXT NOT NULL,
    orgID      INTEGER,
    FOREIGN KEY (orgID) REFERENCES Organizations (id)
);

CREATE TABLE IF NOT EXISTS TaskTypes
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    orgID       INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT,
    FOREIGN KEY (orgID) REFERENCES Organizations (id)
);

CREATE TABLE IF NOT EXISTS Tasks
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    orgID       INTEGER NOT NULL,
    taskTypeID  INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT,
    schedule    TEXT,
    FOREIGN KEY (orgID) REFERENCES Organizations (id),
    FOREIGN KEY (taskTypeID) REFERENCES TaskTypes (id)
);

CREATE TABLE IF NOT EXISTS TaskInstances
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    taskID         INTEGER NOT NULL,
    assigneeID     TEXT,
    status         TEXT    NOT NULL,
    dueDate        TEXT,
    completionDate TEXT,
    FOREIGN KEY (taskID) REFERENCES Tasks (id),
    FOREIGN KEY (assigneeID) REFERENCES Users (github)
);

CREATE TABLE IF NOT EXISTS Inventory
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    orgID       INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT,
    quantity    INTEGER NOT NULL,
    location    TEXT,
    notes       TEXT,
    FOREIGN KEY (orgID) REFERENCES Organizations (id)
);

CREATE TABLE IF NOT EXISTS Expenses
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    payerID TEXT,
    amountPayed REAL NOT NULL,
    payedOff INTEGER DEFAULT 0,
    FOREIGN KEY (payerID) REFERENCES Users (github)
);

