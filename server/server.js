const express = require("express")
const cors = require("cors")
const passport = require("passport")
const dotenv = require("dotenv").config()
const session = require("express-session")
const GitHubStrategy = require("passport-github2").Strategy
const {query, body, validationResult} = require('express-validator');
const sqlite3 = require('sqlite3')
const { promisify } = require('util');
// constants
const port = 3000
const db = new sqlite3.Database('db.sqlite')
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);
const dbRun = promisify(db.run).bind(db);
const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    EXPRESS_SESSION_SECRET
} = process.env

// init express server
const server = express()
server.use(cors())
server.use(express.json())

server.use(session({
    secret: EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
server.use(passport.initialize())
server.use(passport.session())
server.use(express.json())

// login, auth, and logout
passport.serializeUser(function (user, done) {
    done(null, {username: user.username, id: user.id})
})

passport.deserializeUser(function (obj, done) {
    done(null, obj)
})

passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
    },
    async function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile)
        })
    }
))

server.get("/auth/github", passport.authenticate("github", {scope: ["user:email"]}))
server.get("/auth/github/callback",
    passport.authenticate("github", {session: true, failureRedirect: "" /* TODO */}),
    function (req, res) {
        // TODO redirect to next page (success)
    }
)

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        // TODO redirect to login
    }
}

server.get("/login", (req, res) => {
    if (req.user) {
        // TODO redirect to next page (success)
    } else {
        // TODO redirect to login
    }
})

server.get("/logout", (req, res) => {
    req.logout(() => {
    })
    // TODO redirect to login
})

// ------------------------ db helper functions ------------------------
// lookup a user's associated organization
async function orgLookup(username) {
    return await dbGet("SELECT orgID FROM Users WHERE github = ?", username)
}

// ------------------------ handle GET requests ------------------------ 
server.get("/api/test", (request, response) => {
    response.status(200).send("hi from server")
});

// Return current user's info
server.get("/api/user", ensureAuth, async (request, response) => {
    const record = await dbGet("SELECT * FROM Users WHERE github = ?", request.user.username);
    if (!record) {
        response.status(404).send("User does not exist!")
    }
    const prefs = await dbAll("SELECT * FROM Preferences WHERE userID = ?", record.id);
    let prefArr = []
    for (let i = 0; i < prefs.length; i++) {
        prefArr.push("{type: " + prefs[i].PrefKey + ", rank: " + prefs[i].PrefValue + "}")
    }
    response.status(200).send({
        realName: record.realName,
        github: record.github,
        profilePic: record.profilePic,
        preferences: prefArr
    });
});

server.get("/api/user/:github", ensureAuth, async (request, response) => {
    // retrieve real name and profile pic
    const record = await dbGet("SELECT (realName, profilePic) FROM Users WHERE github = ?", request.params.github);
    if (!record) {
        response.status(404).send("User does not exist!")
    }
    response.status(200).send({
        realName: record.realName,
        profilePic: record.profilePic
    });
});

// ------------------------ handle POST requests ------------------------ 


server.post("/api/user/create",
    body("realName").isString().escape(),
    body("github").isString().escape(),
    async (request, response) => {
        const user = request.body
        const existing = await dbGet("SELECT * FROM Users WHERE github = ?", user.github)
        if (existing) {
            response.status(400).send("User already exists")
        }
        try {
            await dbRun("INSERT INTO Users (realName, github) VALUES (?, ?)", user.realName, user.github)
        } catch (e) {
            response.status(500).send("Error creating user: " + e)
        }
        response.status(200).send("user created")
    }
);

server.post("/api/tasks/create",
    ensureAuth,
    body('title').isString().escape(),
    body('description').isString().escape(),
    body('type').isString().escape(),
    body('schedule').optional().isString(),
    async (request, response) => {
        const task = request.body
        const orgID = await orgLookup(request.user.username)
        if (!orgID) {
            response.status(400).send("Organization identifier invalid")
        }
        // check that the task type is valid for this organization
        const typeRow = await dbGet("SELECT * FROM TaskTypes WHERE orgID = ? AND name = ?", orgID, task.type)
        if (!typeRow) {
            response.status(400).send("Invalid task type")
        }
        try {
            await dbRun("INSERT INTO Tasks (orgID, name, description, taskTypeID, schedule) VALUES (?, ?, ?, ?, ?)",
                orgID, task.title, task.description, typeRow.id, task.schedule)
        } catch (e) {
            response.status(500).send("Error creating task: " + e)
        }
        response.status(200).send("task created")
    });


// ------------------------ start server ------------------------ 
async function startServer() {
    server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`)
    });
}

startServer().then(() => {
}) // then to avoid unhandled promise rejection warning