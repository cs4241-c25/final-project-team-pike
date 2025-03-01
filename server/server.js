const express = require("express")
const cors = require("cors")
const passport = require("passport")
const dotenv = require("dotenv").config()
const session = require("express-session")
const GitHubStrategy = require("passport-github2").Strategy
const { query, body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3')

// constants
const port = 3000
const db = new sqlite3.Database('db.sqlite')

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
    done(null, { username: user.username, id: user.id })
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

server.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }))
server.get("/auth/github/callback", 
    passport.authenticate("github", { session: true, failureRedirect: "/login"}),
    function (req, res) {
        res.status(200).json({loginStatus: "success"})
        // TODO redirect to the dashboard page (success code 200)
        // TODO redirect to the create profile page (success code 201)
    }
)

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        // TODO redirect to login
        res.redirect("/login")
    }
}

server.get("/login", (req, res) => {
    if (req.user) {
        // TODO send login success code
        res.status(200).json({loginStatus: "success"})
    } else {
        // TODO send login error code
        res.status(401).json({loginStatus: "failure"})
    }
})

server.get("/logout", (req, res) => {
    req.logout(() => { })
    // TODO redirect to login
    res.redirect("/login")
})

// ------------------------ handle GET requests ------------------------ 
server.get("/api/test", (request, response) => {
    response.status(200).send("hi from server")
});

// ------------------------ handle POST requests ------------------------ 

server.post("/api/tasks/create",
    body('title').isString(),
    body('description').isString(),
    body('type').isString(),
    body('schedule').optional().isString(),
    body('endDate').optional().isString(),
    async (request, response) => {
    const task = request.body
    // sanity check fields of request exist
    if (!task.title || !task.description || !task.type) {
        response.status(400).send("missing fields")
    }


    response.status(200).send("task created")
});


// ------------------------ start server ------------------------ 
async function startServer() {
    server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`)
    });
}
startServer().then(() => {}) // then to avoid unhandled promise rejection warning