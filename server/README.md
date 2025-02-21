# Final Project Server / Backend

## Database Schema

The MongoDB database is comprised of 3 collections: `users`, `organizations`, and `tasks`. The schema for each collection is as follows:

### Users
- id
- orgID
- real name
- github username (via OAuth)
- preferences (map of task type to numerical ranking)

### Organizations
- id
- name
- members (array of user ids)
- organizer (user id)
- task types (array of strings)
- tasks (array of task prototype objects)

#### Task Prototypes
- type
- name
- description
- schedule

### Tasks
- id
- type
- name
- description
- due date
- assignee


## API Endpoints

`/api/user/create` - POST
- Create a new user
- Must be authenticated via OAuth
- Request body: `{realName: string, github: string}`

`/api/user/enroll` - POST
- Enroll a user in an organization
- Must be authenticated via OAuth
- Request body: `{orgID: string}`

`/api/org/create` - POST
- Create a new organization
- Must be authenticated via OAuth
- Request body: `{name: string}`

`/api/org/{orgID}/users` - GET
- Get all users in an organization
- Must be authenticated via OAuth
- Returns: `{users: [user]}`

`/api/org/{orgID}/tasks/create` - POST
- Create a new task prototype
- Must be authenticated via OAuth
- Request body: `{type: string, name: string, description: string, schedule: string}`
- Can be used to overwrite an existing task prototype

`/api/org/{orgID}/tasks/{taskName}` - GET
- Get a task prototype details
- Must be authenticated via OAuth
- Returns: `{type: string, name: string, description: string, schedule: string}`

`/api/org/{orgID}/tasks` - GET
- Get all task prototypes in an organization
- Must be authenticated via OAuth
- Returns: `{tasks: [taskPrototype]}`

`/api/org/{orgID}/tasks/{taskName}` - DELETE
- Delete a task prototype
- Must be authenticated via OAuth
