# Real-Time Library management system

A Node.js application featuring REST APIs, real-time communication using Socket.IO, and MongoDB for data persistence. Users receive live notifications for new messages and books.

---

## Getting Started

Follow these steps to set up the project on your local machine.

### Installation

1. Clone the repository:
   `git clone https://github.com/amalmosai/library-management-system.git`

2. Install dependencies:
   `npm install`

3. Configure Environment Variables:
   Create a .env file based on the .env.example file and set the following:

    - MONGODB_URI=<your-mongodb-uri> # MongoDB connection string (local or Atlas)
    - JWT_SECRET=<your-jwt-secret> # Secret key for JWT
    - PORT=3000 # Optional: default is 3000
    - NODE_ENV=development # or "production" for live environment

4. Set Up MongoDB:
   Ensure MongoDB is running either locally or through MongoDB Atlas.

5. Seed the Database:
   `npm run seed`

6. Start the Server:
   `npm start`

7. Run tests
   `npm test`

## Testing Socket.io

1. Ensure your backend server with Socket.io is running locally on port 3000

2. Open `src/tests/socket/test-client.html` in your browser.

3. Simulate a User Connection with ID:

```js
'userId': '68544b21a385f53443c57c98' //Example user Id
```

4. Verify Connection

- Check your server logs for connection events
- The browser console will display connection status and received messages

from pathlib import Path

## API Endpoints

### Auth Routes

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login`    | Login and get token |

#### Register Example

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@library.com",
  "password": "Admin@123",
  "role": "admin"
}
```

#### Login Example

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@library.com",
  "password": "Admin@123",
}
```

### Book Routes

| Method | Endpoint           | Auth Required | Roles            | Description             |
| ------ | ------------------ | ------------- | ---------------- | ----------------------- |
| POST   | `/api/v1/book`     | Yes           | admin, librarian | Create a new book       |
| GET    | `/api/v1/book`     | Yes           | admin, librarian | Get all books           |
| GET    | `/api/v1/book/:id` | Yes           | admin, librarian | Get a single book by ID |
| PUT    | `/api/v1/book/:id` | Yes           | admin, librarian | Update book by ID       |
| DELETE | `/api/v1/book/:id` | Yes           | admin only       | Delete book by ID       |

#### Create Book Example

```http
POST /api/v1/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780432735946",
  "category": "fiction",
  "quantity": 5 ,
  "userId": "<userId>"
}

```

#### Note

- The userId is automatically populated from the authenticated user's JWT token req.user.id

### Message Routes

| Method | Endpoint                           | Auth Required | Roles            | Description                    |
| ------ | ---------------------------------- | ------------- | ---------------- | ------------------------------ |
| POST   | `/api/v1/messages`                 | Yes           | admin, librarian | Send a message (group/private) |
| GET    | `/api/v1/messages/private/:userId` | Yes           | admin, librarian | Get private messages           |
| GET    | `/api/v1/messages/group`           | Yes           | admin, librarian | Get group messages             |

#### Example Send Message

#### Request

```http

POST /api/v1/messages
Authorization: Bearer <your_token>
Content-Type: application/json

```

1. Group Message

```
{
  "type": "group",
  "text": "Hello team!",
  "groupId": "main_group",
  "senderId": <senderId>
}
```

2. Private Message

```
{
   "receiverId":<receiverId>
  "type": "private",
  "text": "Hello!",
  "senderId": <senderId>
}

```

#### Note

- The senderId is automatically populated from the authenticated user's JWT token req.user.id
