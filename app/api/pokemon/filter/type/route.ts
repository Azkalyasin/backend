import { NextResponse } from "next/server";
import connectionDb from "@/app/lib/db/ConnectionDb";
import { Pokemon } from "@/app/lib/models/pokemon";

// Fungsi untuk menambahkan header CORS ke setiap respons
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Ganti '*' dengan domain frontend jika di production
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// GET handler
export async function GET(request: Request) {
  try {
    await connectionDb();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return withCORS(NextResponse.json({ message: "query is required" }, { status: 400 }));
    }

    const searchRegex = new RegExp(query, "i");

    // Cari berdasarkan tipe (case-insensitive)
    const pokemonByTypes = await Pokemon.find({
      type: { $regex: searchRegex },
    });

    if (pokemonByTypes.length === 0) {
      return withCORS(NextResponse.json({ message: "No Pokemon found with this type" }, { status: 404 }));
    }

    return withCORS(NextResponse.json(pokemonByTypes, { status: 200 }));
  } catch (error) {
    console.error("Filter error:", error);
    return withCORS(NextResponse.json({ message: "Internal Server Error" }, { status: 500 }));
  }
}

// Tangani preflight request
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
