const express = require("express")
const cors = require("cors")
const passport = require("passport")
const dotenv = require("dotenv").config()
const session = require("express-session")
const GitHubStrategy = require("passport-github2").Strategy
const {query, body, validationResult} = require('express-validator');
const sqlite3 = require('sqlite3')
const {promisify} = require('util');
const {response} = require("express");

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
    passport.authenticate("github", {session: true, failureRedirect: "/login"}),
    async function (req, res) {
        // check if user exists in database
        const userRecord = await dbGet("SELECT * FROM Users WHERE github = ?", req.user.username)
        if (!userRecord) {
            res.redirect(FRONTEND + "/profile-setup")
            return
        }
        res.redirect(FRONTEND + "/home")
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
        res.redirect(FRONTEND + "/chores")
    } else {
        res.redirect(FRONTEND + "/")
    }
})

server.get("/logout", (req, res) => {
    req.logout(() => {
    })
    res.redirect(FRONTEND + "/")
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
    });
});

// return another user's profile info
server.get("/api/user/by-id/:github", ensureAuth, async (request, response) => {
    // retrieve real name and profile pic
    const record = await dbGet("SELECT realName FROM Users WHERE github = ?", request.params.github);
    if (!record) {
        response.status(404).json({error: "User does not exist", username: request.params.github})
        return
    }
    response.status(200).json({
        record
    });
});

server.get("/api/org/:orgID/users", ensureAuth, async (request, response) => {
    const orgID = request.params.orgID
    const users = await dbAll("SELECT * FROM Users WHERE orgID = ?", orgID)
    if (!users) {
        response.status(404).json({
            error: 'No users found for organization',
            orgID: orgID
        })
        return
    }
    const myRec = await dbGet("SELECT github FROM Users WHERE github = ? AND orgID = ?",request.user.username, orgID)
    if (!myRec) {
        response.status(403).json({error: "Requesting user not a member of organization", orgID: orgID})
        return
    }

    response.status(200).json(users);
});

server.get('/api/org/inviteCode',
    ensureAuth,
    async (request, response) => {
        const dat = await dbGet("SELECT inviteCode FROM Organizations O JOIN Users U ON U.orgID = O.id WHERE U.github = ?", request.user.username)
        if (!dat) {
            response.status(404).json({error: "Organization not found"})
            return
        }
        response.status(200).json({invite: dat.inviteCode})
    })

server.get('/api/org/inviteInfo',
    ensureAuth,
    query("code").escape().isAlphanumeric().isLength(6),
    async (request, response) => {

        sanitizationRes = validationResult(request);
        if (!sanitizationRes.isEmpty()) {
            console.log("invite code validator fail: " + sanitizationRes.array())
            response.status(400).json({error: sanitizationRes.array()[0]})
            return
        }
        invite = request.query.code
        infos = await dbGet("SELECT name, description FROM Organizations WHERE inviteCode = ?", invite)
        if (!infos) {
            response.status(404).json({error: "Invalid invite code"})
            return
        }
        response.status(200).json(infos)
    }
)

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
    ensureAuth,
    body("name").isString(),
    async (request, response) => {
        const res = validationResult(request);
        if (!res.isEmpty()) {
            console.log("didnt like username because "+res.array()[0].msg)
            response.status(400).json({error: res.array()[0].msg})
            return
        }
        const name = request.body.name
        const github = request.user.username
        const existing = await dbGet("SELECT * FROM Users WHERE github = ?", github)
        if (existing) {
            response.status(400).json({error: "User already exists"})
            return
        }
        try {
            await dbRun("INSERT INTO Users (realName, github) VALUES (?, ?)", name, github)
        } catch (e) {
            response.status(500).json({error: e})
            console.log("account create failed: " + e)
            return
        }
        response.status(200).json({message: "user created"})
    }
);

server.post("/api/user/enroll",
    ensureAuth,
    body("inviteCode").isAlphanumeric().isLength(6),
    async (request, response) => {
        const userRecord = await dbGet("SELECT * FROM Users WHERE github = ?", request.user.username)
        if (!userRecord) {
            response.status(400).json({error: 'User does not exist!!'})
            return
        }
        if (userRecord.orgID) {
            response.status(400).json({error: 'User already enrolled', orgID: " + userRecord.orgID + "})
            return
        }
        const orgID = await dbGet("SELECT id FROM Organizations WHERE inviteCode = ?", request.body.inviteCode)
        if (!orgID) {
            response.status(400).json({error: "Invalid invite code"})
            return
        }
        try {
            await dbRun("UPDATE Users SET orgID = ? WHERE github = ?", orgID, request.user.username)
        } catch (e) {
            response.status(500).json({error: e})
            return
        }
        response.status(200).json({message: 'user enrolled'})
    });

