# Saurav Shil Portfolio - Content Management System

A full-stack portfolio website with Content Management System for event management, built with React.js frontend and Express.js backend.

## Features

### Frontend

-   **Portfolio Website**: Responsive portfolio showcasing events, school, and magazine
-   **Admin CMS**: Complete content management system for events
-   **Authentication**: Secure admin login system
-   **Image Management**: Cloudinary integration for image uploads
-   **Real-time Updates**: Events are loaded from the backend API

### Backend

-   **REST API**: Express.js server with MongoDB Atlas
-   **Image Storage**: Cloudinary for image management
-   **Authentication**: JWT-based admin authentication
-   **CRUD Operations**: Full Create, Read, Update, Delete for events
-   **Data Validation**: Input validation and error handling

## Technology Stack

### Frontend

-   React.js 19.1.0
-   TypeScript
-   Tailwind CSS 4.1.10
-   React Router Dom 7.6.2
-   Axios for API calls

### Backend

-   Node.js
-   Express.js 5.1.0
-   MongoDB Atlas with Mongoose 8.1.0
-   Cloudinary 2.0.0 for image storage
-   JWT for authentication
-   BCrypt for password hashing
-   Multer for file uploads

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Environment Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `.env` with your credentials:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/portfolio-db?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address
5. Get the connection string and update `MONGODB_URI`

#### Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your cloud name, API key, and API secret from dashboard
4. Update the Cloudinary variables in `.env`

#### Start Backend Server

```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Create Admin User

#### Option 1: API Request

Send a POST request to create the first admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "your-secure-password"
  }'
```

#### Option 2: Using API Testing Tool

Use Postman or similar tools:

-   URL: `POST http://localhost:5000/api/auth/register`
-   Body (JSON):

```json
{
	"username": "admin",
	"email": "admin@example.com",
	"password": "your-secure-password"
}
```

### 4. Access Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. Access the dashboard at `http://localhost:5173/admin/dashboard`

## Usage

### Public Website

-   **Home**: Portfolio overview with four pillars
-   **About**: Journey timeline with organization logos
-   **Events**: Dynamic event gallery loaded from CMS
-   **School**: Sankalp School of Art and Skills details
-   **Magazine**: Aamar Xopun digital magazine
-   **Contact**: Contact information and services

### Admin CMS

-   **Dashboard**: View all events with filtering options
-   **Add Event**: Create new events with image upload
-   **Edit Event**: Update existing event details
-   **Delete Event**: Remove events (with confirmation)
-   **Toggle Active**: Enable/disable events on public site

### API Endpoints

#### Public Endpoints

-   `GET /api/events` - Get all active events
-   `GET /api/events/:id` - Get single event
-   `GET /api/events/meta/categories` - Get event categories

#### Admin Endpoints (Requires Authentication)

-   `POST /api/auth/login` - Admin login
-   `POST /api/auth/register` - Register admin user
-   `GET /api/auth/me` - Get user profile
-   `GET /api/events/admin/all` - Get all events (including inactive)
-   `POST /api/events` - Create new event
-   `PUT /api/events/:id` - Update event
-   `DELETE /api/events/:id` - Delete event

## Development

### Frontend Development

```bash
cd frontend
npm run dev
```

### Backend Development

```bash
cd backend
npm run dev
```

### Building for Production

#### Frontend

```bash
cd frontend
npm run build
```

#### Backend

```bash
cd backend
npm start
```

## Project Structure

```
project-portfolio/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── events.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   └── EventForm.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Magazine.tsx
│   │   │   └── School.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Features Implemented

✅ **Event Management CMS**

-   Create, edit, delete events
-   Image upload to Cloudinary
-   Category and importance filtering
-   Active/inactive toggle

✅ **Authentication System**

-   JWT-based admin authentication
-   Protected routes
-   Session management

✅ **Image Management**

-   Cloudinary integration
-   Automatic image optimization
-   Secure image deletion

✅ **Responsive Design**

-   Mobile-first approach
-   Tailwind CSS styling
-   Modern UI/UX

✅ **API Integration**

-   RESTful API design
-   Error handling
-   Loading states

## Next Steps

1. **Backup existing images**: Migrate current static images to Cloudinary
2. **Data Migration**: Transfer existing event data to MongoDB
3. **Production Deployment**: Deploy to hosting platforms
4. **Additional Features**:
    - Bulk upload functionality
    - Event analytics
    - SEO optimization
    - Image compression settings

## Support

For setup assistance or questions, please refer to:

-   MongoDB Atlas documentation
-   Cloudinary documentation
-   React and Express.js documentation
