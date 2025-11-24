# 🏥 CLINIC TEMPLATE BUILD PLAN

## 📋 **OVERVIEW**

Create a reusable clinic template based on GHL clinic design that can be deployed for each individual clinic with CLINIC_ID filtering for complete data isolation.

---

## 🎯 **DESIGN REFERENCE**

**Source:** `d:\Codes\clinic\New clinic now\GHL\`

**Files to adapt:**
- `index.html` → Clinic homepage/landing
- `login.html` → Staff login (Admin/Doctor/Staff)
- `doctor.html` → Doctor portal with kanban
- `staff.html` → Staff portal
- `superadmin.html` → Use as Admin portal (clinic admin)

---

## 📁 **CLINIC TEMPLATE STRUCTURE**

```
/clinic-template
├── config.js                    # ← CLINIC_ID configuration
├── index.html                   # Clinic homepage
├── booking.html                 # Patient booking (filtered)
├── login.html                   # Staff login
├── admin.html                   # Clinic Admin portal
├── doctor.html                  # Doctor portal
└── staff.html                   # Staff portal
```

---

## 🔧 **KEY MODIFICATION: CLINIC_ID FILTERING**

### **config.js** (New file)
```javascript
// CLINIC CONFIGURATION
// Change this for each clinic deployment
const CLINIC_ID = 'CHANGE_ME';  // e.g., 'downtown-dental'
const CLINIC_NAME = 'CHANGE_ME'; // e.g., 'Downtown Dental Clinic'
```

### **All Files Must:**
1. Import `config.js`
2. Filter ALL Firebase queries by `CLINIC_ID`
3. Check user's `clinicId` matches `CLINIC_ID`
4. Prevent cross-clinic data access

---

## 📄 **FILE-BY-FILE PLAN**

### **1. config.js** (NEW)
```
Purpose: Store clinic-specific configuration
Contents:
- CLINIC_ID constant
- CLINIC_NAME constant
- (Optional) Clinic branding colors
```

---

### **2. index.html** (Clinic Homepage)
```
Based on: GHL index.html
Features:
- Clinic branding
- About section
- Services showcase
- Team (doctors) showcase
- Contact information
- "Book Appointment" CTA → booking.html
- "Staff Login" link → login.html

Modifications:
- Use CLINIC_NAME for branding
- Show only THIS clinic's doctors
- Show only THIS clinic's services
```

---

### **3. booking.html** (Patient Booking)
```
Based on: Current mighteeth/booking.html
Features:
- Select doctor (from THIS clinic only)
- Select service
- Select date/time
- Patient information form
- Booking confirmation

CRITICAL CHANGES:
✅ Import config.js
✅ Filter doctors by CLINIC_ID:
   db.collection('users')
     .where('role', '==', 'doctor')
     .where('clinicId', '==', CLINIC_ID)  // ← ADD THIS

✅ Save appointment with clinicId:
   appointmentData = {
     ...
     clinicId: CLINIC_ID,  // ← ADD THIS
     ...
   }

✅ GHL integration (kanban tags)
```

---

### **4. login.html** (Staff Login)
```
Based on: GHL login.html
Features:
- Email/password login
- Role detection (admin/doctor/staff)
- Redirect based on role

CRITICAL CHANGES:
✅ Import config.js
✅ After login, check user's clinicId:
   if (userData.clinicId !== CLINIC_ID) {
     alert('You do not have access to this clinic');
     logout();
     return;
   }

✅ Redirect based on role:
   - admin → admin.html
   - doctor → doctor.html
   - staff → staff.html
```

---

### **5. admin.html** (Clinic Admin Portal)
```
Based on: GHL superadmin.html (adapted for single clinic)
Sections:
1. Dashboard
   - Clinic stats (doctors, staff, appointments)
   - Recent appointments

