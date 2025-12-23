# Payment Flow Design

## Constraint
The church payment platform **cannot redirect back** to our site after payment. We must design around this.

## Recommended Solution: New Tab + Clear Instructions

### User Flow

```
1. User fills out registration form
2. User submits form
3. Form saves to database (status: pending, payment_status: unpaid)
4. Success page appears with:
   - Registration confirmation
   - Summary of children, workshops, total due
   - Big "Pay Now" button
   - Clear instructions
5. User clicks "Pay Now"
6. Church payment opens in NEW TAB
7. User completes payment on church site
8. User closes church tab, returns to our confirmation page
9. Our page says "Once you've paid, you're all set!"
```

### Success Page Design

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ✓ Registration Submitted!                              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  REGISTRATION SUMMARY                                   │
│  ────────────────────                                   │
│  Workshop: February 20, 2026                            │
│  Workshop: March 20, 2026                               │
│                                                         │
│  Children:                                              │
│    • Emma (age 10) - $75 × 2 = $150                    │
│    • Jack (age 8) - $65 × 2 = $130                     │
│                                                         │
│  Total Due: $280                                        │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  NEXT STEP: COMPLETE PAYMENT                            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │     [ Pay Now - $280 ]  ← Opens in new tab     │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  The payment page will open in a new tab.               │
│  After completing payment, you can close that tab.      │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  WHAT HAPPENS NEXT                                      │
│                                                         │
│  1. You'll receive a confirmation email shortly         │
│  2. Complete payment using the button above             │
│  3. We'll send a reminder email before the workshop     │
│                                                         │
│  Questions? Email jack@creativekidsmusic.org            │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  [ Return to Home ]                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Alternative Payment Options on Same Page

```
PAYMENT OPTIONS
───────────────

○ Pay Now ($280)
  Opens church payment page in new tab

○ Request Tuition Assistance
  We'll review your request and be in touch

○ Pay Later
  You can pay anytime before the workshop
  We'll send payment reminders
```

If user selects "Pay Now":
- Opens church payment URL in new tab: `window.open(churchPaymentUrl, '_blank')`
- Our page stays open

If user selects "Tuition Assistance":
- Shows textarea for explanation
- Submits with `tuition_assistance: true`
- Admin reviews and contacts family

If user selects "Pay Later":
- Submits with `payment_status: 'unpaid'`
- Confirmation email includes payment link
- Scheduled reminders sent

---

## Church Payment URL

**Current status:** Placeholder (TBD)

When ready, the URL format will likely be something like:
- `https://church-platform.com/pay`
- May support amount parameter: `?amount=280`
- May support reference: `?ref=CKM-{registration_id}`

We'll update when you have the actual URL.

---

## Admin Workflow

When you receive payment confirmation email from church:

1. Log into admin dashboard
2. Go to Workshop Registrations (or Camp)
3. Find the family by name or email
4. Click "Mark as Paid"
5. Optionally add payment notes (check #, date, etc.)

The system will:
- Update `payment_status` to 'paid'
- Set `payment_date` to now
- Log the action in activity log
- (Future: send "payment received" email to parent)

---

## Email Flow

### Confirmation Email (Immediate)

```
Subject: Creative Kids Music - Registration Confirmed

Hi [Parent Name],

Thank you for registering for Creative Kids Music!

REGISTRATION DETAILS
────────────────────
[Child 1] - [Workshop dates]
[Child 2] - [Workshop dates]

Total: $280

COMPLETE YOUR PAYMENT
─────────────────────
[Pay Now Button] ← Links to church payment

If you requested tuition assistance, we'll be in touch soon.

Questions? Reply to this email.
```

### Payment Reminder (7 days before)

```
Subject: Payment Reminder - [Workshop] on [Date]

Hi [Parent Name],

Just a reminder that your registration for [Workshop]
on [Date] is not yet paid.

Amount due: $280

[Pay Now Button]

If you've already paid, please disregard this email.
```

---

## Edge Cases

### User closes browser before paying
- No problem - registration is saved
- Confirmation email has payment link
- Reminders will be sent

### User pays wrong amount
- Admin sees amount mismatch
- Admin contacts family directly
- Can mark as "partial" payment

### User pays for wrong thing
- Admin reconciles manually
- Church payment likely has family name

### Duplicate payment
- Admin handles with church
- Can mark in payment_notes

---

## Future Enhancement

If church platform ever provides:
- **Webhook**: Auto-update payment status
- **Redirect URL**: Add `?return_url=oursite.com/payment-complete`
- **Payment reference**: Pass registration ID for easy matching

For now, manual process is fine for this scale (tens to low hundreds of registrations).
