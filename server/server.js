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

// ------------------------ handle POST requests ------------------------ 


server.post("/api/tasks/create",
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
        const type = await dbGet("SELECT * FROM TaskTypes WHERE orgID = ? AND name = ?", orgID, task.type)



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