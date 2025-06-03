import { NextResponse } from "next/server";
import connectionDb from "@/app/lib/db/ConnectionDb";
import { Pokemon } from "@/app/lib/models/pokemon";

export async function GET(request: Request) {
  try {
    connectionDb();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ Message: "query is required" }, { status: 400 });
    }

    const searchRegex = new RegExp(query, "i");
    const pokemonByability = await Pokemon.find({ abilities: searchRegex });

    if (pokemonByability.length === 0) {
      return NextResponse.json({ message: "No Pokemon found with this type" }, { status: 404 });
    }

    return NextResponse.json(pokemonByability, { status: 200 });
  } catch (error) {
    console.error("Filter error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