2. Kanban Board
   - Drag & drop appointments
   - 6 stages: Booked → Approve → Appointment → Completed → Cancelled → Missed
   - GHL integration (update tags on drag)

3. Doctors Management
   - Add/Edit/Delete doctors
   - Assign to THIS clinic only

4. Staff Management
   - Add/Edit/Delete staff
   - Assign to THIS clinic only

5. Services Management
   - Add/Edit/Delete services
   - Clinic-specific services

6. Patients View
   - View patients who visited THIS clinic
   - Patient history

7. Analytics
   - Clinic performance metrics
   - Appointment statistics

CRITICAL CHANGES:
✅ Import config.js
✅ ALL queries filtered by CLINIC_ID:
   - Doctors: .where('clinicId', '==', CLINIC_ID)
   - Staff: .where('clinicId', '==', CLINIC_ID)
   - Appointments: .where('clinicId', '==', CLINIC_ID)
   - Services: .where('clinicId', '==', CLINIC_ID)

✅ When creating users (doctors/staff):
   userData = {
     ...
     clinicId: CLINIC_ID,  // ← ADD THIS
     ...
   }

✅ Remove multi-clinic features
✅ Remove "All Clinics" filters
```

---

### **6. doctor.html** (Doctor Portal)
```
Based on: GHL doctor.html
Sections:
1. Dashboard
   - Personal stats
   - Today's appointments

2. Kanban Board
   - Personal appointments only
   - Drag & drop with GHL integration

3. Patients Database
   - Patients who visited THIS doctor

4. Services
   - Doctor's personal services
   - Can add/edit own services

5. Working Hours
   - Set availability schedule

6. Analytics
   - Personal performance metrics

CRITICAL CHANGES:
✅ Import config.js
✅ Filter appointments by CLINIC_ID AND doctorId:
   db.collection('appointments')
     .where('clinicId', '==', CLINIC_ID)
     .where('doctorId', '==', currentUser.uid)

✅ Verify user belongs to THIS clinic:
   if (currentUser.clinicId !== CLINIC_ID) {
     alert('Access denied');
     logout();
   }

✅ GHL integration for kanban
```

---

### **7. staff.html** (Staff Portal)
```
Based on: GHL staff.html
Sections:
1. Dashboard
   - Assigned doctor's stats
   - Today's appointments

2. Doctor Selection
   - Select which doctor to assist

3. Kanban Board
   - Assigned doctor's appointments
   - Drag & drop with GHL integration

CRITICAL CHANGES:
✅ Import config.js
✅ Filter doctors by CLINIC_ID:
   db.collection('users')
     .where('role', '==', 'doctor')
     .where('clinicId', '==', CLINIC_ID)

✅ Filter appointments by CLINIC_ID AND assignedDoctorId:
   db.collection('appointments')
     .where('clinicId', '==', CLINIC_ID)
     .where('doctorId', '==', assignedDoctorId)

✅ Verify user belongs to THIS clinic
```

---

## 🔐 **SECURITY CHECKLIST**

For EVERY file:

### **1. Import config.js**
```html
<script src="config.js"></script>
```

### **2. Authentication Check**
```javascript
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  const userDoc = await db.collection('users').doc(user.uid).get();
  const userData = userDoc.data();
  
  // CHECK CLINIC ACCESS
  if (userData.clinicId !== CLINIC_ID) {
    alert('You do not have access to this clinic');
    await auth.signOut();
    window.location.href = 'login.html';
    return;
  }
  
  currentUser = { uid: user.uid, ...userData };
  loadDashboard();
});
```

### **3. ALL Firebase Queries**
```javascript
// ALWAYS filter by CLINIC_ID
db.collection('appointments')
  .where('clinicId', '==', CLINIC_ID)  // ← REQUIRED
  .get()

db.collection('users')
  .where('role', '==', 'doctor')
  .where('clinicId', '==', CLINIC_ID)  // ← REQUIRED
  .get()
