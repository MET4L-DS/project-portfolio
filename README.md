# Saurav Shil Portfolio - Content Management System

A comprehensive full-stack portfolio website with Content Management System for event management, student/candidate registration, and PDF generation, built with React.js frontend and Express.js backend.

## Features

### Frontend

-   **Portfolio Website**: Responsive portfolio showcasing events, school, magazine, and services
-   **Admin CMS**: Complete content management system for events, students, and candidates
-   **Registration Systems**: Student registration for courses and candidate registration for events
-   **PDF Generation**: Dynamic PDF creation using react-pdf for registration forms
-   **Authentication**: Secure admin login system
-   **Image Management**: Cloudinary integration for image uploads
-   **Gallery Support**: Event galleries with multiple images
-   **Real-time Updates**: All content loaded from backend APIs

### Backend

-   **REST API**: Express.js server with MongoDB Atlas
-   **Image Storage**: Cloudinary for image and document management
-   **Authentication**: JWT-based admin authentication
-   **CRUD Operations**: Full Create, Read, Update, Delete for events, students, and candidates
-   **PDF Operations**: Generate, preview, download, and print PDFs
-   **Data Validation**: Input validation and error handling
-   **File Upload**: Support for photos and documents

## Technology Stack

### Frontend

-   React.js 19.1.0
-   TypeScript
-   Tailwind CSS 4.1.10
-   React Router Dom 7.6.2
-   Axios for API calls
-   @react-pdf/renderer for PDF generation
-   React PDF Viewer for PDF preview

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
-   **Events**: Dynamic event gallery with image galleries and detailed event pages
-   **Services**: Comprehensive services offered by Sankalp Events and Entertainment
-   **School**: Sankalp School of Art and Skills with student registration
-   **Magazine**: Aamar Xopun digital magazine
-   **Contact**: Contact information and services
-   **Student Registration**: Course enrollment with PDF form generation
-   **Candidate Registration**: Event participation with PDF application forms

### Admin CMS

-   **Dashboard**: View all events, students, and candidates with filtering options
-   **Event Management**:
    -   Create/edit/delete events with multiple image galleries
    -   Toggle active status
    -   Category and importance filtering
-   **Student Management**:
    -   View all registered students
    -   Filter by status, course, and date
    -   Generate and download PDF registration forms
    -   Update student status (Pending/Approved/Rejected)
-   **Candidate Management**:
    -   View all event candidates
    -   Filter by event, status, and date
    -   Generate and download PDF application forms
    -   Update candidate status
-   **PDF Operations**: Preview, download, and print all registration documents

### API Endpoints

#### Public Endpoints

-   `GET /api/events` - Get all active events
-   `GET /api/events/:id` - Get single event with gallery
-   `GET /api/events/meta/categories` - Get event categories
-   `POST /api/students` - Register new student
-   `GET /api/students/form/:formNo` - Get student by form number
-   `POST /api/candidates` - Register new candidate
-   `GET /api/candidates/form/:formNo` - Get candidate by form number

#### Admin Endpoints (Requires Authentication)

-   `POST /api/auth/login` - Admin login
-   `POST /api/auth/register` - Register admin user
-   `GET /api/auth/me` - Get user profile
-   `GET /api/events/admin/all` - Get all events (including inactive)
-   `POST /api/events` - Create new event with gallery
-   `PUT /api/events/:id` - Update event
-   `DELETE /api/events/:id` - Delete event
-   `GET /api/students` - Get all students with filtering
-   `PUT /api/students/:id` - Update student status
-   `DELETE /api/students/:id` - Delete student
-   `GET /api/candidates` - Get all candidates with filtering
-   `PUT /api/candidates/:id` - Update candidate status
-   `DELETE /api/candidates/:id` - Delete candidate

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
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Candidate.js
│   │   └── Magazine.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── students.js
│   │   ├── candidates.js
│   │   └── magazines.js
│   ├── get-event-ids.js
│   ├── seed-events.js
│   ├── test-connection.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   ├── logo/
│   │   └── pdf/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── StudentRegistration.tsx
│   │   │   ├── CandidateRegistration.tsx
│   │   │   ├── RegistrationSuccess.tsx
│   │   │   ├── CandidateRegistrationSuccess.tsx
│   │   │   ├── RegistrationPDFDocument.tsx
│   │   │   ├── CandidateRegistrationPDFDocument.tsx
│   │   │   ├── PDFPreviewModal.tsx
│   │   │   ├── CandidatePDFPreviewModal.tsx
│   │   │   └── RegistrationFormPDF.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   ├── EventForm.tsx
│   │   │   │   ├── StudentManagement.tsx
│   │   │   │   ├── CandidateManagement.tsx
│   │   │   │   ├── MagazineForm.tsx
│   │   │   │   └── MagazineManagement.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── EventDetail.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Magazine.tsx
│   │   │   ├── School.tsx
│   │   │   └── Services.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   └── pdfGenerator.ts
│   │   ├── events.json
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Features Implemented

