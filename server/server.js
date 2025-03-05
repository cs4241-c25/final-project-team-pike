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
    EXPRESS_SESSION_SECRET,
    FRONTEND
} = process.env

// init express server
const server = express()
const corsOptions = {
    origin: FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
};
server.use(cors(corsOptions))
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

server.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }))
server.get("/auth/github/callback",
    passport.authenticate("github", { session: true, failureRedirect: "/login"}),
    function (req, res) {
        // check if user exists in database
        const userRecord = dbGet("SELECT * FROM Users WHERE github = ?", req.user.username)
        if (!userRecord) {
            res.redirect(FRONTEND+"/signup")
        }
        res.redirect(FRONTEND+"/chores")
    }
)

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({error: "user not authenticated. log in pls."})
    }
}

server.get("/login", (req, res) => {
    if (req.user) {
        res.redirect(FRONTEND+"/chores")
    } else {
        res.redirect(FRONTEND+"/")
    }
})

server.get("/logout", (req, res) => {
    req.logout(() => { })
    res.redirect(FRONTEND+"/")
})

// ------------------------ db helper functions ------------------------
// lookup a user's associated organization
async function orgLookup(username) {
    return await dbGet("SELECT orgID FROM Users WHERE github = ?", username)
}

// ------------------------ handle GET requests ------------------------

// TODO delete
server.get("/api/woah", ensureAuth, async (request, response) => {
    response.status(200).json({test: "hi this is the server stuff is working"})
});

// Return current user's info
server.get("/api/user", ensureAuth, async (request, response) => {
    const record = await dbGet("SELECT * FROM Users WHERE github = ?", request.user.username);
    if (!record) {
        response.status(404).json({error: "User does not exist", username: request.params.github})
        return
    }

    response.status(200).send({
        realName: record.realName,
        github: record.github,
        profilePic: record.profilePic,
    });
});

// return another user's profile info
server.get("/api/user/by-id/:github", ensureAuth, async (request, response) => {
    // retrieve real name and profile pic
    const record = await dbGet("SELECT realName, profilePic FROM Users WHERE github = ?", request.params.github);
    if (!record) {
        response.status(404).json({error: "User does not exist", username: request.params.github})
        return
    }
    response.status(200).send({
        realName: record.realName,
        profilePic: record.profilePic
    });
});

server.get("/api/org/:orgID/users", ensureAuth, async (request, response) => {
    const orgID = request.params.orgID
    const users = await dbAll("SELECT * FROM Users WHERE orgID = ?", orgID)
    if (!users) {
        response.status(404).json({error: 'No users found for organization',
            orgID: orgID})
        return
    }
    let isMember = false
    let out = []
    for (let i = 0; i < users.length; i++) {
        if (users[i].github === request.user.username) {
            isMember = true
        }
        out.push("{realName: " + users[i].realName + ", github: " + users[i].github + "}")
    }
    if (!isMember) {
        response.status(403).json({error: "Requesting user not a member of organization", orgID: orgID})
        return
    }

    response.status(200).json(out);
});

server.get("/api/org/tasks/", ensureAuth, async (request, response) => {
    const orgID = await orgLookup(request.user.username)
    const tasks = await dbAll("SELECT * FROM Tasks WHERE orgID = ?", orgID)
    if (!tasks) {
        response.status(404).json({error: "No tasks found for organization", orgID: orgID})
        return
    }
    response.status(200).json(tasks);
});

server.get("/api/org/tasktypes", ensureAuth, async (request, response) => {
    const orgID = await orgLookup(request.user.username)
    const types = await dbAll("SELECT * FROM TaskTypes WHERE orgID = ?", orgID)
    if (!types) {
        response.status(404).json({error: "No task types found for organization", orgID: orgID});
        return
    }
    response.status(200).json(types);
});

server.get("/api/user/tasks", ensureAuth, async (request, response) => {
    const myTasks = await dbAll("SELECT * FROM TaskInstances WHERE assigneeID = ?", request.user.username);
    if (!myTasks) {
        response.status(404).json({error: "No tasks found for user", username: request.user.username});
        return
    }
    response.status(200).json(myTasks);
});

server.get("/api/tasks/:taskID", ensureAuth, async (request, response) => {
   const orgID = await orgLookup(request.user.username);
   const task = await dbGet("SELECT * FROM Tasks WHERE id = ?", request.params.taskID, orgID);
    if (!task) {
        response.status(404).json({error: "Task not found", taskID: request.params.taskID});
        return
    }
    if (task.orgID !== orgID) {
        response.status(403).json({error: "Forbidden to view", taskID: request.params.taskID});
        return
    }
    response.status(200).json(task);
});

server.get("/api/tasks/:taskID/instances", ensureAuth, async (request, response) => {
    const taskID = request.params.taskID
})

// ------------------------ handle POST requests ------------------------ 

