import { NextResponse, NextRequest } from "next/server";

const allowedOrigins = ["http://localhost:3000"]; // apni origins add karo

export function withCORS(res: NextResponse, req: NextRequest): NextResponse {
  const origin = req.headers.get("origin");
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === "development")) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}
