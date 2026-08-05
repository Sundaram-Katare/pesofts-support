import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Seed endpoint deactivated." });
}
export async function POST() {
  return NextResponse.json({ message: "Seed endpoint deactivated." });
}
