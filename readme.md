# 🎵 SoundWave - A Fullstack Spotify Clone

SoundWave is a full-featured music streaming application inspired by Spotify, offering real-time interactions, live user status, admin music management, and integrated chat. Built using modern web technologies, it delivers an immersive and interactive user experience.

---

## ✨ Features

- ▶️ Listen to music, play next/previous tracks
- 🔈 Adjust volume seamlessly with a slider
- 🎧 **Admin dashboard** to create and manage albums & songs
- 💬 **Real-time chat** built into the music experience
- 👨🏼‍💼 Online/Offline user status visibility
- 👀 See what others are listening to in real-time
- 📊 Analytics page with aggregate user data
- 🔐 Authentication & Authorization using **Clerk**
- 🌈 Sleek, responsive UI built with **TailwindCSS** & **shadcn**

---

## 🛠️ Tech Stack

### 🔹 Client:

- React.js
- TailwindCSS
- Shadcn
- Zustand (for state management)
- Socket.io-client
- Clerk (Authentication)

### 🔸 Server:

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- Cloudinary (for image upload)
- Clerk (Authentication)

---

## ⚙️ Environment Variables Setup

### 📁 Backend `.env` file

Create a `.env` file inside your **`server/`** directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Admin
ADMIN_EMAIL=your_admin_email@example.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_cleak_publishable_key
```
