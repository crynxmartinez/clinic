# Patient Activity Logs API Documentation

## Overview

The `patientLogs` collection in Firebase Firestore stores a comprehensive audit trail of all changes made to patient profiles. This enables tracking of who made changes, what was changed, and from which source (doctor portal, admin portal, superadmin, or external API).

## Collection: `patientLogs`

### Document Structure

```javascript
{
  patientId: string,        // Required - Firestore document ID of the patient
  action: string,           // Required - Human-readable action description
  category: string,         // Required - Category of the change
  details: string,          // Required - Specific details about the change
  previousValue: any,       // Optional - Value before the change (null if new)
  newValue: any,            // Optional - Value after the change (null if deleted)
  changedBy: {
    userId: string,         // Required - ID of the user making the change
    name: string,           // Required - Display name of the user
    role: string,           // Required - Role (doctor, admin, superadmin, api_user)
    clinicId: string|null,  // Optional - Clinic ID if applicable
    clinicName: string|null // Optional - Clinic name if applicable
  },
  source: string,           // Required - Source of the change
  timestamp: Timestamp      // Required - Server timestamp
}
```

### Categories

| Category | Description |
|----------|-------------|
| `medical_history` | Allergies, medications, conditions, vitals |
| `dental_chart` | Tooth conditions and notes |
| `treatment_plan` | Treatment plans and procedures |
| `blood_profile` | Blood type, donations, BP readings, sugar readings |
| `files` | X-rays, photos, documents, insurance files |
| `profile` | Basic patient info (name, contact, etc.) |
| `appointment` | Appointment-related changes |

### Sources

| Source | Description |
|--------|-------------|
| `doctor_portal` | Changes made from clinic doctor portal |
| `admin_portal` | Changes made from clinic admin portal |
| `superadmin` | Changes made from corporate superadmin |
| `api` | Changes made via external API |
| `patient_form` | Changes made via patient self-service forms |

## API Integration Guide

### Writing a Log Entry

When your API modifies patient data, you **MUST** also write a corresponding log entry.

#### Example: Adding an Allergy via API

```javascript
// 1. Update the patient document
await db.collection('patients').doc(patientId).update({
  'medicalHistory.allergies': firebase.firestore.FieldValue.arrayUnion('Penicillin'),
  'medicalHistory.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
});

// 2. Write the log entry
await db.collection('patientLogs').add({
  patientId: patientId,
  action: 'Added Allergy',
  category: 'medical_history',
  details: 'Penicillin',
  previousValue: null,
  newValue: 'Penicillin',
  changedBy: {
    userId: 'api_user_123',           // Your API user ID
    name: 'External Health App',       // Your app/service name
    role: 'api_user',
    clinicId: null,
    clinicName: null
  },
  source: 'api',
  timestamp: firebase.firestore.FieldValue.serverTimestamp()
});
```

### Reading Log Entries

#### Get All Logs for a Patient

```javascript
const logsSnap = await db.collection('patientLogs')
  .where('patientId', '==', patientId)
  .orderBy('timestamp', 'desc')
  .limit(100)
  .get();

const logs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

#### Filter by Category

```javascript
const medicalLogs = await db.collection('patientLogs')
  .where('patientId', '==', patientId)
  .where('category', '==', 'medical_history')
  .orderBy('timestamp', 'desc')
  .get();
```

#### Filter by Source

```javascript
const apiLogs = await db.collection('patientLogs')
  .where('patientId', '==', patientId)
  .where('source', '==', 'api')
  .orderBy('timestamp', 'desc')
  .get();
```

## Firestore Indexes Required

The following composite indexes are required for optimal query performance:

```
Collection: patientLogs
Fields: patientId (Ascending), timestamp (Descending)

Collection: patientLogs
Fields: patientId (Ascending), category (Ascending), timestamp (Descending)

Collection: patientLogs
Fields: patientId (Ascending), source (Ascending), timestamp (Descending)
```

## Standard Action Names

Use these standardized action names for consistency:

### Medical History
- `Added Allergy`
- `Removed Allergy`
- `Added Medication`
- `Removed Medication`
- `Updated Medical History`

### Dental Chart
- `Updated Dental Chart`

### Treatment Plans
- `Created Treatment Plan`
- `Added Procedure`
- `Updated Procedure Status`
- `Deleted Procedure`
- `Completed Treatment Plan`
- `Reopened Treatment Plan`
- `Deleted Treatment Plan`

### Blood Profile
- `Updated Blood Profile`
- `Added Blood Donation`
- `Added Blood Pressure Reading`
- `Added Blood Sugar Reading`

### Files
- `Uploaded File`
- `Deleted File`

### Profile
- `Updated Patient Profile`
- `Created Patient`

## Best Practices

1. **Always log changes** - Every patient data modification should have a corresponding log entry
2. **Use server timestamps** - Always use `firebase.firestore.FieldValue.serverTimestamp()` for consistency
3. **Include previous values** - When updating existing data, capture the previous value for audit purposes
4. **Be descriptive** - The `details` field should be human-readable and provide context
5. **Don't fail on log errors** - Logging failures should not break the main operation; wrap in try-catch
6. **Batch operations** - For bulk updates, consider batching log writes for performance

## Security Rules

Ensure your Firestore security rules allow:
- Authenticated users to write to `patientLogs`
- Read access based on user role and clinic association
- No deletion of log entries (audit trail integrity)

```javascript
match /patientLogs/{logId} {
  allow create: if request.auth != null;
  allow read: if request.auth != null && (
    request.auth.token.role == 'superadmin' ||
    // Add your clinic-based access rules here
  );
  allow update, delete: if false; // Logs are immutable
}
```

## Contact

For questions about API integration, contact the development team.
