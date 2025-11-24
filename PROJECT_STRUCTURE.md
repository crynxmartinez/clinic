# Clinic Management System - Project Structure

## Overview
A comprehensive clinic management system with appointment booking, queue management, and role-based access control.

## User Roles
1. **Super Admin** - Manages doctors, staff, and system-wide settings
2. **Doctor** - Manages services, availability, and appointments
3. **Staff** - Manages appointments for assigned doctors
4. **Patient** - Books appointments and joins queue

## Database Structure (Firestore)

### Collections

#### `users`
```javascript
{
  userId: "auto-generated",
  email: "user@example.com",        // Unique, used for login
  role: "superadmin|doctor|staff|patient",
  name: "John Doe",
  phone: "0558768414",
  assignedDoctors: ["doctorId1", "doctorId2"],  // For staff only
  favoriteDoctors: ["doctorId1"],               // For patients only
  createdAt: timestamp
}
```

#### `doctors`
```javascript
{
  doctorId: "auto-generated",
  userId: "reference-to-users",
  name: "Dr. Smith",
  email: "doctor@example.com",
  phone: "0558768414",
  specialty: "Dentist",
  weeklySchedule: {
    monday: [{start: "09:00", end: "17:00"}],
    tuesday: [{start: "09:00", end: "17:00"}],
    // ... other days
  },
  offDates: ["2025-10-15", "2025-10-20"],  // Specific dates doctor is unavailable
  breakTimes: [{start: "12:00", end: "13:00"}],  // Daily break times
  bufferTime: 10,  // Minutes between appointments
  active: true
}
```

#### `services`
```javascript
{
  serviceId: "auto-generated",
  doctorId: "reference-to-doctors",
  name: "General Consultation",
  category: "Consultation|Procedure|Follow-up",
  duration: 30,  // Minutes
  active: true
}
```

#### `appointments`
```javascript
{
  appointmentId: "auto-generated",
  type: "appointment|queue",
  doctorId: "reference-to-doctors",
  patientId: "reference-to-users",  // Optional, null for guest bookings
  serviceId: "reference-to-services",  // Optional
  date: "2025-10-15",
  startTime: "09:00",  // Null for queue initially
  endTime: "09:30",    // Null for queue initially
  duration: 30,
  queueNumber: 5,  // Only for queue type
  status: "queue|new|confirmed|today|completed|cancelled",
  patientName: "John Doe",
  patientEmail: "patient@example.com",
  patientPhone: "0558768414",
  symptoms: "Patient description of symptoms",
  notes: [
    {
      text: "Doctor's note",
      createdBy: "userId",
      createdAt: timestamp
    }
  ],
  checkedIn: false,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: "userId",
  updatedBy: "userId"
}
```

#### `auditLogs`
```javascript
{
  logId: "auto-generated",
  userId: "reference-to-users",
  userName: "John Doe",
  action: "create|update|delete",
  entity: "appointment|doctor|service|user",
  entityId: "reference-to-entity",
  changes: {
    field: "status",
    oldValue: "pending",
    newValue: "confirmed"
  },
  timestamp: timestamp
}
```

## File Structure

```
clinic/
├── index.html              # Landing page with booking options
├── login.html              # Universal login page
├── superadmin.html         # Super Admin portal
├── doctor.html             # Doctor portal with kanban
├── staff.html              # Staff portal with kanban
├── patient-dashboard.html  # Patient account dashboard
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── auth.js             # Authentication utilities
│   ├── kanban.js           # Kanban board component
│   └── utils.js            # Shared utilities
├── firestore.rules         # Firestore security rules
└── PROJECT_STRUCTURE.md    # This file
```

## Features by Role

### Super Admin
- Create/edit/delete doctors
- Create/edit/delete staff
- Assign staff to doctors
- View all appointments (kanban/table)
- Analytics dashboard
- Audit logs

### Doctor
- Manage services (create/edit/delete)
- Set availability (weekly schedule, off dates, breaks)
- View appointments on kanban board
- Manage queue patients
- Add notes to appointments
- View patient history
- Approve/reschedule/cancel appointments

### Staff
- View appointments for assigned doctors
- Kanban board with drag-and-drop
- Add walk-in/queue patients
- Confirm/reschedule/cancel appointments
- Check-in patients
- Add notes

### Patient
- Book appointments (select doctor, date, time, service)
- Join queue for same-day service
- View appointment history
- Reschedule/cancel appointments
- Save favorite doctors

## Kanban Board Stages

1. **Queue** - Walk-in patients for today
2. **New Requests** - Unconfirmed appointments
3. **Confirmed** - Approved appointments
4. **Today** - Appointments happening today
5. **Completed** - Finished appointments
6. **Cancelled** - Cancelled/rejected appointments

## Authentication Flow

1. User enters email on login page
2. System queries Firestore `users` collection
3. If email exists → Login successful, redirect based on role
4. If not found → Show error
5. Session stored in localStorage

## Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCjJLE_Mgrv3HONhkkgApmUNVlGdnAIcvI",
  authDomain: "clinic-a17bc.firebaseapp.com",
  projectId: "clinic-a17bc",
  storageBucket: "clinic-a17bc.firebasestorage.app",
  messagingSenderId: "5214960983",
  appId: "1:5214960983:web:4da52f47c510a50b3cd212",
  measurementId: "G-7YM2Z0BY98"
};
```

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Styling**: TailwindCSS
- **Icons**: Font Awesome
- **Drag & Drop**: SortableJS
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting (optional)

## Development Notes

- No Firebase Authentication (custom email-based auth)
- No email/SMS notifications (handled by GHL)
- No file uploads (removed for MVP)
- No offline support
- Real-time updates using Firestore listeners
- Mobile-responsive design
