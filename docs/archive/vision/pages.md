# Page Content & Requirements

## Site Structure

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Landing page, philosophy, vignettes |
| `/workshops` | Workshops | 3 workshop dates with registration |
| `/summer-camp` | Summer Camp | Week-long camp with registration |
| `/music-school` | Music School | Fall 2026 teaser + waitlist |
| `/about` | About | Philosophy, approach (migrate from current) |
| `/admin` | Admin Portal | Protected management area |

---

## Home Page (`/`)

### Hero Section

**Headline:** A new kind of music school.

**Subhead:** Where music takes root.

**Philosophy text:**
> Music isn't rules to memorize or a series of notes to play. It's something they already have, they already feel. We help them find it, nurture it, and grow it into something uniquely theirs.

### Vignettes Section

**Header:** What It Looks Like

Four vignettes showing the program in action (condensed versions):

#### 1. Main Street
A Saturday morning, outside a coffee shop. Kids spontaneously jam—hand drum, melodica, singing. A crowd forms. A stranger with a guitar asks to sit in. They don't know what they'll play until they play it. This isn't a performance. It's a way of being—spontaneous, creative, alive to the moment.

#### 2. The Concert
A cohort decides to do a show at the community center—not assigned, because they want to. They plan the arc, argue about it, try things, scrap ideas. Covers rearranged by ear, originals built from a melody someone's been humming. By show night, they know the material cold but leave room for a solo that's different every time. The concert is proof of what they've become.

#### 3. The Liturgy
Sunday morning at St. Luke's. Three kids play prelude, lead the circle song, accompany the anthem, play during communion. They've learned what a prelude is *for*—meeting the congregation and bringing them somewhere else. They read the room, not just the notes. After service: "That was beautiful. I didn't want it to end." She's twelve.

#### 4. The Long Game
A dorm common room, ten years later. Her friends quit music after high school—a checkbox on a college application. For her, music never stopped. She organizes jams, puts together pickup groups. She knows how to feel a groove, find a harmony, make something happen. "You should come play with us. It's not that hard." By semester's end, two friends have dusted off their instruments.

### CTAs
- Learn about our Workshops
- Summer Camp 2026
- Music School Fall 2026

---

## Workshops Page (`/workshops`)

### Overview

**The Path Forward intro:**
> We're building this in three phases. Phase 1: Workshops Spring 2026—a series of Friday evening workshops proving the model works on a small scale. Kids performing with professional musicians from day one, parents seeing immediate results.

### Workshop Details

| Detail | Value |
|--------|-------|
| **Time** | 3:30 PM – 7:30 PM |
| **Cost** | $75 (Tuition Assistance available) |
| **Ages** | 9–13 |
| **Location** | St. Luke's/San Lucas Episcopal Church, Vancouver, WA |

### Workshop Dates
1. **February 20, 2026** (Friday)
2. **March 20, 2026** (Friday)
3. **May 1, 2026** (Friday)

### Registration Form

**Payment options:**
- Pay now (Stripe/payment integration)
- Request tuition assistance
- Pay on/by the workshop date

**Form fields:**

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| Child's name | Yes | text | |
| Child's age | Yes | number | 9-13 validation |
| Parent/Guardian name | No | text | |
| Parent/Guardian email | Yes | email | |
| Parent/Guardian phone | No | tel | |
| Child's school | No | text | |
| Which workshop(s) | Yes | checkboxes | Feb 20, Mar 20, May 1 |
| How did you hear about us? | No | select/text | |
| What are you most excited about? | No | textarea | |
| Additional message | No | textarea | |
| Payment preference | Yes | radio | Pay now / Tuition assistance / Pay later |

---

## Summer Camp Page (`/summer-camp`)

### Details

| Detail | Value |
|--------|-------|
| **When** | June 22–27, 2026 (Mon–Fri) |
| **Time** | 8:30 AM – 5:00 PM · Lunch included |
| **Performance** | Sunday, June 29 · 9–11 AM |
| **Ages** | 9–13 |
| **Tuition** | $400 for the week |

### Content Needs
- What the week looks like
- Daily schedule overview
- What kids will learn/experience
- What to bring
- Drop-off/pickup info

### Registration Form

**Payment options:** Same as workshops (pay now, tuition assistance, pay later)

**Form fields:**

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| **Child Information** |
| Child's name | Yes | text | |
| Child's age | Yes | number | 9-13 |
| Child's grade | No | select | Rising 4th-8th |
| Child's school | No | text | |
| **Parent/Guardian** |
| Parent name | Yes | text | |
| Parent email | Yes | email | |
| Parent phone | Yes | tel | Required for camp |
| **Emergency Contact** |
| Emergency contact name | Yes | text | Someone other than parent |
| Emergency contact phone | Yes | tel | |
| Emergency contact relationship | No | text | |
| **Health & Safety** |
| Allergies | No | textarea | |
| Medical conditions/medications | No | textarea | |
| Special needs/accommodations | No | textarea | |
| **Other** |
| How did you hear about us? | No | select/text | |
| What are you most excited about? | No | textarea | |
| Additional message | No | textarea | |
| Payment preference | Yes | radio | |

---

## Music School Page (`/music-school`)

### Details

| Detail | Value |
|--------|-------|
| **When** | Fall 2026 |
| **Schedule** | 3 days/week, after school |
| **Status** | Coming soon – join the waitlist |

### Content
- Teaser text about the full after-school program
- What it will be (3 days/week immersive music education)
- Use existing program description from current site as basis
- Clear "Coming Fall 2026" messaging

### Waitlist Signup

Simple form to collect interest.

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| Parent/Guardian name | Yes | text | |
| Parent/Guardian email | Yes | email | |
| Child's name | No | text | |
| Child's current grade | No | select | To estimate Fall 2026 eligibility |
| Child's school | No | text | |
| Message/questions | No | textarea | |

---

## About Page (`/about`)

Migrate content from current static site:
- Origin story
- Philosophy/approach
- What makes this different
- (Future: instructor bios)

---

## Admin Requirements by Page

### Workshop Management
- View all registrations by workshop date
- See payment status (paid, assistance requested, pay later)
- Export roster per workshop
- Capacity tracking (if we set limits)

### Summer Camp Management
- View all registrations
- See payment status
- Export full roster with emergency/medical info
- Printable emergency contact sheets

### Music School Waitlist
- View all waitlist signups
- Export list
- (Future: convert to full applications when enrollment opens)
