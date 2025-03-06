# Final Project Server / Backend

## Database Schema

The database for this project is a SQLite database (`db.sqlite`). The schema is as follows: 

### Users (table)
- github (text, primary key) (from github oAuth)
- realName (text)
- orgID (int, foreign key)
- profilePic (text)

### Organizations (table)
- id (int, primary key)
- name (text)
- organizerID (text, foreign key)

### TaskTypes (table)
- id (int, primary key)
- name (text)
- orgID (int, foreign key)

### Tasks (table)
- id (int, primary key)
- typeID (int, foreign key)
- name (text)
- orgID (int, foreign key)
- description (text)
- schedule (text)

### TaskInstances (table)
- id (int, primary key)
- taskID (int, foreign key)
- assigneeID (text, foreign key)
- dueDate (text)
- status (text)
- completedDate (text)

### Inventory (table)
- id (int, primary key)
- orgID (int, foreign key)
- itemName (text)
- quantity (int)
- purchaseDate (text)
- expirationDate (text)
- location (text)
- notes (text)

Note: Schedule formatting is a string of the form `RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20201231T235959Z` (RFC 5545)

## API Endpoints
All endpoints require a valid user session cookie unless otherwise noted.

`/api/user` - GET ✅ 
- Get the current user's information
- Returns: `{realName: string, github: string, profilePic: string}`

`/api/user/by-id/{id}` - GET ✅
- Get a different user's information by ID
- Returns: `{realName: string, profilePic: string}`

`/api/pictures/user/{id}` - POST & GET
- Update, set, or get the user's profile picture
- File upload
- Returns: Ok if successful

`/api/pictures/org/{id}` - POST & GET
- Update, set, or get the user's profile picture
- File upload
- Returns: Ok if successful

`/api/user/create` - POST ✅
- Does NOT have to be authenticated
- Create a new user
- Request body: `{realName: string, github: string}`

`/api/user/enroll` - POST ✅
- Enroll a user in an organization
- Request body: `{orgID: string}`

`/api/user/tasks` - GET ✅
- Get all tasks instances assigned to the current user
- Returns: `[taskInstance]`

`/api/org/create` - POST ✅
- Create a new organization
- Request body: `{name: string, description: string}`

`/api/org/{orgID}/users` - GET ✅
- Get all users in an organization
- Returns: `{users: [user]}`

`/api/org/tasks` - GET ✅
- Get all tasks in an organization
- Returns: `{tasks: [task]}`

`/api/org/tasktypes` - GET ✅
- Get all task types in an organization
- Returns: `{taskTypes: [taskType]}`


`/api/tasks/create` - POST ✅
- Create a new task
- orgID derived from user auth cookie
- Request body: `{type: string, name: string, description: string, schedule: string (optional)}`

`/api/tasks/{taskID}` - GET ✅
- Get a task by ID
- Returns: `{type: string, name: string, description: string, schedule: string}`

`/api/tasks/{taskID}/instances` - GET
- Get all instances of a task
- Returns: `[taskInstance]`

`/api/tasks/instance/complete` - POST ✅
- Mark a task as completed
- requesting user must be the assignee or the organizer

`/api/tasks/instance/cancel` - POST

`/api/tasks/instance/create` - POST ✅
- manually create instance (most should be auto-generated from schedule)
- Returns: `{taskID: string}` if ok

`/api/tasks/instance/assign` - POST ✅
- Assign a task to a user
- Request body: `{assigneeID: string}` (empty string to unassign)

`/api/tasks/instance/dueDate` - POST
- Change the due date of a task instance
- Request body: `{dueDate: string}`

`/api/tasks/instance/{taskInstanceID}` - GET
- Get a task instance by ID
- Returns: `{assignee: user, dueDate: string, status: string, taskID: string}`

