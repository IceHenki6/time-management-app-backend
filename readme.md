# Time Management App - API

### Technologies used
- NodeJs
- Express
- MongoDb
- Mongoose

### Other Libraries
- bcrypt
- cookie-parser
- dotenv
- jsonwebtoken
- cors
- nodemon

### Main Features
- Authentication using JWT tokens
- CRUD operations for tasks
- Creation of study sessions
***
## Endpoints
### Get all tasks
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: Get all the tasks of the current authenticated user

### 1. Get a specific task
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks/taskid
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: Get a specific task of the current authenticated user


### 2. Create a new task
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks
- **METHOD**: POST
- **Auth Required**: yes
- **Description**: create a new task
#### Request
**Body**:
```json
{
    "name": "task name",
}
```


### 3. Delete a task
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks/taskid
- **METHOD**: DELETE
- **Auth Required**: yes
- **Description**: Delete a task of the current authenticated user


### 4. Update a task
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks/taskid
- **METHOD**: PUT
- **Auth Required**: yes
- **Description**: update a task of the current authenticated user
#### Request
**Body**:
```json
{
    "name": "newname",
    "completed": true,
    "totalTime": 50
}
```


### 5. Get study sessions of a task
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks/taskid/sessions
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: Get a the study sessions of a task of the current authenticated user


### 6. Get total study time of a task
> Gets the user id from the current authenticated user session
- **URL**: /api/tasks/taskid/totalTime
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: Get the total study time of a task of the current authenticated user


### 7. Create a new session
> Gets the user id from the current authenticated user session
- **URL**: /api/sessions
- **METHOD**: POST
- **Auth Required**: yes
- **Description**: create a new study session for the current authenticated user
#### Request
**Body**:
```json
{
    "duration": 25,
}
```


### 8. Register a new user
- **URL**: /api/register
- **METHOD**: POST
- **Auth Required**: no
- **Description**: create a new user
#### Request
**Body**:
```json
{
    "email": "email@email.com",
    "username": "newuser",
    "password": "averysafepasswordwithmorethaneightchars123"
}
```

### 9. Get current user
> Gets the user id from the current authenticated user session
- **URL**: /api/users
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: Gets the current authenticated user

### 10. Update Username
> Gets the user id from the current authenticated user session
- **URL**: /api/users/updateUsername
- **METHOD**: PATCH
- **Auth Required**: yes
- **Description**: Updates the username of the current authenticated user
#### Request
**Body**:
```json
{
    "username": "newusername"
}
```

### 11. Update Password
> Gets the user id from the current authenticated user session
- **URL**: /api/users/updatePassword
- **METHOD**: PATCH
- **Auth Required**: yes
- **Description**: Updates the password of the current authenticated user
#### Request
**Body**:
```json
{
    "password": "newpassword"
}
```

### 12. Get user sessions
> Gets the user id from the current authenticated user session
- **URL**: /api/users/sessions
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: Gets all the sessions of the current authenticated user


### 13. Log In
- **URL**: /api/login
- **METHOD**: POST
- **Auth Required**: no
- **Description**: Logs the user in
#### Request
**Body**:
```json
{
    "email": "email@email.com",
    "password": "supersafemorethan8charspassword12345youcanthackme"
}
```

### 14. Log Out
> Gets the user id from the current authenticated user session
- **URL**: /api/logout
- **METHOD**: GET
- **Auth Required**: yes
- **Description**: log out the user


