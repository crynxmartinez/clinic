# MighTeeth - Dental Booking System

A complete dental clinic booking system with Firebase backend, designed for GoHighLevel (GHL) compatibility.

## 🚀 Features

### Landing Page (`landing.html`)
- Modern, responsive design
- Hero section with call-to-action
- About section (Vision, Mission, Values)
- Dynamic services grid loaded from Firebase
- Contact information for 2 branches
- Social media integration
- Mobile-friendly navigation

### Booking Page (`booking.html`)
- **4-Step Booking Process:**
  1. Select Date (Calendar view)
  2. Choose Doctor (Shows only available doctors)
  3. Pick Time (Shows only available slots)
  4. Confirm Details (Patient information form)
- Real-time availability checking
- Prevents double-booking
- Automatic booking reference generation
- Firebase Firestore integration
- Mobile-responsive design

### Admin Dashboard (`admin.html`)
- **Authentication:** Username: `admin` / Password: `admin`
- **Dashboard Overview:**
  - Statistics (Total, Pending, Confirmed, Completed)
  - Recent appointments list
- **Appointments Management:**
  - View all appointments
  - Filter by status, date, search
  - Update appointment status
  - View appointment details
  - Delete appointments
- **Doctors Management:**
  - Add new doctors
  - Set working days and hours
  - Configure lunch breaks
  - Set slot duration
  - Activate/deactivate doctors
  - Delete doctors
- **Services Management:**
  - Add new services
  - Set service duration
  - Choose Font Awesome icons
  - Activate/deactivate services
  - Delete services
- **Branches Management:**
  - Add new branches
  - Multiple phone numbers support
  - Activate/deactivate branches
  - Delete branches

## 📋 Prerequisites

1. **Firebase Project** (Already created)
   - Project ID: `clinic-a17bc`
   - Project Name: `clinic`

2. **Firebase Services Required:**
   - Firestore Database
   - Authentication (Anonymous)

## 🔧 Setup Instructions

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `clinic-a17bc`
3. Click **Firestore Database** in the left menu
4. Click **Create Database**
5. Choose **Start in production mode**
6. Select your region (closest to Riyadh: `asia-south1` or `europe-west1`)
7. Click **Enable**

### Step 2: Configure Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Copy the contents of `firestore.rules` file
3. Paste into the Firebase Console Rules editor
4. Click **Publish**

**Rules Summary:**
```
- Doctors, Services, Branches: Public read, Admin write
- Appointments: Anyone can create, Admin can read/update/delete
- Blocked Slots: Admin only
```

### Step 3: Enable Firebase Authentication

1. Go to **Authentication** in Firebase Console
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Anonymous** authentication
5. Click **Save**

### Step 4: Deploy Your Files

#### Option A: Use as-is (Recommended for GHL)
Simply copy the HTML files to your GoHighLevel pages:
- `landing.html` → GHL Landing Page
- `booking.html` → GHL Booking Page
- `admin.html` → GHL Admin Page (or host separately)

#### Option B: Host on Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project folder
firebase init hosting

# Select your project: clinic-a17bc
# Set public directory: . (current directory)
# Configure as single-page app: No
# Don't overwrite files

# Deploy
firebase deploy --only hosting
```

Your site will be live at: `https://clinic-a17bc.web.app`

#### Option C: Host on any web server
Upload all HTML files to your web server. No build process required!

## 📱 Usage Guide

### For Patients (Booking Flow)

1. **Visit Landing Page**
   - Browse services
   - Click "Book Now"

2. **Select Date**
   - Choose from available dates (green highlighted)
   - Unavailable dates are grayed out

3. **Choose Doctor**
   - See only doctors available on selected date
   - View doctor details (specialty, experience, branch)

4. **Pick Time**
   - See available time slots (green)
   - Booked slots shown as gray

5. **Fill Details**
   - Enter name, phone, email
   - Select service
   - Add optional notes
   - Confirm booking

6. **Receive Confirmation**
   - Get booking reference number
   - Clinic will contact within 24 hours

### For Admin (Dashboard)

1. **Login**
   - Go to `admin.html`
   - Username: `admin`
   - Password: `admin`

2. **First Time Setup**
   - Add Doctors (with schedules)
   - Add Services
   - Add Branches

3. **Manage Appointments**
   - View all bookings
   - Update status (Pending → Confirmed → Completed)
   - Filter and search
   - Delete if needed

4. **Daily Workflow**
   - Check dashboard for new appointments
   - Call patients to confirm
   - Update appointment status
   - Mark as completed after visit

## 🗄️ Database Structure

### Collections

