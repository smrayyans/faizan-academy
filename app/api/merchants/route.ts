import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return null;
  return session;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, email, name, role, can_update_fees, created_at")
    .order("created_at", { ascending: false });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, password, can_update_fees } = await req.json();
  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabaseAdmin.from("users").insert({
    name, email, password_hash, role: "merchant", can_update_fees: can_update_fees ?? true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, can_update_fees } = await req.json();
  const { error } = await supabaseAdmin.from("users").update({ can_update_fees }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
