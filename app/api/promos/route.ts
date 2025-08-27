import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Promo } from "@/models/promos";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://frontend-rho-jet-76.vercel.app",
  "https://book-website-rho-sooty.vercel.app",
];

// Handles CORS headers for all responses
function withCORS(req: NextRequest, res: NextResponse): NextResponse {
  const origin = req.headers.get("origin");
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// Handles preflight CORS requests
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return withCORS(req, response);
}

// POST (Create/Update) a promo image
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    if (!data.promoImageUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required field: promoImageUrl" },
        { status: 400 }
      );
    }
    
    let promo = await Promo.findOne();
    if (promo) {
      promo.promoImageUrl = data.promoImageUrl;
      await promo.save();
    } else {
      promo = new Promo({ promoImageUrl: data.promoImageUrl });
      await promo.save();
    }
    
    const response = NextResponse.json(
      { success: true, message: "Promo image saved successfully.", data: promo },
      { status: 201 }
    );
    return withCORS(req, response);
  } catch (error: any) {
    console.error("POST Error:", error);
    const response = NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
    return withCORS(req, response);
  }
}

// GET all promo images
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const promos = await Promo.find({});
    const response = NextResponse.json({ success: true, data: promos }, { status: 200 });
    return withCORS(req, response);
  } catch (error: any) {
    console.error("GET Error:", error);
    const response = NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
    return withCORS(req, response);
  }
}

// PUT (Update) a promo image by ID
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "ID missing." }, { status: 400 });
    }

    const updatedPromo = await Promo.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPromo) {
      return NextResponse.json({ success: false, message: "Promo not found." }, { status: 404 });
    }

    const response = NextResponse.json(
      { success: true, message: "Promo updated successfully.", data: updatedPromo },
      { status: 200 }
    );
    return withCORS(req, response);
  } catch (error: any) {
    console.error("PUT Error:", error);
    const response = NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
    return withCORS(req, response);
  }
}

// DELETE a promo image by ID
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID missing." }, { status: 400 });
    }

    const deletedPromo = await Promo.findByIdAndDelete(id);
    if (!deletedPromo) {
      return NextResponse.json({ success: false, message: "Promo not found." }, { status: 404 });
    }

    const response = NextResponse.json(
      { success: true, message: "Promo deleted successfully." },
      { status: 200 }
    );
    return withCORS(req, response);
  } catch (error: any) {
    console.error("DELETE Error:", error);
    const response = NextResponse.json(
      { success: false, message: "Server error.", error: error.message },
      { status: 500 }
    );
    return withCORS(req, response);
  }
}