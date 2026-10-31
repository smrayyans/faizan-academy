export type ClassType =
  | "1" | "2" | "3" | "4" | "5"
  | "6" | "7" | "8" | "9" | "10"
  | "Hifz" | "Nazra";

export type FeeStatus = "Paid" | "Pending" | "Partial";

export type UserRole = "admin" | "merchant";

export interface Student {
  id: string;
  gr_number: string;
  name: string;
  father_name: string;
  class: ClassType;
  phone: string;
  address: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Fee {
  id: string;
  student_id: string;
  month: number;
  year: number;
  amount: number;
  status: FeeStatus;
  screenshot_url?: string;
  notes?: string;
  updated_by?: string;
  updated_at: string;
  student?: Student;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  can_update_fees: boolean;
  created_at: string;
}

export interface Admission {
  id: string;
  student_name: string;
  father_name: string;
  class_applying: ClassType;
  phone: string;
  address: string;
  dob: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  created_at: string;
}

export const CLASS_OPTIONS: ClassType[] = [
  "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10",
  "Hifz", "Nazra",
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
