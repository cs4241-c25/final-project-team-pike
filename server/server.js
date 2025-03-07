const express = require("express")
const cors = require("cors")
const passport = require("passport")
const dotenv = require("dotenv").config()
const session = require("express-session")
const GitHubStrategy = require("passport-github2").Strategy
const {query, body, validationResult} = require('express-validator');
const sqlite3 = require('sqlite3')
const {promisify} = require('util');
const {response, request} = require("express");
const settleDebts = require("./money");

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
    return (await dbGet("SELECT orgID FROM Users WHERE github = ?", username)).orgID
}

// ------------------------ handle GET requests ------------------------

// Return current user's info
server.get("/api/user", ensureAuth, async (request, response) => {
    const record = await dbGet("SELECT * FROM Users WHERE github = ?", request.user.username);
    if (!record) {
        response.status(401).json({error: "User does not exist", username: request.params.github})
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
        response.status(401).json({error: "User does not exist", username: request.params.github})
        return
    }
    response.status(200).json({
        record
    });
});

server.get("/api/org/users",
    ensureAuth,
    async (req, res) => {
        const myOrg = await orgLookup(req.user.username)
        if (!myOrg){
            res.status(401).json({error: "user not associated with an org!"})
            return
        }
        const dat = await dbAll("SELECT github, realName FROM Users WHERE orgID = ?", myOrg);
        const userList = []
        dat.forEach(row => {
            userList.push(row.realName) 
        })
        res.status(200).json({users: userList})
    })

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

        const sanitizationRes = validationResult(request);
        if (!sanitizationRes.isEmpty()) {
            console.log("invite code validator fail: " + sanitizationRes.array())
            response.status(400).json({error: sanitizationRes.array()[0]})
            return
        }
        const invite = request.query.code
        const infos = await dbGet("SELECT name FROM Organizations WHERE inviteCode = ?", invite)
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


server.get("/api/user/tasks", ensureAuth, async (request, response) => {
    const myTasks = await dbAll("SELECT * FROM Tasks WHERE assigneeID = ?", request.user.username);
    if (!myTasks) {
        response.status(404).json({error: "No tasks found for user", username: request.user.username});
        return
    }
    response.status(200).json(myTasks);
});

server.get("/api/tasks/by-category/:category",
    ensureAuth,
    async(req,res)=> {
        const cat = req.params.category
        const orgID = await orgLookup(req.user.username)
        const tasks = await dbAll("SELECT * FROM Tasks WHERE orgID=? AND taskType=?",orgID,cat)
        res.status(200).json(tasks)
    })

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
        const validationRes = validationResult(request);
        if (!validationRes.isEmpty()){
            response.status(400).json({error: validationRes.mapped()})
        }
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
            await dbRun("UPDATE Users SET orgID = ? WHERE github = ?", orgID.id, request.user.username)
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
        const orgID = await dbGet("SELECT id FROM Organizations WHERE inviteCode = ?",code);
        await dbRun("UPDATE Users SET orgID = ? WHERE github = ?", orgID.id, organizer);
        response.status(200).json({message: 'organization created', inviteCode: code})
    }
);

server.post("/api/tasks/create",
    ensureAuth,
    body('title').isString().escape(),
    body('type').isString().escape(),
    body('schedule').optional().isString(),
    body("assignee").isString(),
    async (request, response) => {
        const validationErrs = validationResult(request);
        if (!validationErrs.isEmpty()){
            response.status(400).json(validationErrs.mapped());
            return;
        }
        const assigneeID = await dbGet("SELECT github FROM Users WHERE realName = ?", request.body.assignee);
        if (!assigneeID){
            response.status(400).json({error: "Assignee not found!"})
            return
        }
        const orgID = await orgLookup(request.user.username);
        try {
            await dbRun("INSERT INTO Tasks (taskType, name, orgID, dueDate, assigneeID, status) VALUES (?,?,?,?,?,?)",
                request.body.type, request.body.title, orgID, request.body.schedule, assigneeID.github, "Pending");
        }
        catch (e){
            console.log("Couldn't create task!: "+e)
            response.status(500).json({error: e})
            return
        }
        response.status(200).json({status: 'ok'})

    }
);

server.post('/api/tasks/delete',
    ensureAuth,
    body("taskID").isNumeric(),
    async (request, response) => {
        const orgID = await orgLookup(request.user.username)
        const existing = await dbGet("SELECT * FROM Tasks WHERE id=? AND orgID=?",request.body.taskID,orgID)
        if (!existing){
            response.status(400).json({error: "cannot delete, not found"})
        }
        await dbRun("DELETE FROM Tasks WHERE id=?",request.body.taskID);
        response.status(200).json({message:"deleted"})
    })

server.post('/api/tasks/complete',
    ensureAuth,
    body("taskID").isNumeric(),
    async (request, response) => {
        const taskRecord = await dbGet("SELECT dueDate, orgID from Tasks WHERE id = ?", request.body.taskID);
        if (!taskRecord) {
            response.status(400).json({error: "task does not exist"})
            return
        }
        if (await orgLookup(request.user.username) !== taskRecord.orgID){
            response.status(403).json({error: "not your org!"})
        }
        let status = "Done"
        if (new Date(taskRecord.dueDate) < new Date()) {
            status = "Done (Late)"
        }
        await dbRun("UPDATE Tasks SET status = ? WHERE id = ?", status, request.body.taskID)
        response.status(200).json({status: status});
    }

)

