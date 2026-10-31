import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gr = req.nextUrl.searchParams.get("gr") ?? "";
  const status = req.nextUrl.searchParams.get("status");

  let query = supabaseAdmin
    .from("fees")
    .select("*, student:students(*)")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (gr) {
    const { data: student } = await supabaseAdmin
      .from("students").select("id").eq("gr_number", gr.toUpperCase()).single();
    if (student) query = query.eq("student_id", student.id);
  }

  if (status) query = query.eq("status", status);

  const { data: fees, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ fees });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gr_number, month, year, amount, status, notes } = await req.json();

  const { data: student } = await supabaseAdmin
    .from("students").select("id").eq("gr_number", gr_number.toUpperCase()).single();

  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const { error } = await supabaseAdmin.from("fees").insert({
    student_id: student.id, month: parseInt(month), year: parseInt(year),
    amount: parseFloat(amount), status: status ?? "Pending", notes,
    updated_by: (session.user as any).id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as any;
  if (user.role !== "admin" && !user.can_update_fees) {
    return NextResponse.json({ error: "You do not have permission to update fees." }, { status: 403 });
  }

  const { id, status, notes } = await req.json();

  const { error } = await supabaseAdmin.from("fees").update({
    status, notes, updated_by: user.id, updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
