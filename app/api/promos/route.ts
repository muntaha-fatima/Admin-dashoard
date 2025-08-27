import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Promo } from "@/models/promos";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://frontend-rho-jet-76.vercel.app",
  "https://book-website-rho-sooty.vercel.app"
];

function withCORS(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("origin") || "";

  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS(req: NextRequest) {
  return withCORS(req, NextResponse.json({}, { status: 200 }));
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const promos = await Promo.find({});
  const res = NextResponse.json(promos, { status: 200 });
  return withCORS(req, res);
}


// 📌 UPDATE Promo
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID missing" },
        { status: 400 }
      );
    }

    const updatedPromo = await Promo.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPromo) {
      return NextResponse.json(
        { success: false, message: "Promo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Promo updated", data: updatedPromo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 📌 DELETE Promo
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID missing" },
        { status: 400 }
      );
    }

    const deletedPromo = await Promo.findByIdAndDelete(id);
    if (!deletedPromo) {
      return NextResponse.json(
        { success: false, message: "Promo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Promo deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
