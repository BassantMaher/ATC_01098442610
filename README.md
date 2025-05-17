<h1 align="center">🎟️ Event Booking System</h1>

<p align="center">
  <b>Full-Stack Event Management Platform</b><br/>
  Browse, book, and manage events seamlessly. Includes admin panel, role-based access, and Google OAuth login.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Backend-Express-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat-square"/>
  <img src="https://img.shields.io/badge/Auth-Google%20OAuth-yellow?style=flat-square"/>
  <img src="https://img.shields.io/badge/Language-TypeScript-blueviolet?style=flat-square"/>
</p>

---

## 🔍 Overview

The Event Booking System is a modern full-stack web application that allows users to:

- Browse and search events with filters
- View detailed event information
- Book and manage event participation
- Authenticate using Google OAuth or traditional login
- Manage events via an admin dashboard
- Real-time updates using Socket.IO
- Multi-language support (EN/AR)
- Dark/Light theme toggle

---

## 🚀 Tech Stack

| Category     | Tech                                  |
|--------------|---------------------------------------|
| Frontend     | React, Vite, Tailwind CSS, TypeScript |
| Backend      | Node.js, Express, Socket.io           |
| Database     | MongoDB                               |
| Auth         | JWT, Google OAuth 2.0                 |
| Deployment   | TBD                                   |
| Dev Tools    | Prettier, Git, GitHub Copilot         |

---

## 📋 Features

### 🔐 Authentication
- Traditional email/password login and registration
- Google OAuth integration
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (Admin/User)

### 📆 Events Management
- Browse events with pagination
- Search events by title or description
- Filter events by category
- View event details (date, venue, capacity, price)
- Real-time updates for event bookings
- Image upload for event thumbnails

### 🛒 Booking System
- Book available events
- View booking confirmation
- Check booking status
- View personal booking history
- Cancel bookings (admin only)
- Real-time capacity updates

### 👑 Admin Features
- Comprehensive event management (CRUD)
- View all bookings across the platform
- Monitor event capacity and bookings
- User management capabilities
- Access to analytics and reports

### 🌐 Additional Features
- Multi-language support (EN/AR)
- Dark/Light theme toggle
- Responsive design
- Modern glass-morphism UI

---

## 🔌 API Endpoints

### Authentication Routes
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
GET  /api/auth/profile     - Get user profile
GET  /api/auth/google      - Google OAuth login
GET  /api/auth/google/callback - Google OAuth callback
```

### Event Routes
```
GET    /api/events         - Get all events (with filters & pagination)
GET    /api/events/:id     - Get single event
POST   /api/events         - Create event (Admin)
PUT    /api/events/:id     - Update event (Admin)
DELETE /api/events/:id     - Delete event (Admin)
POST   /api/events/upload  - Upload event image (Admin)
```

### Booking Routes
```
POST   /api/bookings       - Create booking
GET    /api/bookings       - Get all bookings (Admin)
GET    /api/bookings/me    - Get user bookings
GET    /api/bookings/:id   - Get booking details
GET    /api/bookings/check/:eventId - Check booking status
DELETE /api/bookings/:id   - Delete booking (Admin)
```

---

## 🔑 User Capabilities
- Register and login with email/password
- Login with Google OAuth
- Browse and search events
- View event details
- Book available events
- View personal booking history
- Toggle theme preference
- Switch language preference
- Receive real-time notifications

## 👑 Admin Capabilities
- All user capabilities
- Create, edit, and delete events
- Upload event images
- View all bookings
- Access dashboard

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- npm or yarn
- Google Developer Console Project (for OAuth credentials)

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
NODE_ENV=development
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd ../
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## 📚 References

- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Passport Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [MongoDB Documentation](https://docs.mongodb.com/)