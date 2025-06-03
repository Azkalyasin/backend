import { NextResponse } from "next/server";
import connectionDb from "@/app/lib/db/ConnectionDb";
import { Pokemon } from "@/app/lib/models/pokemon";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Ganti "*" dengan domain frontend kalau ingin lebih aman
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(request: Request) {
  try {
    await connectionDb();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return new NextResponse(
        JSON.stringify({ message: "Search query is required" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const searchRegex = new RegExp(query, "i");
    const pokemons = await Pokemon.find({ name: searchRegex });

    if (pokemons.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Pokemon tidak ada" }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return new NextResponse(JSON.stringify(pokemons), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Terdapat error di server" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Tambahan: Untuk handle preflight request dari browser (OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
