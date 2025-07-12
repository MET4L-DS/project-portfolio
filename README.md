# Saurav Shil Portfolio - Content Management System

A comprehensive full-stack portfolio website with Content Management System for event management, student/candidate registration, and PDF generation, built with React.js frontend and Express.js backend featuring modern glassmorphism design.

## Features

### Frontend

-   **Portfolio Website**: Responsive portfolio showcasing events, school, magazine, and services with modern glassmorphism design
-   **Admin CMS**: Complete content management system with beautiful glassmorphism UI for events, students, and candidates
-   **Registration Systems**: Student registration for courses and candidate registration for events with dedicated form pages
-   **Contact Form System**: Smart contact form with EmailJS integration that routes messages to appropriate email addresses
-   **PDF Generation**: Dynamic PDF creation using react-pdf for registration forms
-   **Authentication**: Secure admin login system with glassmorphism design
-   **Image Management**: Cloudinary integration for image uploads
-   **Gallery Support**: Event galleries with multiple images and lightbox viewer
-   **Real-time Updates**: All content loaded from backend APIs
-   **Modern UI/UX**: Glassmorphism design with animated gradients and beautiful visual effects

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
-   @emailjs/browser for contact form integration

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

#### EmailJS Setup (For Contact Form)

1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account
3. Set up an email service (Gmail, Outlook, etc.)
4. Create an email template with the required variables
5. Get your Service ID, Template ID, and Public Key
6. Copy `frontend/.env.example` to `frontend/.env` and update with your credentials

#### Frontend Environment Variables

```bash
cd frontend
cp .env.example .env
```

Update `.env` with your EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

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

-   **Home**: Portfolio overview with four pillars and modern glassmorphism design
-   **About**: Journey timeline with organization logos and beautiful card layouts
-   **Events**: Dynamic event gallery with image galleries, detailed event pages, and prominent registration buttons
-   **Services**: Comprehensive services offered by Sankalp Events and Entertainment with glassmorphism cards
-   **School**: Sankalp School of Art and Skills with student registration and modern UI
-   **Magazine**: Aamar Xopun digital magazine with elegant design
-   **Contact**: Contact information and services with smart contact form routing
-   **Student Registration**: Course enrollment with dedicated registration page and PDF form generation
-   **Candidate Registration**: Event participation with dedicated registration page and PDF application forms

### Admin CMS

-   **Dashboard**: Beautiful glassmorphism dashboard with animated gradients and comprehensive overview
-   **Event Management**:
    -   Create/edit/delete events with multiple image galleries
    -   Modern glassmorphism forms and interfaces
    -   Toggle active status with elegant switches
    -   Category and importance filtering with styled dropdowns
-   **Student Management**:
    -   View all registered students with beautiful card layouts
    -   Filter by status, course, and date with modern controls
    -   Generate and download PDF registration forms
    -   Update student status with glassmorphism modals
-   **Candidate Management**:
    -   View all event candidates with elegant interfaces
    -   Filter by event, status, and date
    -   Generate and download PDF application forms
    -   Update candidate status with modern forms
-   **PDF Operations**: Preview, download, and print all registration documents with beautiful modals
-   **Modern Design**: Consistent glassmorphism design across all admin pages with animated backgrounds

### API Endpoints

#### Public Endpoints

-   `GET /api/events` - Get all active events
-   `GET /api/events/:id` - Get single event with gallery
-   `GET /api/events/meta/categories` - Get event categories
-   `POST /api/students` - Register new student
-   `GET /api/students/form/:formNo` - Get student by form number
-   `POST /api/candidates` - Register new candidate
-   `GET /api/candidates/form/:formNo` - Get candidate by form number

#### Registration Pages

-   `/events/:eventId/register` - Dedicated candidate registration form page
-   `/school` - Student registration form (embedded)

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
│   │   ├── config/
│   │   │   └── emailjs.ts
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
│   │   │   │   ├── MagazineManagement.tsx
│   │   │   │   ├── AboutManagement.tsx
│   │   │   │   ├── AchievementManagement.tsx
│   │   │   │   ├── JourneyManagement.tsx
│   │   │   │   ├── SchoolManagement.tsx
│   │   │   │   ├── LocationManagement.tsx
│   │   │   │   ├── SkillManagement.tsx
│   │   │   │   ├── GalleryManagement.tsx
│   │   │   │   ├── ServiceManagement.tsx
│   │   │   │   └── ProfileManagement.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── EventDetail.tsx
│   │   │   ├── CandidateRegistrationForm.tsx
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

✅ **Modern Glassmorphism Design**

