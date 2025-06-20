import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm/sql/expressions";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  const db = getDb();
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);
  if (!user[0]) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }
  const valid = await bcrypt.compare(password, user[0].passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }
  // For demo: return a simple session token (not secure for production)
  return NextResponse.json({ token: "admin-session" });
}
