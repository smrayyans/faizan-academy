-- Run this in Supabase SQL Editor

-- Students table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gr_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  father_name VARCHAR(100) NOT NULL,
  class VARCHAR(10) NOT NULL CHECK (class IN ('1','2','3','4','5','6','7','8','9','10','Hifz','Nazra')),
  phone VARCHAR(20),
  address TEXT,
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fees table
CREATE TABLE fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(10) DEFAULT 'Pending' CHECK (status IN ('Paid','Pending','Partial')),
  screenshot_url TEXT,
  notes TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, month, year)
);

-- Users table (admin + merchants)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) DEFAULT 'merchant' CHECK (role IN ('admin','merchant')),
  can_update_fees BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admissions table
CREATE TABLE admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  father_name VARCHAR(100) NOT NULL,
  class_applying VARCHAR(10) NOT NULL CHECK (class_applying IN ('1','2','3','4','5','6','7','8','9','10','Hifz','Nazra')),
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  dob DATE,
  status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Public can read students (for fee lookup) - only by gr_number
CREATE POLICY "Public fee lookup" ON students FOR SELECT USING (true);
CREATE POLICY "Public fee read" ON fees FOR SELECT USING (true);

-- Insert default admin (change password after setup)
-- Password: admin123 (bcrypt hash)
INSERT INTO users (email, name, password_hash, role, can_update_fees)
VALUES (
  'admin@faizanacademy.pk',
  'Admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
  'admin',
  true
);
