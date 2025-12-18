# Mini Event Platform - MERN Stack Application

A full-featured event management platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, view, and RSVP to events with robust capacity management and concurrency control.

## 🚀 Live Deployment

- **Live Link**: [https://minieventplatformbynauman.vercel.app/](https://minieventplatformbynauman.vercel.app/)
- **GitHub Repository**: [https://github.com/naumannaikwade/Mini-Event-Platform](https://github.com/naumannaikwade/Mini-Event-Platform)

## 📋 Features

### ✅ Core Features
- **User Authentication**: JWT-based secure registration and login
- **Event CRUD**: Create, read, update, and delete events with image upload
- **RSVP System**: Join/leave events with capacity enforcement
- **Concurrency Control**: Prevents race conditions during RSVP
- **Responsive UI**: Mobile-first design with Tailwind CSS

### 🎨 Additional Features
- **Cloudinary Integration**: Secure cloud image storage
- **User Dashboard**: View created and attended events
- **Event Filtering**: Filter by date and capacity
- **Protected Routes**: Role-based access control

## 🛠️ Tech Stack

**Frontend:**
- React.js 19.2.3
- React Router DOM 7.11.0
- Axios 1.13.2
- Tailwind CSS 3.4.1
- React Icons 5.5.0

**Backend:**
- Node.js with Express 5.2.1
- MongoDB with Mongoose 9.0.1
- JWT Authentication
- Cloudinary for image storage
- CORS enabled

## 📁 Project Structure

### Frontend
```
frontend/src/
├── components/
│   ├── auth/Login.js, Register.js
│   ├── events/EventList.js, EventCard.js, EventForm.js, EventDetail.js
│   ├── layout/Navbar.js, Footer.js, Layout.js
│   └── shared/Button.js, Loader.js
├── pages/Home.js, Dashboard.js, Profile.js
├── context/AuthContext.js
├── services/api.js
└── App.js
```

### Backend
```
backend/
├── controllers/auth.controller.js, event.controller.js, rsvp.controller.js
├── middleware/auth.middleware.js, error.middleware.js
├── models/User.js, Event.js, RSVP.js
├── routes/auth.routes.js, event.routes.js, rsvp.routes.js
├── utils/cloudinaryUpload.js
└── server.js
```

## 🔌 API Routes

### **Authentication Routes** (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user (protected)

### **Event Routes** (`/api/events`)
- `GET /` - Get all events (public)
- `GET /:id` - Get single event (public)
- `POST /` - Create event (protected + image upload)
- `PUT /:id` - Update event (owner only + image upload)
- `DELETE /:id` - Delete event (owner only)

### **RSVP Routes** (`/api`)
- `POST /events/:id/rsvp` - RSVP to event (protected)
- `DELETE /events/:id/rsvp` - Cancel RSVP (protected)
- `GET /rsvps` - Get user's RSVPs (protected)

### **Utility Routes**
- `GET /health` - Health check endpoint
- `GET /` - API documentation

## 🔒 Concurrency Handling

### **RSVP Race Condition Prevention**

**Problem:** Multiple users simultaneously RSVPing for last available spots causing overbooking.

**Solution:** MongoDB atomic operations with transaction support:

```javascript
// Backend RSVP Logic
const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    attendees: { $ne: userId }, // User not already attending
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] } // Capacity check
  },
  {
    $addToSet: { attendees: userId } // Atomic add, prevents duplicates
  },
  {
    new: true,
    runValidators: true
  }
);
```

**Key Techniques:**
1. **Atomic Operations**: MongoDB's `$addToSet` ensures no duplicates
2. **Single Query**: Capacity check and update in single operation
3. **Optimistic Locking**: No database locks but maintains consistency
4. **Transaction Support**: Mongoose sessions for multi-document operations

## 🔧 Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/naumannaikwade/Mini-Event-Platform.git
cd Mini-Event-Platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000
```

Start backend:
```bash
npm start
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm start
# Runs on http://localhost:3000
```

## 🚀 Deployment

**Frontend:** Vercel - Automatic deployment from GitHub

**Backend:** Render - Web service with environment variables

**Database:** MongoDB Atlas - Cloud-hosted MongoDB

## 📱 Features Overview

1. **Authentication System**
   - JWT token storage in localStorage
   - Protected routes using React Router
   - Auto-logout on token expiration

2. **Event Management**
   - Create events with title, description, date, location, capacity
   - Image upload via Cloudinary
   - Edit/delete only user-created events

3. **RSVP System**
   - Real-time capacity tracking
   - No duplicate RSVPs per user
   - Concurrency-safe operations

4. **User Interface**
   - Responsive design with Tailwind
   - Loading states and error handling
   - Toast notifications for user feedback

## 🐛 Troubleshooting

**Common Issues:**
1. **CORS Errors**: Ensure `CORS_ORIGIN` matches frontend URL
2. **MongoDB Connection**: Verify Atlas connection string
3. **Image Upload**: Check Cloudinary credentials
4. **JWT Issues**: Clear localStorage and re-login

**Health Check:** Visit `/health` endpoint to verify backend status

## 📄 License

Educational project for technical screening assessment.

## 👨‍💻 Author

**Nauman Naikwade**
- GitHub: [@naumannaikwade](https://github.com/naumannaikwade)

---

*MERN Stack Application - Full Stack Developer Intern Technical Assessment*
