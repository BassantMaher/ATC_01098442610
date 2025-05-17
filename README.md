# Event Booking System

## Overview

This is a full-stack event booking system that allows users to browse and book events, manage their bookings, and provides an integrated web-based admin panel for event management. The project leverages AI tools (e.g., ChatGPT, GitHub Copilot) for development, debugging, and documentation.

## Tech Stack

- **Frontend**: Vite, React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express
- **Database**: TBD (MongoDB )
- **Authentication**: TBD (JWT)
- **Version Control**: Git

## Project Structure

```
Folder/
├── dist/
├── node_modules/
├── server/
│   ├── src/
│   └── ...
├── src/
├── .gitignore
├── .eslintrc.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Backend Setup

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `server` directory.
   - Add necessary variables (e.g., database URL, JWT secret).

4. Start the backend server:

   ```bash
   npm start
   ```

   - The server will run on `http://localhost:5000` by default.

### Frontend Setup

1. Navigate to the root directory:

   ```bash
   cd ../
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   - The app will be available at `http://localhost:5173`.

### Running the Project

- Ensure both backend and frontend servers are running.
- Access the app in your browser at `http://localhost:5173`.
- Use the admin panel by logging in with an admin account (details to be configured in the backend).

## Features

- User authentication (register/login)
- Event listings with "Book Now" and "Booked" functionality
- Event details page with booking option
- Web-based admin panel for CRUD operations on events
- Role-based access (Admin, User)

## Enhancements

- Role-based permissions
- Event categories and tags
- Pagination for event listings

## Bonus Features

- Backend deployment (TBD)
- Multi-language support (English-Arabic)
- Dark mode support
