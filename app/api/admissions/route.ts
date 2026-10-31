import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: admissions } = await supabaseAdmin
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ admissions });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { student_name, father_name, class_applying, phone, address, dob } = body;

  if (!student_name || !father_name || !class_applying || !phone) {
    return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("admissions").insert({
    student_name, father_name, class_applying, phone, address, dob: dob || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, notes } = await req.json();
  const { error } = await supabaseAdmin
    .from("admissions")
    .update({ status, notes })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
