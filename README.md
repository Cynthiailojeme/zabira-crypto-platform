# Zabira Dashboard - Cryptocurrency Trading Platform

## Overview

A modern, responsive cryptocurrency trading dashboard built with **Next.js (App Router)** that provides secure user signup, email verification, login, and session persistence. It is designed with a clean user experience, strong validation, and a clear separation between frontend UI logic and backend authentication logic.

The app focuses on correctness, usability, and scalability, using server-side API routes for authentication and client-side state handling for navigation and session management.

---

## Core Features

### 1. User Authentication
- Secure login using email and password
- Passwords are hashed using `bcrypt`
- Prevents unverified users from logging in
- Returns sanitized user data only, excluding sensitive fields

### 2. Email Verification Flow
- Users must verify their email before login
- Unverified users are blocked from accessing the app
- Backend signals when verification is required
- Frontend automatically redirects users to the verification page when needed

### 3. Client-side Session Persistence
- On successful login, user data is stored in `localStorage` as `currentUser`
- Allows session persistence across page reloads
- Enables easy access to the logged-in user throughout the app

### 4. Smooth User Experience
- Loading states during authentication
- Inline form validation with Formik and Yup
- Clear error messaging for API and validation errors
- Automatic redirect to home page on successful login

---

## Additional UX Enhancements

### Login and Logout Experience
- Login and logout features have been implemented to improve overall user experience
- Users can easily authenticate, access the app, and securely exit their session
- Logout clears the stored session data, ensuring a clean and predictable auth flow

### OTP Testing Convenience
- Users can interact with the verification flow and receive OTP codes directly
- OTPs are surfaced in a way that allows easy testing without relying on external email or SMS services
- This makes development, QA, and demos faster and more reliable while maintaining the intended verification logic

### Step Progress Reset on Logout
- When a user logs out, all step-based progress within the application is reset
- This ensures that each new session starts from a clean state

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- Formik for form state management
- Yup for validation schemas
- Tailwind CSS for styling
- Lucide Icons

### Backend
- Next.js API Routes
- @vercel/postgres for database access
- bcryptjs for password hashing and verification

---

## Setup and Deployment

### Local Setup

Follow the steps below to run the application locally:

1. **Clone the repository**
```bash
git clone https://github.com/Cynthiailojeme/zabira-crypto-platform.git
cd zabira-crypto-platform

npm install
# or
yarn install
```

## GitHub Repository

Source code is available on GitHub:  
🔗 [https://github.com/Cynthiailojeme/zabira-crypto-platform](https://github.com/Cynthiailojeme/zabira-crypto-platform)

---

## Live Demo (Vercel)

The application is deployed on Vercel and can be accessed here:  
🚀 [https://zabira-crypto-platform-ci.vercel.app/](https://zabira-crypto-platform-ci.vercel.app/)


