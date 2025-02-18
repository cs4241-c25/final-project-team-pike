const express = require("express")
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const GitHubStrategy = require("passport-github2").Strategy
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

// constants
const port = 3000

// init express server
const server = express()
server.use(cors())

// ------------------------ handle GET requests ------------------------ 
server.get("/api/example", (request, response) => {
    response.status(200).send("hi from server")
});

// ------------------------ handle POST requests ------------------------ 


// ------------------------ start server ------------------------ 
async function startServer() {
    server.listen(process.env.PORT || port, () => {
        console.log(`Server is running on port ${port}`)
    });
}
startServer()