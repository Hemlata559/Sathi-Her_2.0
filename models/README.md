 Phone OTP Authentication Backend

Backend service for phone number authentication using OTP.
Built using Node.js, Express, MongoDB, and Mongoose.

This backend supports login/registration via phone number and OTP verification.
Features

Send OTP to phone number

Verify OTP

Auto-register new users

Login existing users

MongoDB Atlas database storage

REST API architecture

Ready to connect with Android/Web frontend
Tech Stack

Node.js

Express.js

MongoDB Atlas

Mongoose

Postman (for testing)
Project Structure-
verification-backend/
│
├── models/
│   └── User.js
│
├── routes/
│   └── auth.js
│
├── server.js
├── package.json
└── README.md
⚙️ Installation

Clone repository:
git clone <repo-url>
cd verification-backend
Install dependencies:
npm install
▶️ Run Server
node server.js
Server runs on:
http://localhost:5000
🔐 Authentication Flow
1️⃣ Send OTP
POST
/api/auth/send-otp
BODY:
{
  "phone": "9876543210"
}
OTP is generated and logged in server console.
2️⃣ Verify OTP
POST
/api/auth/verify-otp
Body:
{
  "phone": "9876543210",
  "otp": "123456"
}
Response:
{
  "message": "Phone verified",
  "user": {...}
}
🗄 Database

Users collection stores:
{
  "_id": "...",
  "phone": "9876543210"
}
Database is hosted on MongoDB Atlas.
🔄 Login Logic
Enter Phone
      ↓
Send OTP
      ↓
Verify OTP
      ↓
User created or logged in
      ↓
Proceed to profile/home screen
📞 API Base URL
http://localhost:5000/api/auth

