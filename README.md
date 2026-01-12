# 🛒 E-Commerce Full Stack Application

A **full-stack E-Commerce web application** built using **MERN-style architecture** with a modern frontend and a scalable backend.  
The project supports **authentication, product management, cart, orders, and secure API communication**.

---

## 🚀 Tech Stack

### 🔧 Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Cookie-based authentication**
- **dotenv** for environment configuration

### 🎨 Frontend
- **React 19**
- **Vite**
- **TypeScript**
- **React Router DOM**
- **Axios**
- **Tailwind CSS v4**
- **Radix UI**
- **Lucide Icons**
- **Sonner (Toast notifications)**
- **Dark / Light Theme support**

---

## ✨ Features

### 👤 Authentication
- User Signup & Login
- JWT-based authentication
- Secure cookies
- Logout functionality

### 🛍️ Products
- Product listing
- Product details page
- Product image upload (Cloudinary)
- Stock management

### 🛒 Cart & Orders
- Add to cart
- Remove from cart
- Update quantity
- Place orders
- Order status tracking (Pending / Delivered / Cancelled)

### 📦 Orders
- Order history
- Order status updates
- Cancel order functionality

### 🎨 UI / UX
- Responsive design
- Clean modern UI
- Toast notifications
- Loading states

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine in a clean and beautiful manner.

### 1. Fetch Repository

First, clone the project to your local machine:

```
git clone <repository_url>
cd <repository_name>
```

### 2. Environment Setup
Set up your environment variables using the provided example.

Locate example_env.txt.

Create a .env file.

Copy the contents of example_env.txt into .env and adjust values if necessary.

### 3. Backend Setup
Open a terminal and run the following commands to setup the server and database:


```
cd Backend
npm i
npm run seed
npm run dev
4. Frontend Setup
Open a new terminal tab and run the following commands to launch the client:
```

### 4. Frontend Setup
Open a new terminal tab and run the following commands to launch the client:

```
cd Frontend
npm i
npm run dev
```