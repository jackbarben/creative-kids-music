# Email System

Documentation for the transactional email system.

---

## Overview

The email system uses [Resend](https://resend.com) to send confirmation emails to parents and notification emails to administrators when registrations are submitted.

### Key Principles
- **Non-blocking**: Emails are sent asynchronously; form submission completes immediately
- **Logged**: All email attempts are recorded in the `email_log` table
- **Graceful failure**: If email fails, registration still succeeds

---

## Configuration

### Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxxx
```

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Add domain `creativekidsmusic.org`
3. Add DNS records (SPF, DKIM) to verify domain
4. Create API key with sending permissions
5. Add key to `.env.local`

---

## Email Types

### Parent Confirmation Emails

| Email | Trigger | Template |
|-------|---------|----------|
| Workshop Confirmation | Workshop registration | Green header, workshop dates, payment info |
| Camp Confirmation | Camp registration | Orange header, camp dates, emergency contact |
| Waitlist Confirmation | Music school signup | Gray header, next steps |

### Admin Notifications

All registrations trigger an admin notification to `jack@creativekidsmusic.org` with:
- Parent name and email
- Number of children
- Tuition assistance flag (highlighted if requested)
- Link to admin detail page

---

## Architecture

### File Structure

```
lib/
  email.ts          # All email functions and templates
```

### Email Service (`lib/email.ts`)

```typescript
// Configuration
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'Creative Kids Music <noreply@creativekidsmusic.org>'
const ADMIN_EMAIL = 'jack@creativekidsmusic.org'

// Functions
sendWorkshopConfirmation(data)   // Workshop registration confirmed
sendCampConfirmation(data)       // Camp registration confirmed
sendWaitlistConfirmation(data)   // Waitlist signup confirmed
sendAdminNotification(data)      // Admin alert for any registration
logEmail(...)                    // Internal: logs to database
```

### Return Type

All email functions return:

```typescript
type EmailResult = {
  success: boolean
  id?: string      // Resend message ID
  error?: string   // Error message if failed
}
```

---

## Email Templates

All emails use inline HTML styles for email client compatibility.

### Workshop Confirmation

```
Subject: Workshop Registration Confirmed

- Green accent color (#166534)
- Lists children and ages
- Workshop dates (bulleted list)
- Time: 3:30 – 7:30 PM
- Location: St. Luke's/San Lucas Episcopal Church
- Payment information based on selection
```

### Camp Confirmation

```
Subject: Summer Camp Registration Confirmed

- Orange accent color (#c2410c)
- Camp dates: June 22–28, 2026
- Time: Monday–Friday, 8:30 AM – 5:00 PM
- Lists children and ages
- Emergency contact confirmation
- Payment information
```

### Waitlist Confirmation

```
Subject: You're on the Music School Waitlist

- Gray accent color (#44403c)
- Thanks for interest
- Will be notified when registration opens
- Mentions workshops/camp as alternative
```

### Admin Notification

```
Subject: New [Type] Registration: [Parent Name]

- Green header
- Tuition assistance warning if requested
- Parent name, email, children count
- "View in Admin" button linking to detail page
```

---

## Integration

### Form Actions

Each registration form action sends emails after successful database insert:

```typescript
// Don't await - fire and forget
Promise.all([
  sendConfirmation({ ... }),
  sendAdminNotification({ ... }),
]).catch(console.error)

// Redirect happens immediately
redirect('/[program]/thank-you')
```

### Why Promise.all Without Await?

1. **User experience**: Parent sees thank-you page immediately
2. **Reliability**: Registration is saved even if email fails
3. **Error handling**: Failures are logged but don't break flow

---

## Email Logging

All emails are logged to the `email_log` table:

| Column | Description |
|--------|-------------|
| `id` | UUID |
| `recipient_email` | Email address |
| `email_type` | `workshop_confirmation`, `camp_confirmation`, etc. |
| `subject` | Email subject line |
| `entity_type` | `workshop_registration`, `camp_registration`, `waitlist_signup` |
| `entity_id` | Registration UUID |
| `status` | `sent` or `failed` |
| `provider_id` | Resend message ID |
| `created_at` | Timestamp |

---

## Troubleshooting

### Emails Not Sending

1. Check `RESEND_API_KEY` is set in `.env.local`
2. Verify domain is verified in Resend dashboard
3. Check `email_log` table for `failed` status entries
4. Check server logs for error messages

### Emails Going to Spam

1. Ensure SPF/DKIM records are properly configured
2. Use consistent "from" address
3. Avoid spam trigger words in subject

### Testing

In development, Resend will send real emails. For testing:
1. Use your own email address as the parent email
2. Check Resend dashboard for delivery status
3. View `email_log` table in Supabase

---

## Future Enhancements

Potential improvements for later phases:

- [ ] Email templates as React components (react-email)
- [ ] Retry logic for failed emails
- [ ] Unsubscribe management
- [ ] Email preference settings
- [ ] Bulk email for announcements
