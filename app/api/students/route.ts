import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("search") ?? "";

  let query = supabaseAdmin.from("students").select("*").order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,gr_number.ilike.%${search}%,father_name.ilike.%${search}%`);
  }

  const { data: students, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ students });
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gr_number, name, father_name, class: cls, phone, address } = await req.json();

  if (!gr_number || !name || !father_name || !cls) {
    return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("students").insert({
    gr_number: gr_number.trim().toUpperCase(), name, father_name, class: cls, phone, address,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, gr_number, name, father_name, class: cls, phone, address } = await req.json();

  const { error } = await supabaseAdmin.from("students").update({
    gr_number: gr_number.trim().toUpperCase(), name, father_name, class: cls, phone, address,
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required." }, { status: 400 });

  const { error } = await supabaseAdmin.from("students").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
