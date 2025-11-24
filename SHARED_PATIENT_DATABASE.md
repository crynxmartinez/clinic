# 🏥 SHARED PATIENT DATABASE - IMPLEMENTATION GUIDE

## 🎯 **OBJECTIVE**

Implement a shared patient database across all MyMedPH clinics where:
- Patient data is shared ONLY when patient books at a clinic
- Doctors can see complete patient history from ALL authorized clinics
- Access is granted through booking (consent-based)
- Complete privacy and data isolation for non-authorized clinics

---

## 📊 **DATABASE ARCHITECTURE**

### **Collection: `patients` (GLOBAL)**

```javascript
{
  id: 'patient_abc123',  // Auto-generated
  
  // Basic Information
  name: 'Juan Dela Cruz',
  email: 'juan@email.com',  // Unique identifier
  phone: '+63 917 123 4567',
  dateOfBirth: '1990-01-01',  // Optional
  gender: 'Male',  // Optional
  address: '123 Street, City',  // Optional
  
  // Consent
  dataShareConsent: true,  // Given during booking
  consentDate: timestamp,
  
  // Access Control - WHO can see this patient
  authorizedClinics: ['clinic1', 'clinic2'],  // Clinics where patient booked
  authorizedDoctors: ['doctorA_uid', 'doctorB_uid'],  // Doctors who treated
  
  // Medical Profile (Shared across all authorized clinics)
  medicalHistory: {
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Diabetes', 'Hypertension'],
    medications: ['Metformin', 'Lisinopril'],
    bloodType: 'O+',
    emergencyContact: {
      name: 'Maria Dela Cruz',
      relationship: 'Wife',
      phone: '+63 917 987 6543'
    }
  },
  
  // Visit History (From ALL authorized clinics)
  visitHistory: [
    {
      visitId: 'visit1',
      clinicId: 'clinic1',
      clinicName: 'Zamboanga Dental',
      doctorId: 'doctorA_uid',
      doctorName: 'Dr. A',
      date: '2024-01-15',
      time: '10:00 AM',
      chiefComplaint: 'Toothache',
      diagnosis: 'Cavity on upper right molar',
      treatment: 'Filling',
      prescription: 'Pain reliever',
      notes: 'Patient has sensitive teeth',
      nextVisit: '2024-07-15',
      createdAt: timestamp
    },
    {
      visitId: 'visit2',
      clinicId: 'clinic2',
      clinicName: 'Manila Smile Center',
      doctorId: 'doctorB_uid',
      doctorName: 'Dr. B',
      date: '2024-02-20',
      time: '2:00 PM',
      chiefComplaint: 'Routine cleaning',
      diagnosis: 'Healthy',
      treatment: 'Prophylaxis',
      prescription: 'None',
      notes: 'Good oral hygiene',
      nextVisit: '2024-08-20',
      createdAt: timestamp
    }
  ],
  
  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp,
  lastBookingDate: timestamp,
  lastVisitDate: timestamp
}
```

### **Collection: `appointments` (Filtered by clinicId)**

```javascript
{
  id: 'apt123',
  
  // Patient Link (CRITICAL)
  patientId: 'patient_abc123',  // ← Links to patients collection
  
  // Clinic & Doctor
  clinicId: 'clinic1',
  clinicName: 'Zamboanga Dental',
  doctorId: 'doctorA_uid',
  doctorName: 'Dr. A',
  
  // Patient Info (Denormalized for quick access)
  patientName: 'Juan Dela Cruz',
  patientEmail: 'juan@email.com',
  patientPhone: '+63 917 123 4567',
  
  // Appointment Details
  date: '2024-01-15',
  time: '10:00 AM',
  service: 'Consultation',
  notes: 'Patient notes',
  status: 'booked',  // booked, approve, appointment, completed, cancelled, missed
  bookingReference: 'BK-20240115-ABC',
  
  // Visit Completion (After appointment)
  visitCompleted: false,
  chiefComplaint: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  doctorNotes: '',
  
  // Metadata
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🔄 **DATA FLOW**

### **1. Patient Books Appointment**

```
User fills booking form:
├── Name, Email, Phone
├── Selects Doctor
├── Selects Date/Time
├── Checks consent checkbox ✅
└── Submits

System checks:
├── Does patient exist? (by email)
│   ├── YES: Update patient record
│   │   ├── Add CLINIC_ID to authorizedClinics
│   │   ├── Add doctorId to authorizedDoctors
│   │   └── Update lastBookingDate
│   └── NO: Create new patient record
│       ├── Save basic info
│       ├── Set authorizedClinics: [CLINIC_ID]
│       ├── Set authorizedDoctors: [doctorId]
│       └── Initialize empty history
│
└── Create appointment with patientId link
```

### **2. Doctor Views Patients**

```
Doctor logs in:
├── Loads appointments where:
│   ├── clinicId == CLINIC_ID
│   └── doctorId == currentUser.uid
│
├── Extracts patientIds from appointments
│
├── Loads patient records:
│   └── WHERE id IN patientIds
│
└── Displays patients with:
    ├── Basic info
    ├── FULL visit history (all clinics)
    ├── All authorized doctors
    └── Complete medical records