#### `doctors`
```javascript
{
  name: "Dr. Abdullah Al-Aubthani",
  specialty: "Dentist",
  experience: "23 years",
  branch: "Olaya",
  workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  workingHours: {
    start: "09:00",
    end: "20:00",
    lunchBreak: { start: "13:00", end: "14:00" }
  },
  slotDuration: 60,
  active: true
}
```

#### `appointments`
```javascript
{
  doctorId: "abc123",
  doctorName: "Dr. Abdullah Al-Aubthani",
  patientName: "Ahmed Ali",
  phone: "0501234567",
  email: "ahmed@example.com",
  date: "2025-10-15",
  time: "10:00 AM",
  branch: "Olaya",
  service: "Dental Implants",
  notes: "First visit",
  status: "pending",
  bookingReference: "TB-20251002-001",
  createdAt: timestamp
}
```

#### `services`
```javascript
{
  name: "Dental Implants",
  description: "Professional dental implant service",
  duration: 60,
  icon: "fa-tooth",
  active: true
}
```

#### `branches`
```javascript
{
  name: "Olaya Branch",
  address: "King Fahd District - Olaya General Street",
  phone: ["0558768414", "0114560649"],
  email: "olaya@mighteeth.com",
  active: true
}
```

## 🎨 Customization

### Change Colors
Edit the Tailwind config in each HTML file:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',    // Change this
        secondary: '#00cc66',  // Change this
        accent: '#ff6b6b',     // Change this
      }
    }
  }
}
```

### Change Clinic Name
Search and replace "MighTeeth" with your clinic name in all files.

### Add More Services
Use the Admin Dashboard → Services → Add Service

### Modify Working Hours
Use the Admin Dashboard → Doctors → Edit Doctor

## 🔐 Security Notes

1. **Admin Password:** Change the hardcoded `admin/admin` credentials in production
2. **Firestore Rules:** Already configured for security
3. **API Keys:** Firebase API keys are safe to expose (they're restricted by domain)
4. **Authentication:** Consider adding proper Firebase Auth for admin panel

## 📞 Contact Information

**MighTeeth**
- Email: info@mighteeth.com
- Olaya Branch: 0558768414 / 0114560649
- Prince Nayef Branch: 0569691057 / 0114546541

## 🛠️ Troubleshooting

### Booking page shows "No doctors available"
- Make sure you've added doctors in the Admin Dashboard
- Check that doctors have working days configured
- Verify doctors are set to "Active"

### Services not showing on landing page
- Add services via Admin Dashboard
- Make sure services are set to "Active"
- Check browser console for errors

### Can't login to admin
- Verify credentials: `admin` / `admin`
- Check that Firebase Authentication is enabled
- Check browser console for errors

### Appointments not saving
- Verify Firestore is enabled
- Check Firestore security rules are published
- Check browser console for errors

## 📄 Files Included

```
clinic/
├── landing.html          - Main landing page
├── booking.html          - Calendar-based booking system
├── admin.html            - Admin dashboard
├── firestore.rules       - Firestore security rules
└── README.md             - This file
```

## 🚀 Next Steps

1. **Enable Firestore Database** (Required)
2. **Set Firestore Security Rules** (Required)
3. **Enable Anonymous Authentication** (Required)
4. **Login to Admin Dashboard** (`admin.html`)
5. **Add Your First Doctor**
6. **Add Services**
7. **Add Branches**
8. **Test Booking Flow**
9. **Deploy to GHL or Firebase Hosting**

## 💡 Tips

- **Test thoroughly** before going live
- **Add real doctor photos** by modifying the doctor cards
- **Set up email notifications** using Firebase Cloud Functions
- **Integrate with GHL** by sending booking data to GHL webhooks
- **Add WhatsApp integration** for instant booking confirmations
- **Monitor Firestore usage** to stay within free tier limits

## 📊 Firebase Free Tier Limits

- **Firestore:** 50,000 reads/day, 20,000 writes/day
- **Authentication:** Unlimited
- **Hosting:** 10 GB storage, 360 MB/day transfer

Perfect for small to medium clinics!

## 🎯 Future Enhancements

- Email/SMS notifications via Cloud Functions
- Patient portal for viewing appointment history
- Online payment integration
- Multi-language support (Arabic/English toggle)
- Calendar sync (Google Calendar, iCal)
- Automated reminders
- Patient reviews and ratings
- Doctor availability calendar view
- Reporting and analytics

## 📝 License

This project is created for MighTeeth. Modify as needed for your use case.

---

**Built with ❤️ using Firebase, Tailwind CSS, and Vanilla JavaScript**

For support, contact your developer or refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