✅ **Event Management CMS**

-   Create, edit, delete events
-   Multiple image gallery upload to Cloudinary
-   Category and importance filtering
-   Active/inactive toggle
-   Dedicated event detail pages
-   Event seeding and management utilities

✅ **Student Registration System**

-   Complete student registration form with photo upload
-   Course selection (multiple courses)
-   PDF generation with react-pdf
-   Admin management dashboard
-   Status tracking (Pending/Approved/Rejected)
-   PDF preview, download, and print functionality

✅ **Candidate Registration System**

-   Event-based candidate registration
-   Comprehensive application form with photo upload
-   Parent/guardian declaration system
-   PDF application form generation
-   Admin candidate management
-   Status tracking and filtering

✅ **PDF Generation & Management**

-   Dynamic PDF creation using react-pdf
-   Professional form layouts with logos
-   PDF preview modals with viewer
-   Download and print functionality
-   Both user and admin PDF access
-   Proper styling and formatting

✅ **Services Page**

-   Comprehensive services showcase
-   Professional service descriptions
-   Modern UI design

✅ **Authentication System**

-   JWT-based admin authentication
-   Protected routes
-   Session management

✅ **Image Management**

-   Cloudinary integration
-   Multiple image upload support
-   Automatic image optimization
-   Secure image deletion
-   Gallery management

✅ **Responsive Design**

-   Mobile-first approach
-   Tailwind CSS styling
-   Modern UI/UX
-   Cross-device compatibility

✅ **API Integration**

-   RESTful API design
-   Comprehensive error handling
-   Loading states
-   Form validation

## Next Steps

1. **Production Deployment**: Deploy to hosting platforms (Vercel, Netlify, Heroku)
2. **Performance Optimization**:
    - Image lazy loading
    - PDF caching
    - Database indexing
3. **Additional Features**:
    - Email notifications for registrations
    - Bulk operations for admin
    - Advanced search and filtering
    - Export data to Excel/CSV
    - Student/candidate analytics dashboard
    - Payment integration for courses
4. **SEO & Analytics**:
    - Meta tags optimization
    - Google Analytics integration
    - Sitemap generation
5. **Security Enhancements**:
    - Rate limiting
    - Input sanitization
    - CORS configuration
    - SSL certificates

## PDF Features

### Student Registration PDF

-   **Professional Layout**: Sankalp School branding with logo
-   **Comprehensive Form**: All student details with photo
-   **Course Display**: Selected courses in styled pills
-   **Signature Section**: Student/parent and approval signatures
-   **Terms & Conditions**: Built-in terms section

### Candidate Application PDF

-   **Event-Specific**: Dynamic event name in header
-   **Sankalp Events Branding**: Professional logo placement
-   **Detailed Application**: Complete candidate information
-   **Parent Declaration**: Underlined names and checkbox confirmation
-   **Multi-Signature**: Applicant, parent, and approval signatures

### PDF Operations

-   **Preview**: In-browser PDF viewer
-   **Download**: Direct PDF file download
-   **Print**: Browser print functionality
-   **Admin Access**: Full PDF management from admin panel

## Support

For setup assistance or questions, please refer to:

-   MongoDB Atlas documentation
-   Cloudinary documentation
-   React and Express.js documentation
-   React-PDF library documentation

## Project Status

🎉 **Current Version**: v2.0 - Full-featured CMS with Registration Systems

### What's New in v2.0

-   ✅ Complete student registration system with PDF generation
-   ✅ Event candidate registration and management
-   ✅ Professional PDF documents with react-pdf
-   ✅ Admin dashboards for student and candidate management
-   ✅ Event galleries with multiple images
-   ✅ Services page with comprehensive offerings
-   ✅ Enhanced UI/UX with modern design
-   ✅ Robust error handling and validation

### Live Features

-   📝 **3 Registration Systems**: Events, Students, Candidates
-   📄 **PDF Generation**: Dynamic, professional documents
-   🖼️ **Gallery Support**: Multiple images per event
-   👥 **Admin Management**: Complete CMS for all content
-   🔐 **Security**: JWT authentication and protected routes
-   📱 **Responsive**: Mobile-first design approach

## Key Technologies & Libraries

-   **@react-pdf/renderer**: PDF generation
-   **react-pdf**: PDF viewing
-   **Cloudinary**: Image storage and optimization
-   **MongoDB Atlas**: Database hosting
-   **JWT**: Authentication tokens
-   **Tailwind CSS**: Utility-first styling
-   **TypeScript**: Type safety
