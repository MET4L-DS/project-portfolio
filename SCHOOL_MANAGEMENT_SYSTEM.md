# School Management System

This document explains the new School Management System that allows CRUD operations for Sankalp School's locations and skills.

## Features Added

### 1. Database Models

-   **Location Model**: Manages school locations with name, address, icon, and display order
-   **Skill Model**: Manages skills taught at the school with name, icon, description, and display order

### 2. Backend APIs

#### Location Endpoints

-   `GET /api/locations` - Get all active locations (public)
-   `GET /api/locations/admin` - Get all locations including inactive (admin only)
-   `GET /api/locations/:id` - Get single location by ID
-   `POST /api/locations` - Create new location (admin only)
-   `PUT /api/locations/:id` - Update location (admin only)
-   `DELETE /api/locations/:id` - Delete location (admin only)
-   `POST /api/locations/:id/toggle` - Toggle location status (admin only)

#### Skill Endpoints

-   `GET /api/skills` - Get all active skills (public)
-   `GET /api/skills/admin` - Get all skills including inactive (admin only)
-   `GET /api/skills/:id` - Get single skill by ID
-   `POST /api/skills` - Create new skill (admin only)
-   `PUT /api/skills/:id` - Update skill (admin only)
-   `DELETE /api/skills/:id` - Delete skill (admin only)
-   `POST /api/skills/:id/toggle` - Toggle skill status (admin only)

### 3. Frontend Components

#### Admin Components

-   **SchoolManagement**: Main component with tabs for locations and skills
-   **LocationManagement**: Full CRUD interface for managing locations
-   **SkillManagement**: Full CRUD interface for managing skills

#### Public Components

-   **School.tsx**: Updated to fetch data from APIs instead of hardcoded data

### 4. Admin Panel Integration

-   Added "School Management" tab to the admin dashboard
-   Accessible at `/admin` after login
-   Includes both location and skill management in separate tabs

## How to Use

### For Admins

1. **Login to Admin Panel**

    - Navigate to `/admin/login`
    - Use admin credentials

2. **Access School Management**

    - Click on "School Management" tab in admin dashboard
    - Switch between "Locations" and "Skills" tabs

3. **Manage Locations**

    - Add new locations with name, address, icon, and display order
    - Edit existing locations
    - Toggle active/inactive status
    - Delete locations (with confirmation)

4. **Manage Skills**
    - Add new skills with name, icon, description, and display order
    - Quick icon selector with common emojis
    - Edit existing skills
    - Toggle active/inactive status
    - Delete skills (with confirmation)

### For Users

-   The School page automatically loads current active locations and skills from the database
-   Loading states are shown while fetching data
-   Fallback to default data if API fails

## Database Seeding

To populate initial data, run:

```bash
cd backend
node seed-school-data.js
```

This will create:

-   2 default locations (Carbon Gate and Nabinnagar)
-   13 default skills (Art, Dance, Craft, etc.)

## Technical Details

### Location Data Structure

```javascript
{
  name: String (required),
  address: String (required),
  icon: String (default: "📍"),
  displayOrder: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Skill Data Structure

```javascript
{
  name: String (required),
  icon: String (required),
  description: String (optional),
  displayOrder: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Security

-   All admin endpoints require authentication and admin role
-   Input validation on all create/update operations
-   Proper error handling and user feedback

## UI/UX Features

-   Responsive design for mobile and desktop
-   Loading states and error handling
-   Confirmation dialogs for destructive actions
-   Visual indicators for active/inactive status
-   Drag-and-drop style interface (ready for future enhancements)
-   Icon picker for skills with common emojis

The system is now fully functional and allows complete management of school locations and skills through the admin panel!
