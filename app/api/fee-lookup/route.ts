import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const gr = req.nextUrl.searchParams.get("gr");
  if (!gr) return NextResponse.json({ error: "GR number required." }, { status: 400 });

  const { data: student, error } = await supabaseAdmin
    .from("students")
    .select("*")
    .eq("gr_number", gr.trim().toUpperCase())
    .single();

  if (error || !student) {
    return NextResponse.json({ error: "Student not found. Please check your GR number." }, { status: 404 });
  }

  const { data: fees } = await supabaseAdmin
    .from("fees")
    .select("*")
    .eq("student_id", student.id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  return NextResponse.json({ student, fees: fees ?? [] });
}
