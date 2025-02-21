# Final Project Server / Backend

## Database Schema

The MongoDB database is comprised of 3 collections: `users`, `organizations`, and `tasks`. The schema for each collection is as follows:

### Users
- id
- orgID
- real name
- github username (via OAuth)
- Profile Picture (URL)
- preferences (map of task type to numerical ranking)

### Organizations
- id
- name
- members (array of user ids)
- organizer (user id)
- task types (array of strings)
- tasks (array of Task ids)

### Tasks
- id
- type
- name
- description
- schedule
- orgID
- instances (array of TaskInstance ids)

### TaskInstances
- id
- taskID
- assignee (user id)
- due date
- status (enum: `unassigned`, `assigned`, `completed`, `cancelled`)


## API Endpoints
All endpoints require a valid user session cookie unless otherwise noted.

`/api/user` - GET
- Get the current user's information
- Returns: `{realName: string, github: string, profilePic: string, preferences: {taskType: number}}`

`/api/user/{id}` - GET
- Get a different user's information by ID
- Returns: `{realName: string, profilePic: string}`

`/api/user/create` - POST
- Create a new user
- Request body: `{realName: string, github: string}`

`/api/user/enroll` - POST
- Enroll a user in an organization
- Request body: `{orgID: string}`

`/api/user/tasks` - GET
- Get all tasks instances assigned to the current user
- Returns: `[taskInstance]`

`/api/org/create` - POST
- Create a new organization
- Request body: `{name: string}`

`/api/org/{orgID}/users` - GET
- Get all users in an organization
- Returns: `{users: [user]}`

`/api/org/{orgID}/tasks` - GET
- Get all tasks in an organization
- Returns: `{tasks: [task]}`

`/api/tasks/create` - POST
- Create a new task
- orgID derived from user auth cookie
- Request body: `{type: string, name: string, description: string, schedule: string (optional), endDate: string (optional)}`

`/api/tasks/{taskID}` - GET
- Get a task by ID
- Returns: `{type: string, name: string, description: string, schedule: string, endDate: string}`

`/api/tasks/{taskID}/instances` - GET
- Get all instances of a task
- Returns: `[taskInstance]`

`/api/tasks/instance/{taskInstanceID}/complete` - POST
- Mark a task as completed
- requesting user must be the assignee or the organizer

`/api/tasks/instance/{taskInstanceID}/cancel` - POST

`/api/tasks/instance/create` - POST
- manually create instance (most should be auto-generated from schedule)
- Returns: `{taskID: string}` if ok

`/api/tasks/instance/{taskInstanceID}/assign` - POST
- Assign a task to a user
- Request body: `{assigneeID: string}` (empty string to unassign)

`/api/tasks/instance/{taskInstanceID}/dueDate` - POST
- Change the due date of a task instance
- Request body: `{dueDate: string}`

`/api/tasks/instance/{taskInstanceID}` - GET
- Get a task instance by ID
- Returns: `{assignee: user, dueDate: string, status: string, taskID: string}`

