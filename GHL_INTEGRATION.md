# GoHighLevel (GHL) Integration - MighTeeth

## Overview
This document describes the GoHighLevel API integration added to the MighTeeth dental booking system. The integration automatically syncs patient contacts and appointment data with your GHL account.

## Integration Points

### 1. Booking Page (`booking.html`)
**When a patient books an appointment:**
- Creates/updates contact in GHL
- Adds tags: `Patient`, `New Booking`
- Syncs custom fields:
  - `appointment_date`
  - `appointment_time`
  - `doctor_name`
  - `branch`
  - `service`
  - `booking_reference`

### 2. Admin Dashboard (`admin.html`)
**When admin updates appointment status:**
- Updates GHL contact with new status tag
- Syncs all appointment details to custom fields
- Tag mapping:
  - `pending` → `Appointment Pending`
  - `confirmed` → `Appointment Confirmed`
  - `completed` → `Appointment Completed`
  - `cancelled` → `Appointment Cancelled`

## API Configuration

### Current Settings
```javascript
const GHL_API_KEY = 'pit-5b612d16-1609-43c6-a669-322e9197a9a9';
const GHL_LOCATION_ID = 'xzA6eU8kOYmBuwFdr3CF';
const GHL_API_BASE_URL = 'https://services.leadconnectorhq.com';
```

### API Version
- Using GHL API v2 (Version: 2021-07-28)
- Endpoint: `/contacts/upsert`

## Features

### Contact Upsert Function
The `upsertGHLContact()` function:
- Creates new contacts or updates existing ones (based on email/phone)
- Splits full name into firstName and lastName
- Handles errors gracefully (logs but doesn't break booking flow)
- Returns contact data on success, null on failure

### Data Synced to GHL

#### Patient Information
- Name (split into first/last)
- Email
- Phone number

#### Tags
- `Patient` (all patients)
- `New Booking` (on initial booking)
- Status tags (when status changes):
  - `Appointment Pending`
  - `Appointment Confirmed`
  - `Appointment Completed`
  - `Appointment Cancelled`

#### Custom Fields
All appointments sync these fields:
- `appointment_status`
- `appointment_date`
- `appointment_time`
- `doctor_name`
- `branch`
- `service`
- `booking_reference`

## Workflow

### Patient Booking Flow
1. Patient fills booking form
2. Appointment saved to Firebase
3. **GHL API called** → Contact created/updated with booking details
4. Success message shown to patient

### Admin Status Update Flow
1. Admin changes appointment status
2. Firebase updated
3. **GHL API called** → Contact updated with new status tag
4. Dashboard refreshed

## Error Handling
- All GHL API calls wrapped in try-catch
- Errors logged to console
- Booking/status updates continue even if GHL sync fails
- No user-facing errors for GHL failures (silent fallback)

## Testing Checklist

### Booking Page
- [ ] Book new appointment → Check GHL for new contact
- [ ] Verify tags: `Patient`, `New Booking`
- [ ] Verify custom fields populated
- [ ] Test with existing patient (should update, not duplicate)

### Admin Dashboard
- [ ] Change status to Confirmed → Check tag added
- [ ] Change status to Completed → Check tag updated
- [ ] Change status to Cancelled → Check tag updated
- [ ] Verify custom fields stay synced

## Troubleshooting

### Common Issues

**Contact not appearing in GHL:**
- Check browser console for API errors
- Verify API key is valid
- Ensure location ID is correct
- Check email/phone format

**Duplicate contacts:**
- GHL matches by email OR phone
- Ensure consistent formatting
- Check for typos in patient data

**Tags not updating:**
- Verify tag names match exactly
- Check GHL location has tags enabled
- Review console logs for errors

### Debug Mode
Open browser console to see:
- `Upserting GHL Contact:` - Payload being sent
- `GHL Contact Upserted Successfully:` - Response data
- `GHL API Error:` - Any API errors
- `Error upserting GHL contact:` - Network/other errors

## API Limits
- GHL API has rate limits (check your plan)
- Current implementation: 1 API call per booking
- Status updates: 1 API call per status change
- No batching implemented

## Security Notes
- API key is client-side (visible in browser)
- GHL API keys should be restricted by domain
- Consider server-side implementation for production
- Current setup is for MVP/testing

## Future Enhancements
- [ ] Add webhook support for two-way sync
- [ ] Implement server-side API calls (more secure)
- [ ] Add batch operations for bulk updates
- [ ] Create GHL automation workflows
- [ ] Add SMS/Email notifications via GHL
- [ ] Sync doctor availability to GHL calendar

## Files Modified
1. `booking.html` - Added GHL integration on booking submission
2. `admin.html` - Added GHL integration on status updates

## Code Locations

### booking.html
- **Lines 330-378:** GHL API configuration and helper function
- **Lines 720-754:** GHL contact creation on booking

### admin.html
- **Lines 331-387:** GHL API configuration and helper function
- **Lines 579-638:** GHL contact update on status change

## Support
For GHL API documentation: https://highlevel.stoplight.io/docs/integrations/
For issues with this integration, check browser console logs first.

---
**Last Updated:** November 2024
**Integration Version:** 1.0
**GHL API Version:** v2 (2021-07-28)
