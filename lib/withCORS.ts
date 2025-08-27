import { NextResponse, NextRequest } from "next/server";

export function withCORS(res: NextResponse, req: NextRequest) {
  const origin = req.headers.get("origin");

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://frontend-rho-jet-76.vercel.app",
    "https://book-website-rho-sooty.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}