```

### **4. Creating New Documents**
```javascript
// ALWAYS include clinicId
await db.collection('appointments').add({
  ...appointmentData,
  clinicId: CLINIC_ID,  // ← REQUIRED
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

await db.collection('users').add({
  ...userData,
  clinicId: CLINIC_ID,  // ← REQUIRED
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
```

---

## 🎨 **BRANDING CUSTOMIZATION**

Each clinic can customize:

### **In config.js:**
```javascript
const CLINIC_ID = 'downtown-dental';
const CLINIC_NAME = 'Downtown Dental Clinic';
const CLINIC_LOGO = 'assets/logo.png';
const CLINIC_PRIMARY_COLOR = '#0066cc';
const CLINIC_SECONDARY_COLOR = '#00cc66';
```

### **In index.html:**
- Replace clinic name
- Replace logo
- Update contact information
- Customize about section
- Update team photos

---

## 📊 **DATA FLOW**

```
Patient Books Appointment (booking.html)
    ↓
Appointment created with clinicId: 'downtown-dental'
    ↓
Saved to Firebase appointments collection
    ↓
GHL contact created/updated
    ↓
Appointment appears in:
    - Admin kanban (admin.html) ← Filtered by CLINIC_ID
    - Doctor kanban (doctor.html) ← Filtered by CLINIC_ID + doctorId
    - Staff kanban (staff.html) ← Filtered by CLINIC_ID + assignedDoctorId
    ↓
Super Admin sees it in:
    - Corporate dashboard ← Can see ALL clinics
    - Patient Database ← Cross-clinic tracking
```

---

## 🚀 **DEPLOYMENT PROCESS**

### **For Each New Clinic:**

1. **Copy Template**
   ```
   cp -r clinic-template downtown-dental/
   ```

2. **Update config.js**
   ```javascript
   const CLINIC_ID = 'downtown-dental';
   const CLINIC_NAME = 'Downtown Dental Clinic';
   ```

3. **Customize Branding**
   - Update index.html with clinic info
   - Replace logo
   - Update colors (optional)

4. **Create Clinic in Super Admin**
   - Login to corporate/superadmin.html
   - Add new clinic: "Downtown Dental"
   - Clinic ID: "downtown-dental"

5. **Create Clinic Admin**
   - Add admin user
   - Email: admin@downtown-dental.com
   - Role: admin
   - Clinic ID: downtown-dental

6. **Deploy to Domain**
   - www.downtown-dental.com
   - or downtown.mighteeth.com (subdomain)

7. **Test**
   - Admin login
   - Create test doctor
   - Create test appointment
   - Verify data isolation

---

## ✅ **TESTING CHECKLIST**

### **Data Isolation:**
- [ ] Admin can ONLY see their clinic's data
- [ ] Doctor can ONLY see their clinic's appointments
- [ ] Staff can ONLY see their clinic's doctors
- [ ] Booking shows ONLY clinic's doctors
- [ ] No cross-clinic data leakage

### **Functionality:**
- [ ] Patient booking works
- [ ] Kanban drag & drop works
- [ ] GHL integration works
- [ ] Doctor can manage services
- [ ] Admin can create doctors/staff
- [ ] Staff can select assigned doctor

### **Security:**
- [ ] Users from other clinics cannot login
- [ ] All queries filtered by CLINIC_ID
- [ ] Authentication checks work
- [ ] Logout works properly

---

## 📝 **NEXT STEPS**

1. ✅ Create config.js template
2. ⏳ Build booking.html with filtering
3. ⏳ Build login.html with clinic check
4. ⏳ Build admin.html (from GHL superadmin)
5. ⏳ Build doctor.html (from GHL doctor)
6. ⏳ Build staff.html (from GHL staff)
7. ⏳ Build index.html (clinic homepage)
8. ⏳ Test with 3 clinics
9. ⏳ Deploy and verify

---

**Ready to build the clinic template!** 🚀
