import { NextResponse } from "next/server";

export function errorResponse(error: any, status = 400) {
  return NextResponse.json({ error }, { status });
}