-   Beautiful glassmorphism UI across all admin pages
-   Animated gradient backgrounds with floating orbs
-   Consistent design language throughout the application
-   Modern card layouts with backdrop blur effects
-   Enhanced visual hierarchy and user experience

✅ **Separate Registration Form Pages**

-   Dedicated candidate registration form page (`/events/:eventId/register`)
-   Shareable registration links for easy distribution
-   Better user experience with full-page forms
-   SEO-friendly registration pages
-   Improved navigation and accessibility

✅ **Event Management CMS**

-   Create, edit, delete events with glassmorphism forms
-   Multiple image gallery upload to Cloudinary
-   Category and importance filtering with modern controls
-   Active/inactive toggle with elegant switches
-   Dedicated event detail pages with prominent registration buttons
-   Event seeding and management utilities

✅ **Student Registration System**

-   Complete student registration form with photo upload
-   Course selection (multiple courses)
-   PDF generation with react-pdf
-   Admin management dashboard with glassmorphism design
-   Status tracking (Pending/Approved/Rejected)
-   PDF preview, download, and print functionality

✅ **Candidate Registration System**

-   Event-based candidate registration with dedicated pages
-   Comprehensive application form with photo upload
-   Parent/guardian declaration system
-   PDF application form generation
-   Admin candidate management with modern UI
-   Status tracking and filtering with glassmorphism modals

✅ **Enhanced Admin Dashboard**

-   Beautiful glassmorphism dashboard with animated backgrounds
-   Comprehensive management for all content types
-   Modern tab navigation with icons and gradients
-   Responsive design that works on all devices
-   Enhanced visual feedback and loading states

✅ **PDF Generation & Management**

-   Dynamic PDF creation using react-pdf
-   Professional form layouts with logos
-   PDF preview modals with viewer
-   Download and print functionality
-   Both user and admin PDF access
-   Proper styling and formatting

✅ **Contact Form System**

-   EmailJS integration for contact form
-   Smart email routing based on query type
-   Three recipient channels: Entertainment, School, Magazine
-   Professional email templates
-   Form validation and user feedback
-   Real-time status updates during submission

✅ **Services Page**

-   Comprehensive services showcase
-   Professional service descriptions
-   Modern UI design

✅ **Authentication System**

-   JWT-based admin authentication
-   Protected routes with modern login page
-   Beautiful glassmorphism login form
-   Session management with enhanced UX

✅ **Image Management**

-   Cloudinary integration
-   Multiple image upload support
-   Automatic image optimization
-   Secure image deletion
-   Gallery management with lightbox viewer

✅ **Responsive Design**

-   Mobile-first approach with glassmorphism design
-   Tailwind CSS styling with modern gradients
-   Beautiful UI/UX with animated elements
-   Cross-device compatibility
-   Enhanced visual effects and transitions

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
-   **EmailJS Setup**: See `EMAILJS_SETUP.md` for detailed EmailJS configuration guide

## Project Status

🎉 **Current Version**: v3.0 - Modern Glassmorphism CMS with Dedicated Registration Pages

### What's New in v3.0

-   ✨ **Complete Glassmorphism Design**: Beautiful modern UI across all admin pages
-   🔗 **Dedicated Registration Pages**: Separate form pages for better UX and shareability
-   🎨 **Animated Backgrounds**: Gradient backgrounds with floating animated orbs
-   📱 **Enhanced Mobile Experience**: Improved responsive design with glassmorphism
-   🎯 **Better User Flow**: Prominent registration buttons and improved navigation
-   💎 **Consistent Design Language**: Unified glassmorphism theme throughout
-   ⚡ **Performance Improvements**: Optimized loading states and transitions
-   🔧 **Enhanced Admin Tools**: Modern interfaces for all management tasks

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

-   📝 **3 Registration Systems**: Events, Students, Candidates with dedicated pages
-   📄 **PDF Generation**: Dynamic, professional documents
-   🖼️ **Gallery Support**: Multiple images per event with lightbox viewer
-   👥 **Admin Management**: Complete CMS with glassmorphism design
-   🔐 **Security**: JWT authentication with beautiful login interface
-   📱 **Responsive**: Mobile-first glassmorphism design
-   🔗 **Shareable Links**: Dedicated registration URLs for easy sharing
-   🎨 **Modern Design**: Glassmorphism with animated gradients and visual effects

## Key Technologies & Libraries

-   **@emailjs/browser**: Contact form email integration
-   **@react-pdf/renderer**: PDF generation
-   **react-pdf**: PDF viewing
-   **Cloudinary**: Image storage and optimization
-   **MongoDB Atlas**: Database hosting
-   **JWT**: Authentication tokens
-   **Tailwind CSS**: Utility-first styling
-   **TypeScript**: Type safety
