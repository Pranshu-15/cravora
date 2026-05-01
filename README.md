<div align="center">
  <img src="https://img.icons8.com/fluency/256/hamburger.png" width="100" height="100" alt="Cravora Logo" />
  <h1>🍔 Cravora - The Ultimate Food Delivery Platform</h1>
  <p>A full-stack, real-time, multi-role MERN application tailored for Customers, Restaurant Owners, and Delivery Partners.</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white" />
</p>

---

## 📖 Table of Contents
- [🚀 About the Project](#-about-the-project)
- [✨ Key Features](#-key-features)
  - [🧑‍💼 For Customers](#-for-customers)
  - [🏪 For Shop Owners](#-for-shop-owners)
  - [🛵 For Delivery Partners](#-for-delivery-partners)
  - [⚙️ Technical Highlights](#️-technical-highlights)
- [🛠 Tech Stack](#-tech-stack)
- [🔐 Environment Variables](#-environment-variables)
- [💻 Installation & Setup](#-installation--setup)

---

## 🚀 About the Project
**Cravora** is a modern, high-performance food delivery ecosystem built to connect hungry users with local restaurants and independent delivery drivers. Designed with a **mobile-first, highly responsive UI**, it features real-time order tracking, secure payments, and three distinct dashboards for each user role, making it a comprehensive, production-ready solution for the food delivery industry.

---

## ✨ Key Features

### 🧑‍💼 For Customers
* **Smart Browsing:** Search, filter, and discover local restaurants and trending menu items effortlessly.
* **Frictionless Cart:** Powered by Redux Toolkit for seamless state management across the application.
* **Secure Checkout:** Integrated **Razorpay** payment gateway for swift, safe, and reliable transactions.
* **Live Order Tracking:** Watch your delivery partner arrive in real-time on an interactive map, powered by **Socket.io** and **Leaflet**.
* **Order History:** Detailed user dashboards to view past orders, track current ones, and manage profile settings.

### 🏪 For Shop Owners
* **Centralized Dashboard:** A complete, bird's-eye view of your restaurant's performance and active orders.
* **Menu Management:** Easily add, edit, or remove items. Upload mouth-watering photos directly via **Cloudinary**.
* **Order Dispatching:** Accept incoming orders, update their preparation status, and auto-assign them to available delivery partners in the vicinity.
* **Business Analytics:** Visualize sales trends, earnings, and daily order volumes with interactive **Recharts**.

### 🛵 For Delivery Partners
* **Delivery Dashboard:** A dedicated hub to view available order assignments, active deliveries, and total earnings.
* **Smart Tracking:** Continuous background location syncing to broadcast live updates to the customer waiting for their food.
* **Secure Handoffs:** Built-in OTP verification system ensures the right order reaches the right person, preventing fraud.
* **Performance Tracker:** Monitor daily deliveries and earnings visually to maximize productivity.

### ⚙️ Technical Highlights
* **Authentication:** Multi-layered security using JWT HTTP-only cookies and **Firebase Google OAuth**.
* **Real-time Engine:** Instant WebSockets handle real-time order status updates, delivery dispatching, and live map location syncing.
* **Image Processing:** **Multer** and **Cloudinary** integration for optimized, secure, cloud-based media storage.
* **Email Services:** **Nodemailer** integration for secure password recovery flows and OTPs.

---

## 🛠 Tech Stack

### Frontend Architecture
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS v4 (Modern UI/UX, Glassmorphism, Responsive)
* **State Management:** Redux Toolkit
* **Routing:** React Router DOM v7
* **Real-Time & Maps:** Socket.io-client, React Leaflet
* **Data Visualization:** Recharts
* **Auth:** Firebase Authentication SDK

### Backend Architecture
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB via Mongoose
* **Real-Time:** Socket.io Server
* **Payments:** Razorpay API
* **Media & Storage:** Cloudinary + Multer
* **Security & Auth:** bcryptjs, jsonwebtoken, cors, cookie-parser

---

## 🔐 Environment Variables

To run this project locally, you will need to configure environment variables for both the frontend and backend.

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory with the following keys:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Config
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Nodemailer Config
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory with the following keys:
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 💻 Installation & Setup

Follow these steps to get the project up and running locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cravora.git
cd cravora
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm run dev
```
*The backend server will start running on port 8000 (or your specified port).*

### 3. Setup the Frontend
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will be accessible at `http://localhost:5173`.*

---
<div align="center">
  <p>Built with ❤️ by Pranshu Agrawal</p>
</div>
