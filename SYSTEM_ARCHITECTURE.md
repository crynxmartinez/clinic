# GHL Clinic System Architecture - Complete Understanding

## 📋 System Overview

The GHL clinic system is a **role-based appointment management system** with 4 user types and specific portals for each.

---

## 🎭 User Roles & Access

### 1. **Super Admin** (Highest Level)
**Portal:** `superadmin.html`  
**Login:** 
- Via `login.html` → Switch to "Super Admin" tab → Username: `admin` / Password: `admin`
- OR direct hardcoded login

**Capabilities:**
- ✅ Create and manage **Doctors** (add, edit, delete)
- ✅ Create and manage **Staff** (add, edit, delete, assign to doctors)
- ✅ Manage **Global Services** (services available to all doctors)
- ✅ View **All Appointments** (across all doctors)
- ✅ View **Calendar View** (visual calendar of all appointments)
- ✅ View **Analytics & Reports** (system-wide statistics)
- ✅ View **Dashboard** (total doctors, staff, appointments, today's appointments)

**Sections:**
1. Dashboard
2. Doctors
3. Staff
4. Global Services
5. Appointments
6. Calendar View
7. Analytics

---

### 2. **Doctor**
**Portal:** `doctor.html`  
**Login:** Via `login.html` → "Staff Login" tab → Enter email (must exist in Firestore `users` collection with `role: "doctor"`)

**Capabilities:**
- ✅ **5-Column Kanban Board** for appointment management:
  - **Booked** (New appointments)
  - **Approve** (Confirmed appointments)
  - **Appointment** (Today's appointments)
  - **Missed** (No-shows)
  - **Cancelled** (Cancelled appointments)
  - **Completed** (Finished appointments)
- ✅ **Drag & Drop** appointments between columns (updates status + GHL tags)
- ✅ Manage **Personal Services** (create, edit, delete services specific to this doctor)
- ✅ Set **Availability** (weekly schedule, working hours, off dates)
- ✅ Set **Appointment Settings** (duration, buffer time)
- ✅ Filter appointments by date range

**Sections:**
1. Appointment Board (Kanban)
2. Services
3. Availability

---

### 3. **Staff**
**Portal:** `staff.html`  
**Login:** Via `login.html` → "Staff Login" tab → Enter email (must exist in Firestore `users` collection with `role: "staff"`)

**Capabilities:**
- ✅ **5-Column Kanban Board** (same as doctor)
- ✅ **Drag & Drop** appointments between columns
- ✅ Manage appointments for **assigned doctors only** (staff are assigned to specific doctors by super admin)
- ✅ Filter by doctor and date range
- ✅ **Cannot** create/edit services or availability (read-only for those)

**Sections:**
1. Appointment Board (Kanban) - for assigned doctors only

---

### 4. **Patient**
**Portal:** `index.html` (booking page)  
**Login:** **No login required** (guest booking)

**Capabilities:**
- ✅ Book appointments (select date → doctor → time → fill details)
- ✅ View real-time availability
- ✅ Receive notifications via GHL
- ❌ **NO patient dashboard** - just book and get notified

---

## 🗂️ Database Structure (Firestore)

### Collections:

#### 1. **users** (Authentication & Roles)
```javascript
{
  email: "user@example.com",
  name: "John Doe",
  phone: "0558768414",
  role: "superadmin" | "doctor" | "staff" | "patient",
  assignedDoctors: ["doctorId1", "doctorId2"], // For staff only
  createdAt: timestamp
}
```

#### 2. **doctors** (Doctor Profiles)
```javascript
{
  userId: "reference-to-users",
  name: "Dr. Smith",
  email: "doctor@example.com",
  phone: "0558768414",
  specialty: "Dentist",
  appointmentDuration: 30,
  bufferTime: 10,
  weeklySchedule: {
    monday: [{start: "09:00", end: "17:00"}],
    tuesday: [{start: "09:00", end: "17:00"}],
    // ... other days
  },
  offDates: ["2025-10-15", "2025-10-20"],
  active: true
}
```

#### 3. **services** (Doctor-specific services)
```javascript
{
  doctorId: "reference-to-doctors",
  name: "General Consultation",
  category: "Consultation|Procedure|Follow-up",
  duration: 30,
  active: true
}
```

#### 4. **appointments** (All bookings)
```javascript
{
  type: "appointment",
  doctorId: "reference-to-doctors",
  patientId: "reference-to-users", // Optional
  serviceId: "reference-to-services", // Optional
  date: "2025-10-15",
  startTime: "09:00",
  endTime: "09:30",
  duration: 30,
  status: "booked|approve|appointment|missed|cancelled|completed",
  patientName: "John Doe",
  patientEmail: "patient@example.com",
  patientPhone: "0558768414",
  symptoms: "Patient description",
  notes: [],
  checkedIn: false,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: "userId",
  updatedBy: "userId"
}
```

---

## 🔐 Authentication Flow

### Login Process:
1. User goes to `login.html`
2. Two tabs: **"Staff Login"** (email-based) or **"Super Admin"** (username/password)

#### Staff Login (Doctor/Staff):
- Enter **email only**
- System checks Firestore `users` collection
- If found, redirect based on `role`:
  - `doctor` → `doctor.html`
  - `staff` → `staff.html`
- Session stored in `localStorage`

#### Super Admin Login:
- Enter **username** (`admin`) and **password** (`admin`)
- Hardcoded check (no database)
- Redirect to `superadmin.html`
- Session stored in `localStorage`

---

## 📊 Kanban Board System

### 6 Columns (Status Flow):
1. **Booked** → New appointments (just created)
2. **Approve** → Confirmed by doctor/staff
3. **Appointment** → Today's appointments (happening now)
4. **Missed** → Patient didn't show up
5. **Cancelled** → Appointment cancelled
6. **Completed** → Appointment finished

### Drag & Drop:
- Uses **SortableJS** library
- When card is dragged to new column:
  1. Update Firestore `appointments` status
  2. Call GHL API to update contact tags
  3. Refresh kanban board

### GHL Integration on Drag:
```javascript
// Status to Tag Mapping
{
  'booked': 'booked',
  'approve': 'approve',
  'appointment': 'appointment',
  'missed': 'missed',
  'cancelled': 'cancel',
  'completed': 'complete'
}
```

---

## 🎨 Key Features

### Super Admin Features:
- **Create Doctor:** Name, email, phone, specialty → Creates in `users` + `doctors` collections
- **Create Staff:** Name, email, phone, assign to doctors → Creates in `users` collection with `assignedDoctors` array
- **Global Services:** Services available to all doctors (not implemented yet in current version)
- **Calendar View:** Visual calendar showing all appointments
- **Analytics:** Charts and statistics

### Doctor Features:
- **Kanban Board:** Visual appointment management
- **Services Management:** Create services specific to this doctor
- **Availability:** Set working hours, days off, appointment duration

### Staff Features:
- **Kanban Board:** Manage appointments for assigned doctors only
- **Limited Access:** Cannot modify services or availability

---

## 🔄 Workflow Example

### 1. **Setup (Super Admin):**
```
Super Admin logs in → Creates Doctor → Creates Staff → Assigns Staff to Doctor
```

### 2. **Doctor Setup:**
```
Doctor logs in → Sets availability → Creates services → Ready to receive bookings
```

### 3. **Patient Booking:**
```
Patient visits index.html → Selects date → Chooses doctor → Picks time → Books
→ Appointment appears in "Booked" column on doctor's kanban
→ GHL contact created with tag "booked"
```

### 4. **Appointment Management:**
```
Doctor/Staff drags card from "Booked" to "Approve"
→ Status updated in Firestore
→ GHL tag updated to "approve"
→ Patient notified via GHL automation
```

---

## 🆚 Comparison: GHL vs MighTeeth

| Feature | GHL System | MighTeeth Current |
|---------|------------|-------------------|
| **Roles** | Super Admin, Doctor, Staff, Patient | Admin only |
| **Kanban Board** | ✅ 6 columns, drag & drop | ❌ Dropdown status only |
| **Staff Management** | ✅ Yes | ❌ No |
| **Doctor Portal** | ✅ Full featured | ❌ No |
| **Staff Portal** | ✅ Full featured | ❌ No |
| **Services** | ✅ Per-doctor + Global | ✅ Global only |
| **Availability** | ✅ Per-doctor schedule | ✅ Per-doctor schedule |
| **GHL Integration** | ✅ On drag & drop | ✅ On status change |
| **Language** | ✅ EN/AR bilingual | ❌ EN only |

---

## 🎯 What MighTeeth Needs

To match GHL system, MighTeeth needs:

1. ✅ **Super Admin Portal** (create doctors, staff)
2. ✅ **Doctor Portal** (kanban board, services, availability)
3. ✅ **Staff Portal** (kanban board for assigned doctors)
4. ✅ **Login System** (email-based with role detection)
5. ✅ **Kanban Board** (6 columns with drag & drop)
6. ✅ **Role-based Access Control**
7. ❌ **Arabic Support** (not needed per your request)

---

## 📝 Notes

- **No Queue System:** Clean appointment-only system
- **No Patient Dashboard:** Patients just book and get notified
- **GHL Integration:** Automatic contact sync on booking and status changes
- **Self-Contained Files:** Each HTML file has all CSS/JS inline
- **Firebase Backend:** Firestore for data, no authentication (email-based check only)

---

**This is the complete architecture of the GHL clinic system.**
