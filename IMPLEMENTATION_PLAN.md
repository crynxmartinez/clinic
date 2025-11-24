# MighTeeth MLS Implementation Plan

## 🎯 Goal
Rebuild MighTeeth with MLS (Multi-Location System) architecture using GHL design and functionality.

---

## 📊 Database Structure (Firebase Firestore)

### Collections to Create/Update:

#### 1. **clinics** (NEW)
```javascript
{
  id: "clinic001",
  name: "MighTeeth Downtown",
  address: "123 Main St",
  city: "City Name",
  phone: "555-1234",
  email: "downtown@mighteeth.com",
  adminId: "user123",  // Reference to clinic admin
  doctors: ["doctor001", "doctor002"],  // Array of doctor IDs
  staff: ["staff001", "staff002"],  // Array of staff IDs
  active: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. **users** (NEW - Replaces separate doctor/staff collections)
```javascript
{
  id: "user001",
  name: "Dr. Smith",
  email: "smith@example.com",
  phone: "555-5678",
  role: "superadmin" | "admin" | "doctor" | "staff",
  
  // For admins
  clinicId: "clinic001",  // Which clinic they manage
  
  // For doctors
  clinics: ["clinic001", "clinic002"],  // Can work at multiple clinics
  specialty: "Dentist",
  
  // For staff
  assignedDoctors: ["doctor001", "doctor002"],  // Which doctors they assist
  assignedClinics: ["clinic001"],  // Which clinics they work at
  
  active: true,
  createdAt: timestamp
}
```

#### 3. **patients** (UPDATE - Add MLS fields)
```javascript
{
  id: "patient001",
  globalId: "patient001",  // Unique across all clinics
  name: "John Doe",
  email: "john@example.com",
  phone: "555-9999",
  dateOfBirth: "1990-01-01",
  
  // MLS Fields
  accessibleByClinics: ["clinic001", "clinic002"],  // Which clinics can see this patient
  visitedClinics: ["clinic001", "clinic002"],  // Which clinics patient has visited
  primaryClinic: "clinic001",  // First clinic registered
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. **appointments** (UPDATE - Add clinic reference)
```javascript
{
  id: "apt001",
  patientId: "patient001",
  patientGlobalId: "patient001",  // For MLS lookup
  doctorId: "doctor001",
  clinicId: "clinic001",  // Which clinic this appointment is at
  
  date: "2025-11-25",
  startTime: "10:00 AM",
  endTime: "10:30 AM",
  duration: 30,
  
  status: "booked" | "approve" | "appointment" | "missed" | "cancelled" | "completed",
  
  patientName: "John Doe",
  patientEmail: "john@example.com",
  patientPhone: "555-9999",
  
  service: "Teeth Cleaning",
  serviceId: "service001",
  
  notes: [],  // Array of note objects
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 5. **patientHistory** (NEW - Medical records)
```javascript
{
  id: "history001",
  patientId: "patient001",
  patientGlobalId: "patient001",
  appointmentId: "apt001",
  doctorId: "doctor001",
  clinicId: "clinic001",
  
  date: "2025-11-20",
  diagnosis: "Cavity on tooth #14",
  treatment: "Filling completed",
  prescription: "Antibiotics for 7 days",
  notes: "Patient responded well to treatment",
  nextVisit: "2025-12-20",
  
  attachments: [],  // Array of file URLs
  
  visibleToClinics: ["clinic001", "clinic002"],  // MLS sharing
  
  createdAt: timestamp,
  createdBy: "doctor001"
}
```

#### 6. **services** (UPDATE - Add hierarchy)
```javascript
{
  id: "service001",
  name: "Teeth Cleaning",
  description: "Professional teeth cleaning",
  duration: 30,  // minutes
  price: 100,
  category: "Preventive",
  
  // Service Hierarchy
  type: "global" | "clinic" | "doctor",  // Who created it
  createdBy: "superadmin" | "admin001" | "doctor001",
  clinicId: "clinic001",  // If clinic-specific
  doctorId: "doctor001",  // If doctor-specific
  
  isTemplate: true,  // If it's a global template
  basedOnTemplate: "template001",  // If created from template
  
  active: true,
  createdAt: timestamp
}
```

#### 7. **doctors** (KEEP - Doctor profiles)
```javascript
{
  id: "doctor001",
  userId: "user001",  // Reference to users collection
  name: "Dr. Smith",
  email: "smith@example.com",
  phone: "555-5678",
  specialty: "Dentist",
  
  // Working hours per clinic
  schedules: {
    "clinic001": {
      monday: [{start: "09:00", end: "17:00"}],
      tuesday: [{start: "09:00", end: "17:00"}],
      // ... other days
    },
    "clinic002": {
      monday: [{start: "10:00", end: "14:00"}],
      // ... other days
    }
  },
  
  appointmentDuration: 30,
  bufferTime: 10,
  offDates: ["2025-12-25", "2025-12-26"],
  
  active: true,
  createdAt: timestamp
}
```

---

## 🎨 Files to Create/Update

### 1. **login.html** (NEW)
- Two-tab login (Staff/Doctor vs Super Admin)
- Email-based for staff/doctor (checks Firestore users)
- Username/password for super admin (hardcoded)
- Role-based redirect

### 2. **superadmin.html** (NEW)
**Sections:**
- Dashboard (system-wide stats)
- Clinics (create/manage clinics)
- Clinic Admins (create/assign admins)
- Global Service Templates
- System Analytics
- All Appointments

**Key Functions:**
- `createClinic()` - Add new clinic
- `createClinicAdmin()` - Create admin user
- `createGlobalServiceTemplate()` - Create service template
- View all clinics' data

### 3. **admin.html** (REBUILD)
**Sections:**
- Dashboard (clinic stats)
- Kanban Board (all clinic appointments with drag & drop)
- Doctors (create/manage doctors for this clinic)
- Staff (create/manage staff for this clinic)
- Services (manage clinic services)
- Patient Database (clinic-specific)
- Analytics (clinic-specific)
- Settings

**Key Functions:**
- `createDoctor()` - Create doctor user + profile
- `createStaff()` - Create staff user + assign to doctors
- `manageServices()` - Use templates or create custom
- Kanban with SortableJS + GHL tagging

### 4. **doctor.html** (NEW)
**Sections:**
- Kanban Board (personal appointments)
- Patient Database (patients I've treated)
- Services (my services)
- Working Hours (schedule per clinic)
- Analytics (my performance)

**Key Functions:**
- Kanban with SortableJS + GHL tagging
- `viewPatientHistory()` - Full medical history
- `addTreatmentNotes()` - Add to patient history
- `manageServices()` - Personal services
- `setWorkingHours()` - Per clinic schedule

### 5. **staff.html** (NEW)
**Sections:**
- Doctor Selector (dropdown)
- Kanban Board (assigned doctor's appointments)
- Analytics (assigned doctor's stats)

**Key Functions:**
- `switchDoctor()` - Change active doctor
- Kanban with SortableJS (limited access)
- View appointment details (no full history)

### 6. **booking.html** (UPDATE)
**Changes:**
- Add clinic selector (if multiple clinics)
- Check patient global ID (MLS)
- Grant clinic access on booking
- Update patient's accessibleByClinics

---

## 🔧 Key Technical Components

### 1. **SortableJS Integration**
```javascript
// Initialize drag & drop on kanban columns
function initializeDragAndDrop() {
  const statuses = ['booked', 'approve', 'appointment', 'missed', 'cancelled', 'completed'];
  
  statuses.forEach(status => {
    const element = document.getElementById(`kanban-${status}`);
    new Sortable(element, {
      group: 'kanban',
      animation: 150,
      onEnd: async function(evt) {
        const appointmentId = evt.item.dataset.id;
        const newStatus = evt.to.id.replace('kanban-', '');
        
        // Update Firebase
        await db.collection('appointments').doc(appointmentId).update({
          status: newStatus,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update GHL with tag
        const tagToAdd = stageTagMapping[newStatus];
        await upsertGHLContact({
          // ... appointment data
          tags: [tagToAdd],
          customFields: [...]
        });
        
        loadKanban();
      }
    });
  });
}
```

### 2. **GHL Tag Mapping**
```javascript
const stageTagMapping = {
  'booked': 'patient',
  'approve': 'approve',
  'appointment': 'appointment',
  'missed': 'missed',
  'cancelled': 'cancel',
  'completed': 'complete'
};
```

### 3. **MLS Patient Lookup**
```javascript
async function findOrCreatePatient(email, phone, clinicId) {
  // Check if patient exists globally
  const existing = await db.collection('patients')
    .where('email', '==', email)
    .limit(1)
    .get();
  
  if (!existing.empty) {
    // Patient exists - grant clinic access
    const patientId = existing.docs[0].id;
    await db.collection('patients').doc(patientId).update({
      accessibleByClinics: firebase.firestore.FieldValue.arrayUnion(clinicId),
      visitedClinics: firebase.firestore.FieldValue.arrayUnion(clinicId)
    });
    return patientId;
  } else {
    // New patient - create with clinic access
    const newPatient = await db.collection('patients').add({
      globalId: generateGlobalId(),
      name: name,
      email: email,
      phone: phone,
      accessibleByClinics: [clinicId],
      visitedClinics: [clinicId],
      primaryClinic: clinicId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return newPatient.id;
  }
}
```

### 4. **Role-Based Authentication**
```javascript
async function login(email, type) {
  if (type === 'superadmin') {
    // Hardcoded check
    if (email === 'admin' && password === 'admin') {
      return { role: 'superadmin', id: 'superadmin', name: 'Super Admin' };
    }
  } else {
    // Check Firestore users
    const user = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!user.empty) {
      return { id: user.docs[0].id, ...user.docs[0].data() };
    }
  }
  throw new Error('Invalid credentials');
}

function redirectByRole(user) {
  switch(user.role) {
    case 'superadmin': window.location.href = 'superadmin.html'; break;
    case 'admin': window.location.href = 'admin.html'; break;
    case 'doctor': window.location.href = 'doctor.html'; break;
    case 'staff': window.location.href = 'staff.html'; break;
  }
}
```

---

## 📋 Implementation Order

1. ✅ Create login.html (unified authentication)
2. ✅ Create superadmin.html (clinic & admin management)
3. ✅ Rebuild admin.html (with kanban + create doctors/staff)
4. ✅ Create doctor.html (personal kanban + patient database)
5. ✅ Create staff.html (assigned doctor kanban)
6. ✅ Update booking.html (MLS patient handling)
7. ✅ Update landing.html (link to login)
8. ✅ Test complete flow

---

## 🔒 Security Rules (Firestore)

```javascript
// Users can only read their own data
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
}

// Clinics readable by admins/doctors/staff of that clinic
match /clinics/{clinicId} {
  allow read: if request.auth != null;
}

// Patients accessible by their clinics
match /patients/{patientId} {
  allow read: if request.auth != null;
}

// Appointments accessible by clinic staff
match /appointments/{appointmentId} {
  allow read, write: if request.auth != null;
}
```

---

## ✅ Testing Checklist

- [ ] Super admin can create clinics
- [ ] Super admin can create clinic admins
- [ ] Clinic admin can create doctors
- [ ] Clinic admin can create staff
- [ ] Doctor sees personal kanban
- [ ] Doctor can drag & drop (GHL tags update)
- [ ] Staff sees assigned doctor's kanban
- [ ] Staff can switch between doctors
- [ ] Patient books at Clinic A (data isolated)
- [ ] Same patient books at Clinic B (data shared)
- [ ] Doctor at both clinics sees full history
- [ ] Appointment details modal shows history
- [ ] Services hierarchy works (global → clinic → doctor)

---

**Ready to implement!**
