# Faizan Academy — Project Handover Document

**Client:** Faizan Academy, Siddiqabad  
**Built with:** Next.js 14 (App Router) · Supabase (PostgreSQL) · Tailwind CSS · NextAuth.js  
**Handover date:** _Fill in when delivered_

---

## 1. Project Overview

A full school management website for Faizan Academy. It includes:

| Feature | Description |
|---|---|
| Public website | Home, About, Admissions, Contact, Fee Lookup |
| Fee Lookup | Student enters GR number → sees full fee statement + class |
| Online Payment Flow | Bank account shown on site → student sends WhatsApp screenshot → merchant marks as Paid |
| Admin Dashboard | Full control: students, fees, admissions, merchant accounts |
| Merchant Dashboard | Limited: only update fee payment status |

---

## 2. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend + Backend | Next.js 14 (App Router) | SSR for SEO, API routes for backend |
| Database | Supabase (PostgreSQL) | Free tier, real-time, easy setup |
| Auth | NextAuth.js (JWT) | Login for admin and merchants |
| Styling | Tailwind CSS | Utility-first, fast UI |
| Hosting | Vercel (recommended) | Free, zero-config Next.js deploy |

---

## 3. Folder Structure

```
faizan-academy/
├── app/
│   ├── page.tsx                    ← Home page
│   ├── about/page.tsx              ← About page
│   ├── admissions/page.tsx         ← Public admission form
│   ├── contact/page.tsx            ← Contact page
│   ├── fee-lookup/page.tsx         ← GR number fee lookup
│   ├── login/page.tsx              ← Staff login
│   ├── admin/
│   │   ├── page.tsx                ← Admin dashboard overview
│   │   ├── students/page.tsx       ← Add/edit/delete students
│   │   ├── fees/page.tsx           ← Manage fee records
│   │   ├── admissions/page.tsx     ← View & approve admission applications
│   │   └── merchants/page.tsx      ← Create merchants, toggle permissions
│   ├── merchant/page.tsx           ← Merchant fee update dashboard
│   └── api/
│       ├── auth/[...nextauth]/     ← NextAuth login handler
│       ├── fee-lookup/             ← Public GR lookup (no auth)
│       ├── students/               ← Admin: CRUD students
│       ├── fees/                   ← Admin + merchant: fee management
│       ├── admissions/             ← Public POST + admin GET/PUT
│       └── merchants/              ← Admin: create/manage merchants
├── components/
│   ├── Navbar.tsx                  ← Public navigation bar
│   ├── Footer.tsx                  ← Public footer
│   ├── DashboardLayout.tsx         ← Sidebar layout for dashboards
│   └── Providers.tsx               ← NextAuth session provider
├── lib/
│   ├── supabase.ts                 ← Supabase client instances
│   ├── auth.ts                     ← NextAuth configuration
│   └── types.ts                    ← TypeScript types + constants
├── database/
│   └── schema.sql                  ← Run this in Supabase to create tables
├── middleware.ts                   ← Route protection (admin/merchant)
├── .env.local                      ← Environment variables (DO NOT commit)
└── HANDOVER.md                     ← This file
```

---

## 4. Database Tables

### `students`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key (auto) |
| gr_number | VARCHAR | Unique, e.g. FA-001 |
| name | VARCHAR | Student full name |
| father_name | VARCHAR | Father's name |
| class | VARCHAR | 1–10, Hifz, or Nazra |
| phone | VARCHAR | Guardian phone |
| address | TEXT | Home address |
| status | VARCHAR | active / inactive |
| created_at | TIMESTAMPTZ | Auto |

### `fees`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| student_id | UUID | FK → students.id |
| month | INTEGER | 1–12 |
| year | INTEGER | e.g. 2025 |
| amount | DECIMAL | Fee amount in Rs. |
| status | VARCHAR | Paid / Pending / Partial |
| screenshot_url | TEXT | Optional payment proof |
| notes | TEXT | Optional notes |
| updated_by | UUID | Who last updated |
| updated_at | TIMESTAMPTZ | When last updated |

### `users` (admin + merchants)
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | VARCHAR | Login email |
| name | VARCHAR | Display name |
| password_hash | TEXT | bcrypt hash |
| role | VARCHAR | admin / merchant |
| can_update_fees | BOOLEAN | Admin can toggle this off |
| created_at | TIMESTAMPTZ | Auto |