server.post("/api/org/create",
    ensureAuth,
    body("name").isString().escape(),
    async (request, response) => {
        const orgName = request.body.name
        const organizer = request.user.username
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const existing = await dbGet("SELECT * FROM Organizations WHERE name = ?", orgName)
        if (existing) {
            response.status(400).json({error: "Already exists", orgID: existing.id})
            return
        }
        try {
            await dbRun("INSERT INTO Organizations (name, organizerID, inviteCode) VALUES (?,?,?)", orgName, organizer, code)
        } catch (e) {
            response.status(500).json({error: e})
            return
        }
        response.status(200).json({message: 'organization created', inviteCode: code})
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
            response.status(400).json({error: 'Organization identifier invalid'})
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
        // todo: immediate instance create
        response.status(200).json({message: 'task created'})
    }
);

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
        if (userRecord.orgID !== orgID || taskOrg !== orgID) {
            response.status(403).json({error: "Cross-org assignment not supported"})
        }
        let prevAssignee = null
        if (instanceRecord.assigneeID) {
            console.log("Warning: overwriting assignee for taskInstance " + instanceId)
            prevAssignee = instanceRecord.assigneeID
        }
        await dbRun("UPDATE TaskInstances SET assigneeID = ? WHERE id = ?", request.body.assignee, instanceId)
        response.status(200).json({
            message: 'task assigned',
            assignee: request.body.assignee,
            prevAssignee: prevAssignee
        })
    }
)

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
        if ((new Date()) > (new Date(instanceRecord.dueDate))) {
            status += ' (late)'
        }
        await dbRun("UPDATE TaskInstances SET status=? WHERE id=?", status, request.body.instanceID)
        response.status(200)
    }
)

server.post("/api/tasks/instance/cancel",
    ensureAuth,
    body("instanceID").isNumeric(),
    async (request, response) => {
        const record = await dbGet("SELECT * FROM TaskInstances I INNER JOIN Tasks T on I.taskID = T.id WHERE I.id = ?")
        if (!record) {
            response.status(404).json({error: "no matching task instance!"})
            return
        }
        if (record.orgID !== orgLookup(request.user.username)) {
            response.status(403).json({error: "Not authorized, not your org!"})
            return
        }
        await dbRun("UPDATE TaskInstances SET status = ? WHERE id=?", "cancelled", request.body.instanceID);
        response.status(200).json({status: "ok"})

    }
)
// ✅ Fetch all groceries
server.get("/api/groceries", async (req, res) => {
    try {
        console.log("GET /api/groceries called");

        const groceries = await dbAll("SELECT * FROM Inventory");
        console.log("Fetched groceries:", groceries);

        res.status(200).json(groceries);
    } catch (error) {
        console.error("Error fetching groceries:", error);
        res.status(500).json({ error: "Failed to fetch inventory", details: error.message });
    }
});

// ✅ Add a new grocery item
server.post("/api/groceries", async (req, res) => {
    const { name, quantity } = req.body;

    console.log("Received POST request:", req.body);

    if (!name || quantity === undefined) {
        return res.status(400).json({ error: "Name and quantity are required" });
    }

    try {
        await dbRun("INSERT INTO Inventory (name, quantity) VALUES (?, ?)", name, quantity);

        const newItem = await dbGet("SELECT * FROM Inventory ORDER BY id DESC LIMIT 1");
        console.log("New item added:", newItem);

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Failed to add item", details: error.message });
    }
});

// ✅ Delete a grocery item
server.delete("/api/groceries/:id", async (req, res) => {
    const itemId = req.params.id;

    try {
        const item = await dbGet("SELECT * FROM Inventory WHERE id = ?", itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        await dbRun("DELETE FROM Inventory WHERE id = ?", itemId);
        console.log("Deleted item ID:", itemId);

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item", details: error.message });
    }
});


server.post("/api/payments/add",
    ensureAuth,
    body('payer').isString(),
    body("amountPaid").isFloat(),
    body('description').isString(),
    async (request, response) => {
        const issues = validationResult(request)
        if (!issues.isEmpty()){
            console.log(issues.mapped())
            response.status(400).json({error: "bad request parameters"})
            return
        }
        // TODO: finish this function!

    })



// ------------------------ start server ------------------------
async function startServer() {
    server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`)
    });
}

startServer().then(() => {
}) // then to avoid unhandled promise rejection warning