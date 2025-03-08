
# 📌 Task Manager API


---

## 📖 Project Overview

The **Task Manager API** is a comprehensive backend solution designed to streamline and simplify task and subscription management.
Built with **Node.js, Express, and MongoDB**, it offers a robust set of RESTful endpoints that empower users to efficiently create, track, update, and delete tasks, 
while also managing subscriptions with ease.The API is engineered with security and scalability in mind, incorporating JWT-based authentication, role-based 
access control, and advanced middleware for error handling, validation, and rate limiting.Whether you're building a personal productivity tool or an 
enterprise-grade task management system, this API provides a modular, reliable, and secure foundation to support dynamic, real-time applications.

---

## 🌍 Practical Applications & Benefits

- **Personal Productivity:**  
  Manage daily tasks, set deadlines, and track progress.

- **Team Collaboration:**  
  Assign tasks, monitor progress, and manage projects across teams.

- **Subscription-Based Services:**  
  Businesses can integrate subscription management and automated reminders for recurring services (SaaS, memberships, online courses, etc.).

- **Automated Reminders:**  
  Ensure timely email reminders about upcoming subscription renewals.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Security:** JWT, bcrypt, and Arcjet for rate limiting & bot protection
- **Email Services:** Nodemailer and Upstash for workflow automation
- **Utilities:** Helmet, CORS, and Winston for logging

---

## ✨ Features

### 📝 Task Management

- **CRUD Operations:** Create, read, update, and delete tasks.
- **Input Validation:** Uses express-validator to enforce data integrity.
- **Ownership Checks:** Ensures only task owners or admins can modify or delete tasks.
- **Pagination & Filtering:** Supports filtering tasks by status or title, with pagination for large datasets.

### 🔐 User Authentication

- **Registration & Login:** Secure endpoints for user sign-up and sign-in.
- **Password Encryption:** Uses bcrypt to encrypt user passwords.
- **JWT Authentication:** Issues access and refresh tokens for secure communication.
- **Token Refresh:** Allows seamless token renewal to maintain user sessions.

### 💳 Subscription Management

- **Plan Creation:** Admin-only endpoints for creating, updating, and deleting subscription plans.
- **Subscription Handling:** Create subscriptions linked to users, ensuring a valid plan is referenced.
- **Status Tracking:** Monitors subscription statuses (active, canceled, trial, expired).

### 🔄 Automated Workflows & Email Reminders

- **Workflow Automation:** Integrates with Upstash to automate email reminder workflows.
- **Email Reminders:** Sends customizable reminders before subscription renewals.
- **Responsive Templates:** Professional HTML email templates powered by Nodemailer.

---

## 📁 Code Organization

The project follows an MVC architecture with a clear separation of concerns:

```
├── src/
│   ├── config/          # Environment, database, and third-party service configurations
│   ├── controllers/     # Request handlers for tasks, users, subscriptions, and workflows
│   ├── middleware/      # Authentication, authorization, and validation middleware
│   ├── models/          # Mongoose schemas for tasks, users, and subscriptions
│   ├── routes/          # Route definitions for different API endpoints
│   ├── utils/           # Utility functions for async handling, email templates, etc.
│   └── server.js        # Application entry point
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
├── .gitignore           # Files to be ignored by Git (e.g., env files, logs, node_modules)
└── package.json         # Project dependencies and scripts
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager-api.git
cd task-manager-api
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🌐 Environment Variables

Create a **.env** file in the root directory (or use the provided `.env.development` and `.env.production` files) and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=<your-mongodb-connection-string>

# JWT Settings
JWT_SECRET=<your-jwt-secret>
JWT_REFRESH_SECRET=<your-refresh-token-secret>

# Arcjet (Rate Limiting & Bot Protection)
ARCJET_KEY=<your-arcjet-key>
ARCJET_ENV=development

# QStash/Upstash (Workflow Automation)
QSTASH_URL=<your-qstash-url>
QSTASH_TOKEN=<your-qstash-token>

# Email Configuration
EMAIL_USER=<your-email-address>
EMAIL_PASSWORD=<your-email-password>

# CORS Configuration
CORS_ORIGIN=*
```

---

## 🚀 Running the Application

### Development Mode

Start the development server with hot-reloading:

```bash
npm run dev
```

### Production Mode

Run the production server:

```bash
npm start
```

---

## 🔍 API Endpoints Overview

The API is versioned under `/api/v1`. Here are the primary endpoints:

### Users

- **POST** `/api/v1/users/register` – Register a new user.
- **POST** `/api/v1/users/login` – Authenticate a user and generate tokens.
- **GET** `/api/v1/users/:id` – Retrieve user details (protected; accessible by the user or an admin).
- **POST** `/api/v1/users/refresh-token` – Refresh access token using a refresh token.

### Tasks

- **POST** `/api/v1/tasks` – Create a new task.
- **GET** `/api/v1/tasks` – Retrieve all tasks for the authenticated user (or all tasks for admins).
- **GET** `/api/v1/tasks/:id` – Retrieve a specific task by ID (with ownership check).
- **PUT** `/api/v1/tasks/:id` – Update a task (with ownership check).
- **PATCH** `/api/v1/tasks/:id/status` – Update the status of a task.
- **DELETE** `/api/v1/tasks/:id` – Delete a task (with ownership check).

### Subscription Plans (Admin Only)

- **POST** `/api/v1/plans` – Create a new subscription plan.
- **GET** `/api/v1/plans` – Retrieve active subscription plans.
- **PUT** `/api/v1/plans/:id` – Update a subscription plan.
- **DELETE** `/api/v1/plans/:id` – Delete a subscription plan.

### Subscriptions

- **POST** `/api/v1/subscriptions` – Create a new subscription (requires a valid plan ID).
- **GET** `/api/v1/subscriptions/me` – Retrieve subscriptions for the authenticated user.
- **PATCH** `/api/v1/subscriptions/:id/cancel` – Cancel an active subscription.

### Workflows

- **POST** `/api/v1/workflows/subscription/reminder` – Trigger the workflow for sending subscription renewal reminders.

---

## 🧪 Development & Testing

- **Linting:** Run ESLint to ensure code quality.
- **Hot-Reloading:** Nodemon is configured for automatic server restarts during development.
- **Testing:** Use Jest for unit and integration tests (if implemented).

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear, descriptive messages.
4. Submit a pull request with details of your changes.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
Created by- [YASH NAYAN](https://github.com/yashnayan8795)
