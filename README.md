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
   `npm run test`

## Testing Socket.io

1. Ensure your backend server with Socket.io is running locally on port 3000

2. Open `src/tests/socket/test-client.html` in your browser.

3. Simulate a User Connection

simulates a user with the ID:

```js
'userId': '68544b21a385f53443c57c98' //Example user Id
```

4. Verify Connection

- Check your server logs for connection events
- The browser console will display connection status and received messages

## API Endpoints

- `/api/v1/auth`: Authentication routes
- `/api/v1/book`: Book management routes
- `/api/v1/message`: Message routes

```

```