```

### **3. Doctor Completes Visit**

```
After appointment:
├── Doctor adds visit notes
├── System creates visit record
├── Visit added to patient.visitHistory
└── Appointment marked as completed
```

---

## 🔐 **ACCESS CONTROL RULES**

### **Rule 1: Booking-Based Access**
```
Patient books at Clinic A with Dr. A:
✅ Dr. A can see patient data
✅ Clinic A has access
❌ Dr. B (Clinic B) CANNOT see data (patient never booked there)
```

### **Rule 2: Cross-Clinic Visibility**
```
Patient books at Clinic A, then Clinic B:
✅ Dr. A can see: Own notes + Dr. B's notes
✅ Dr. B can see: Dr. A's notes + Own notes
✅ Both see complete history
```

### **Rule 3: No Access Without Booking**
```
Patient never booked at Clinic C:
❌ Dr. C CANNOT see patient data
❌ No access until patient books there
```

---

## 💻 **IMPLEMENTATION STATUS**

### ✅ **COMPLETED:**

#### **1. booking.html**
- ✅ Added consent checkbox
- ✅ Patient record creation logic
- ✅ Existing patient update logic
- ✅ Appointment linking with patientId
- ✅ Access control (authorizedClinics, authorizedDoctors)

### ⏳ **IN PROGRESS:**

#### **2. doctor.html - Patient Database View**
- ⏳ Load patients from appointments
- ⏳ Display patient list with search
- ⏳ Show full visit history (all clinics)
- ⏳ Display authorized doctors
- ⏳ Add visit notes after appointment
- ⏳ Update patient medical history

#### **3. admin.html - Patient Database View**
- ⏳ Same as doctor.html but for all clinic doctors
- ⏳ View all patients who visited clinic
- ⏳ Complete history visibility

#### **4. staff.html - Limited Patient View**
- ⏳ View patients of assigned doctor only
- ⏳ Read-only access to history

---

## 📝 **QUERIES NEEDED**

### **Doctor Portal - Load My Patients:**
```javascript
// Get my appointments
const appointments = await db.collection('appointments')
  .where('clinicId', '==', CLINIC_ID)
  .where('doctorId', '==', currentUser.uid)
  .get();

// Extract unique patient IDs
const patientIds = [...new Set(
  appointments.docs.map(apt => apt.data().patientId)
)];

// Load patient records
const patients = await db.collection('patients')
  .where(firebase.firestore.FieldPath.documentId(), 'in', patientIds)
  .get();

// Each patient has FULL history from ALL clinics
```

### **View Patient Profile:**
```javascript
async function viewPatient(patientId) {
  const patient = await db.collection('patients').doc(patientId).get();
  const patientData = patient.data();
  
  // Display:
  // - Basic info
  // - Medical history
  // - Visit history (sorted by date, all clinics)
  // - Authorized doctors list
}
```

### **Add Visit Notes:**
```javascript
async function completeVisit(appointmentId, visitData) {
  // 1. Update appointment
  await db.collection('appointments').doc(appointmentId).update({
    visitCompleted: true,
    chiefComplaint: visitData.chiefComplaint,
    diagnosis: visitData.diagnosis,
    treatment: visitData.treatment,
    prescription: visitData.prescription,
    doctorNotes: visitData.notes
  });
  
  // 2. Add to patient visit history
  const appointment = await db.collection('appointments').doc(appointmentId).get();
  const aptData = appointment.data();
  
  await db.collection('patients').doc(aptData.patientId).update({
    visitHistory: firebase.firestore.FieldValue.arrayUnion({
      visitId: appointmentId,
      clinicId: aptData.clinicId,
      clinicName: aptData.clinicName,
      doctorId: aptData.doctorId,
      doctorName: aptData.doctorName,
      date: aptData.date,
      time: aptData.time,
      chiefComplaint: visitData.chiefComplaint,
      diagnosis: visitData.diagnosis,
      treatment: visitData.treatment,
      prescription: visitData.prescription,
      notes: visitData.notes,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }),
    lastVisitDate: firebase.firestore.FieldValue.serverTimestamp()
  });
}
```

---

## 🎯 **BENEFITS**

### **For Patients:**
✅ Medical history follows them across clinics
✅ No need to repeat medical history
✅ Better continuity of care
✅ All records in one place

### **For Doctors:**
✅ See complete patient history
✅ Know what other doctors did
✅ Better informed decisions
✅ Avoid duplicate treatments

### **For Clinics:**
✅ Better patient care
✅ Improved coordination
✅ Professional network
✅ Data-driven insights

---

## 🔒 **PRIVACY & COMPLIANCE**

### **Consent-Based:**
✅ Patient must check consent box
✅ Clear explanation of data sharing
✅ Opt-in model (not opt-out)

### **Access Control:**
✅ Only authorized clinics see data
✅ Only authorized doctors see data
✅ Access granted through booking only

### **Data Security:**
✅ Firebase security rules
✅ Encrypted connections
✅ Audit trail (timestamps)

---

## 📋 **NEXT STEPS**

1. ✅ Modify booking.html (DONE)
2. ⏳ Modify doctor.html - Add patient database view
3. ⏳ Modify admin.html - Add patient database view
4. ⏳ Modify staff.html - Add limited patient view
5. ⏳ Add visit completion form
6. ⏳ Add medical history editor
7. ⏳ Test with multiple clinics
8. ⏳ Deploy updates to 3 clinic repos

---

**Status:** Phase 1 Complete - Booking system ready
**Next:** Implement patient database views in portals
**ETA:** Continuing implementation now...