server.post("/api/tasks/instance/cancel",
    ensureAuth,
    body("taskID").isNumeric(),
    async (request, response) => {
        const record = await dbGet("SELECT orgID FROM Tasks WHERE id = ?",request.body.taskID)
        if (!record) {
            response.status(404).json({error: "no matching task instance!"})
            return
        }
        if (record.orgID !== await orgLookup(request.user.username)) {
            response.status(403).json({error: "Not authorized, not your org!"})
            return
        }
        await dbRun("UPDATE Tasks SET status = ? WHERE id=?", "cancelled", request.body.taskID);
        response.status(200).json({status: "ok"})

    }
)

server.post("/api/payments/add",
    ensureAuth,
    body('payerName').isString(),
    body("amountPaid").isFloat(),
    body('description').isString(),
    async (request, response) => {
        const issues = validationResult(request)
        if (!issues.isEmpty()){
            console.log(issues.array()[0].msg)
            response.status(400).json({error: issues.array()[0].msg})
            return
        }
        try {
            const org = await orgLookup(request.user.username)
            const payer = await dbGet("SELECT github FROM Users WHERE orgID=? AND realName=?",org,request.body.payerName)
            await dbRun("INSERT INTO Expenses (description, payerID, amountPaid)  VALUES (?,?,?)", request.body.description, payer.github, request.body.amountPaid)
        }
        catch (e){
            response.status(500).json({error: e})
            console.log("Cannot add payment: "+e)
            return
        }
        response.status(200).json({status: "OK"})
    }
)

server.delete("/api/payments/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const paymentEntry = await dbGet("SELECT * FROM Expenses WHERE id = ?", id);
        if (!paymentEntry) {
            return res.status(404).json({ error: "Item not found" });
        }

        await dbRun("DELETE FROM Expenses WHERE id = ?", id);
        console.log("Deleted item ID:", id);

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item", details: error.message });
    }
});

server.get("/api/payments", ensureAuth, async(request, response) => {
    const org = await orgLookup(request.user.username)
    const data = await dbAll("SELECT id,description,payerID,realName,amountPaid,paidOff FROM Expenses E JOIN Users U ON U.github = E.payerID WHERE U.orgID = ?",org)
    response.status(200).json(data)
})

server.post("/api/payments/complete",
    ensureAuth,
    body("paymentIDs").isArray(),
    async (request, response) => {
        const valid = validationResult(request);
        if (!valid.isEmpty()){
            response.status(400).json({errors: valid.array()})
            console.log("Failed to complete payment(s)")
            return
        }
        const paymentIdArr = request.body.paymentIDs
        for (let i=0; i < paymentIdArr.length; i++){
            await dbRun("UPDATE Expenses SET paidOff = 1 WHERE id = ?", paymentIdArr[i])
        }
        response.status(200).json({status: "OK"})
})

server.get("/api/payments/resolve",
    ensureAuth,
    async (request, response) => {
        const myOrg = await orgLookup(request.user.username)
        const userData = await dbAll("SELECT github, realName FROM Users WHERE orgID = ?",myOrg);
        const paymentData = await dbAll("SELECT E.payerID, E.amountPaid FROM Expenses E JOIN Users U ON E.payerID = U.github WHERE U.orgID = ? AND E.paidOff = 0", myOrg)
        if (!userData || !paymentData){
            console.log("DB returned bad vals! exit.")
            response.status(500).json({error: "failed"});
            return
        }
        // prepare data for algs
        let userList = []
        let payOut = []
        userData.forEach(row=>{
            userList.push(row.github)
        })
        paymentData.forEach(row=>{
            const tmp = {
                spender: row.payerID,
                 value: row.amountPaid
            }
            payOut.push(tmp)
        })
        let nameMap = new Map();
        userData.forEach(row =>{
            nameMap.set(row.github, row.realName)
        })
        const resolutions = settleDebts(userList, payOut);
        for (let i=0; i<resolutions.length; i++){
            resolutions[i].from = nameMap.get(resolutions[i].from)
            resolutions[i].to = nameMap.get(resolutions[i].to)
        }
        response.status(200).json(resolutions)
    })


// ✅ Fetch all groceries
server.get("/api/groceries", ensureAuth, async (req, res) => {
    try {
        const org = await orgLookup(req.user.username)
        const groceries = await dbAll("SELECT * FROM Inventory WHERE orgID = ?", org);

        res.status(200).json(groceries);
    } catch (error) {
        console.error("Error fetching groceries:", error);
        res.status(500).json({ error: "Failed to fetch inventory", details: error.message });
    }
});

// ✅ Add a new grocery item
server.post("/api/groceries", ensureAuth, async (req, res) => {
    const { name, quantity } = req.body;

    if (!name || quantity === undefined) {
        return res.status(400).json({ error: "Name and quantity are required" });
    }

    try {
        const org = await orgLookup(req.user.username)
        await dbRun("INSERT INTO Inventory (name, quantity, orgID) VALUES (?, ?, ?)", name, quantity, org);
        const newItem = await dbGet("SELECT * FROM Inventory ORDER BY id DESC LIMIT 1");

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ error: "Failed to add item", details: error.message });
    }
});

// ✅ Delete a grocery item
server.delete("/api/groceries/:id", ensureAuth, async (req, res) => {
    const itemId = req.params.id;

    try {
        const item = await dbGet("SELECT * FROM Inventory WHERE id = ?", itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        await dbRun("DELETE FROM Inventory WHERE id = ?", itemId);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item", details: error.message });
    }
});

// ------------------------ start server ------------------------
async function startServer() {
    server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`)
    });
}

startServer().then(() => {
}) // then to avoid unhandled promise rejection warning