### `admissions`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| student_name | VARCHAR | Applicant name |
| father_name | VARCHAR | Father's name |
| class_applying | VARCHAR | Requested class |
| phone | VARCHAR | Contact number |
| address | TEXT | Optional |
| dob | DATE | Optional |
| status | VARCHAR | pending / approved / rejected |
| notes | TEXT | Admin notes |
| created_at | TIMESTAMPTZ | Auto |

---

## 5. Setup Instructions (New Developer)

### Step 1 — Clone & Install
```bash
git clone <repo-url>
cd faizan-academy
npm install
```

### Step 2 — Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a region close to Pakistan (e.g. Singapore)
3. Go to **SQL Editor** → paste contents of `database/schema.sql` → Run

### Step 3 — Environment Variables
Copy `.env.local` and fill in real values:
```
NEXT_PUBLIC_SUPABASE_URL=         ← From Supabase Project Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=    ← From Supabase Project Settings > API
SUPABASE_SERVICE_ROLE_KEY=        ← From Supabase Project Settings > API
NEXTAUTH_SECRET=                  ← Any random 32-char string
NEXTAUTH_URL=                     ← http://localhost:3000 (dev) or https://yoursite.com (prod)
```

### Step 4 — Update School Info
In `.env.local`, fill in:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=      ← Real WhatsApp number
NEXT_PUBLIC_BANK_NAME=            ← Real bank name
NEXT_PUBLIC_BANK_ACCOUNT_TITLE=   ← Real account title
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=  ← Real account number
NEXT_PUBLIC_BANK_IBAN=            ← Real IBAN (optional)
```

Also update the hardcoded phone/bank details in:
- `components/Footer.tsx` (line ~35)
- `app/fee-lookup/page.tsx` (payment instructions section)
- `app/contact/page.tsx`

### Step 5 — Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

### Step 6 — First Admin Login
The schema seeds a default admin. **Change the password immediately!**
```
Email:    admin@faizanacademy.pk
Password: password
```
To change: go to Supabase → Table Editor → users → edit the row.

---

## 6. Deployment (Vercel — Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Repository
3. Add all environment variables from `.env.local` in Vercel settings
4. Deploy → done

For custom domain: add it in Vercel Project Settings → Domains.

---

## 7. User Roles

| Role | Access |
|---|---|
| **Admin** | Everything: students, fees, admissions, merchants |
| **Merchant** | Only: update fee payment status (can be disabled per merchant) |

Admin creates merchant accounts from `/admin/merchants` and can toggle their `can_update_fees` permission on/off anytime.

---

## 8. Payment Flow (How it Works)

```
1. Student opens /fee-lookup → enters GR number
2. Student sees fee statement (Pending/Paid/Partial)
3. Student sends bank transfer to the account shown
4. Student sends payment screenshot to WhatsApp number shown
5. Merchant logs in → /merchant → finds the student → changes status to Paid
6. Student refreshes fee lookup → sees Paid status
```

---

## 9. Classes Supported

| Type | Values |
|---|---|
| Academic | Class 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 |
| Islamic | Hifz, Nazra |

To add more classes, update the `CLASS_OPTIONS` array in `lib/types.ts` and the `CHECK` constraint in `database/schema.sql`.

---

## 10. Brand Colors

| Name | Hex | Used for |
|---|---|---|
| Primary Red | `#C0392B` | Buttons, accents, nav active |
| Secondary Green | `#1E6B1E` | Success, secondary buttons |
| Cream | `#F5E6C8` | Backgrounds, highlights |
| Dark | `#0D0D0D` | Navbar, footer, hero |

All colors are defined in `tailwind.config.ts` → theme → colors.

---

## 11. Social Media

| Platform | Link |
|---|---|
| Facebook | https://www.facebook.com/FaizanAcademy/ |
| Instagram | https://instagram.com/faizan_academy/ |

Updated in `components/Footer.tsx` and `app/contact/page.tsx`.

---

## 12. SEO

- Meta title/description set in `app/layout.tsx`
- Next.js SSR ensures pages are indexable by Google
- Update metadata in `app/layout.tsx` with real school address and phone for local SEO

---

## 13. Common Tasks

**Add a student:** Admin Dashboard → Students → Add Student  
**Add monthly fee:** Admin Dashboard → Fees → Add Fee Record (enter GR + month + amount)  
**Mark fee as paid:** Merchant Dashboard → find student → change status dropdown  
**Approve admission:** Admin Dashboard → Admissions → click ✓ or ✗  
**Add new merchant:** Admin Dashboard → Merchants → Add Merchant  

---

## 14. Contact (Original Developer)

Built by: _Your Name_  
WhatsApp: _Your Number_  
Email: _Your Email_
