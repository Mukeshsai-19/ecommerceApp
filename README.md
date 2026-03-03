# E-commerce Seller Platform (Mobile-First)

This is a full-stack application for sellers to manage products and profiles.

## Prerequisites
- Node.js installed on your system.
- MongoDB Atlas account (already configured in `.env`).

## How to Run

### 1. Start the Backend Server
```bash
cd server
$env:Path += ";C:\Program Files\nodejs"
& "C:\Program Files\nodejs\node.exe" index.js
```
The server will run on `http://localhost:5000`.

### 2. Start the Frontend Client
```bash
cd client
$env:Path += ";C:\Program Files\nodejs"
& "C:\Program Files\nodejs\npm.cmd" run dev
```
The client will usually run on `http://localhost:5173`.

## Features
- **Mobile-First Design**: Optimized for mobile device form factors.
- **Light Mode**: High readability and clean UX.
- **Authentication**: JWT-based signin and register.
- **Product CRUD**: Add, Update, and Delete products with seller ownership.
- **Profile Management**: View and update seller account details.
