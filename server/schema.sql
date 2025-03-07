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
    github   TEXT PRIMARY KEY,
    realName TEXT NOT NULL,
    orgID    INTEGER,
    FOREIGN KEY (orgID) REFERENCES Organizations (id)
);

CREATE TABLE IF NOT EXISTS Tasks
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    taskType    TEXT,
    name        TEXT    NOT NULL,
    orgID       INTEGER NOT NULL,
    description TEXT,
    assigneeID  TEXT,
    status      TEXT    NOT NULL,
    dueDate     TEXT,
    FOREIGN KEY (orgID) REFERENCES Organizations (id),
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
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    payerID     TEXT,
    amountPaid  REAL NOT NULL,
    paidOff     INTEGER DEFAULT 0,
    FOREIGN KEY (payerID) REFERENCES Users (github)
);