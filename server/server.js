const express = require("express")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const GitHubStrategy = require("passport-github2").Strategy
const { query, body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3')
// constants
const port = 3000
const db = new sqlite3.Database('db.sqlite')

// init express server
const server = express()
server.use(cors())
server.use(express.json())

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