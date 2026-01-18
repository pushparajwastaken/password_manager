# 🔐 Password Manager

A secure, backend-focused **Password Manager** built with modern web technologies and strong security principles. This project is designed to demonstrate **real-world authentication**, **secure password handling**, and **scalable backend architecture** rather than being a simple CRUD demo.

---

## 🚀 Project Overview

This application allows users to securely store and manage their credentials (such as website logins) while ensuring that **sensitive data is never stored or transmitted insecurely**.

The core focus of this project is:

* Security best practices
* Clean backend architecture
* Practical MongoDB schema design

---

## 🧠 Core Principles

* **Security-first design**
* **Passwords are never encrypted — only hashed**
* **JWT-based authentication with HTTP-only cookies**
* **Clear separation of concerns** (routes, controllers, models, utils)
* **Scalable and maintainable codebase**

---

## 🧱 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **bcrypt** (hashing & salting)
* **jsonwebtoken (JWT)**
* **cookie-parser**
* **cors**
* **dotenv**
* **multer** (optional file handling)
* **cloudinary** (optional media storage)

### Frontend

* **Next.js**
* **React (App Router)**

---

## 📁 Project Structure

```
password-manager/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is **hashed and salted using bcrypt**
3. JWT access token is generated
4. Token is stored in a **HTTP-only cookie**
5. Protected routes are guarded using a `verifyJWT` middleware

This ensures:

* No plaintext passwords
* Protection against XSS
* Stateless and scalable authentication

---

## 🧂 Password Security Design (Important)

### ❌ What is NOT done

* Passwords are **not encrypted**
* Passwords are **never stored in plain text**

### ✅ What IS done

* Passwords are **hashed + salted** using bcrypt
* Each stored credential is saved as a **separate MongoDB document**
* Credentials are always linked to a specific authenticated user

### 🔍 Why hashing instead of encryption?

* Hashing is **one-way** → even the server cannot retrieve the original password
* Encryption is **two-way** → risky if keys are compromised

This follows industry-standard security practices.

---

## 🗝️ Password Manager Features

* User authentication (register / login / logout)
* Secure password storage
* User-specific credential isolation
* Clean and scalable MongoDB schema
* JWT-protected API routes

---

## 🌐 CORS & Cookies

* CORS configured with `credentials: true`
* Environment-based allowed origins
* Secure cookie handling for authentication tokens

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

---

## 🛠️ Local Development Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Learning Outcomes

* Implementing secure authentication systems
* Understanding hashing vs encryption
* Designing MongoDB schemas for sensitive data
* Writing clean Express middleware
* Handling cookies and CORS correctly

---

## 🧪 Future Enhancements

* Client-side encryption before upload
* Password strength analysis
* Audit logs & activity tracking
* Rate limiting & brute-force protection
* Password sharing using encryption keys

---

## 🧑‍💻 Author

**Pushparaj Singh Parmar**

---

## ⭐ Final Note

This password manager is intentionally built to reflect **real backend engineering decisions**, not shortcuts. If you understand this project well, you understand the **core security fundamentals used in real-world applications**.