// create new user (called during first login)
server.post("/api/user/create",
    body("realName").isString().escape(),
    body("github").isString().escape(),
    async (request, response) => {
        const user = request.body
        const existing = await dbGet("SELECT * FROM Users WHERE github = ?", user.github)
        if (existing) {
            response.status(400).json({error: "User already exists"})
            return
        }
        try {
            await dbRun("INSERT INTO Users (realName, github) VALUES (?, ?)", user.realName, user.github)
        } catch (e) {
            response.status(500).json({error: e})
        }
        response.status(200).json({message: "user created"})
    }
);

server.post("/api/user/enroll",
    ensureAuth,
    body("orgID").isInt(),
    async (request, response) => {
        const orgID = request.body.orgID
        const userRecord = await dbGet("SELECT * FROM Users WHERE github = ?", request.user.username)
        if (!userRecord) {
            response.status(400).json({error: 'User does not exist'})
            return
        }
        if (userRecord.orgID){
            response.status(400).json({error: 'User already enrolled', orgID: " + userRecord.orgID + "})
            return
        }
        try {
            await dbRun("UPDATE Users SET orgID = ? WHERE github = ?", orgID, request.user.username)
        } catch (e) {
            response.status(500).json({error: " + e + "})
            return
        }
        response.status(200).json({message: 'user enrolled'})
    });

server.post("/api/org/create",
    ensureAuth,
    body("name").isString().escape(),
    body("description").isString().escape(),
    async (request, response) => {
        const org = request.body
        const existing = await dbGet("SELECT * FROM Organizations WHERE name = ?", org.name)
        if (existing) {
            response.status(400).json({ error: "Already exists", orgID: existing.id })
            return
        }
        try {
            await dbRun("INSERT INTO Organizations (name) VALUES (?)", org.name)
        } catch (e) {
            response.status(500).json({error: e})
            return
        }
        response.status(200).json({message: 'organization created'})
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
            response.status(400).json({ error: 'Organization identifier invalid'})
            return
        }
        // check that the task type is valid for this organization
        const typeRow = await dbGet("SELECT * FROM TaskTypes WHERE orgID = ? AND name = ?", orgID, task.type)
        if (!typeRow) {
            response.status(400).json({error: 'Invalid task type'})
            return
        }
        try {
            await dbRun("INSERT INTO Tasks (orgID, name, description, taskTypeID, schedule) VALUES (?, ?, ?, ?, ?)",
                orgID, task.title, task.description, typeRow.id, task.schedule)
        } catch (e) {
            response.status(500).json({error: e})
            return
        }
        // todo: if schedule is set, populate downstream instances
        response.status(200).json({message: 'task created'})
    });

server.post('/api/tasks/instance/assign',
    ensureAuth,
    body("assignee").isString().escape(),
    body("instanceID").isNumeric(),
    async (request, response) => {

        const instanceId = request.body.instanceID;
        const userRecord = await dbGet("SELECT * FROM Users WHERE github = ?", request.body.assignee);
        if (!userRecord) {
            response.status(400).json({error: 'User does not exist'})
            return
        }
        const orgID = await orgLookup(request.user.username);
        const instanceRecord = await dbGet("SELECT * FROM TaskInstances WHERE id = ?", instanceId);
        if (!instanceRecord) {
            response.status(400).json({error: 'Task Instance does not exist!'})
            return
        }
        const taskOrg = await dbGet("SELECT orgID FROM Tasks WHERE id=?", instanceRecord.taskID);
        if (userRecord.orgID !== orgID || taskOrg !== orgID){
            response.status(403).json({error: "Cross-org assignment not supported"})
        }
        let prevAssignee = null
        if (instanceRecord.assigneeID) {
            console.log("Warning: overwriting assignee for taskInstance "+ instanceId)
            prevAssignee = instanceRecord.assigneeID
        }
        await dbRun("UPDATE TaskInstances SET assigneeID = ? WHERE id = ?", request.body.assignee, instanceId)
        response.status(200).json({message: 'task assigned', assignee: request.body.assignee, prevAssignee: prevAssignee})
    })

server.post('/api/tasks/instance/complete',
    ensureAuth,
    body("instanceID").isNumeric(),
    async (request, response) => {
        const instanceRecord = await dbGet("SELECT * FROM TaskInstances WHERE id = ?", request.body.instanceID);
        if (!instanceRecord) {
            response.status(404).json({error: 'Task Instance does not exist'});
            return;
        }
        if (instanceRecord.assigneeID !== request.user.username) {
            response.status(403).json({error: 'Not your task'})
            return;
        }
        let status = 'completed'
        if ((new Date()) > (new Date(instanceRecord.dueDate))){
            status += ' (late)'
        }
        await dbRun("UPDATE TaskInstances SET status=? WHERE id=?", status, request.body.instanceID)
        response.status(200)
    })
// ------------------------ start server ------------------------ 
async function startServer() {
    server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`)
    });
}

startServer().then(() => {
}) // then to avoid unhandled promise rejection warning