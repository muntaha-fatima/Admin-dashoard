import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Promo } from "@/models/promos";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://frontend-rho-jet-76.vercel.app",
  "https://book-website-rho-sooty.vercel.app",
];

function getAllowOrigin(origin: string | null) {
  if (!origin) return "";
  if (process.env.NODE_ENV === "development") return origin;
  if (allowedOrigins.includes(origin)) return origin;
  return "";
}

function withCORS(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get("origin");
  const allowOrigin = getAllowOrigin(origin);
  if (allowOrigin) {
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Vary", "Origin");
  }
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// ✅ Helper: Convert relative URL to absolute
function makeAbsoluteUrl(url: string | undefined, req: NextRequest) {
  if (!url || url.trim() === "") return "";
  if (url.startsWith("http")) return url;
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}${url.startsWith("/") ? url : "/" + url}`;
}

// CORS preflight
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return withCORS(req, response);
}

// 📌 POST (Create/Update) Promo
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.promoImageUrl?.trim()) {
      return withCORS(req, NextResponse.json({ success: false, message: "Missing promoImageUrl" }, { status: 400 }));
    }

    const absoluteUrl = makeAbsoluteUrl(data.promoImageUrl, req);

    let promo = await Promo.findOne();
    if (promo) {
      promo.promoImageUrl = absoluteUrl;
      await promo.save();
    } else {
      promo = new Promo({ promoImageUrl: absoluteUrl });
      await promo.save();
    }

    return withCORS(req, NextResponse.json({ success: true, message: "Promo saved", data: promo }, { status: 201 }));
  } catch (error: any) {
    console.error("POST Error:", error);
    return withCORS(req, NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 }));
  }
}

// 📌 GET all Promos
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const promos = await Promo.find({});

    const promosWithAbsoluteUrls = promos.map(p => ({
      ...p.toObject(),
      promoImageUrl: makeAbsoluteUrl(p.promoImageUrl, req),
    }));

    return withCORS(req, NextResponse.json({ success: true, data: promosWithAbsoluteUrls }, { status: 200 }));
  } catch (error: any) {
    console.error("GET Error:", error);
    return withCORS(req, NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 }));
  }
}

// 📌 PUT (Update) Promo by ID
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) return withCORS(req, NextResponse.json({ success: false, message: "ID missing" }, { status: 400 }));
    if (data.promoImageUrl) data.promoImageUrl = makeAbsoluteUrl(data.promoImageUrl, req);

    const updatedPromo = await Promo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updatedPromo) return withCORS(req, NextResponse.json({ success: false, message: "Promo not found" }, { status: 404 }));

    return withCORS(req, NextResponse.json({ success: true, message: "Promo updated", data: updatedPromo }, { status: 200 }));
  } catch (error: any) {
    console.error("PUT Error:", error);
    return withCORS(req, NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 }));
  }
}

// 📌 DELETE Promo by ID
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return withCORS(req, NextResponse.json({ success: false, message: "ID missing" }, { status: 400 }));

    const deletedPromo = await Promo.findByIdAndDelete(id);
    if (!deletedPromo) return withCORS(req, NextResponse.json({ success: false, message: "Promo not found" }, { status: 404 }));

    return withCORS(req, NextResponse.json({ success: true, message: "Promo deleted successfully" }, { status: 200 }));
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return withCORS(req, NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 }));
  }
}
