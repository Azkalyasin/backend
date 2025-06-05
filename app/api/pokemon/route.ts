import { NextResponse } from "next/server";
import connectionDb from "@/lib/db/ConnectionDb";
import { Pokemon } from "@/lib/models/pokemon";

// Untuk semua response, tambahkan CORS header
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function GET() {
  try {
    await connectionDb();
    const pokemons = await Pokemon.find({});
    if (!pokemons || pokemons.length === 0) {
      return withCORS(NextResponse.json({ message: "No Pokemons found" }, { status: 404 }));
    }

    return withCORS(NextResponse.json(pokemons, { status: 200 }));
  } catch (error) {
    console.error("Error fetching Pokemons:", error);
    return withCORS(NextResponse.json({ message: "Internal Server Error" }, { status: 500 }));
  }
}

export async function POST(request: Request) {
  try {
    await connectionDb();
    const data = await request.json();

    if (!data.name || !data.type || !data.abilities || !data.image) {
      return withCORS(NextResponse.json({ message: "All fields are required" }, { status: 400 }));
    }

    const existingData = await Pokemon.findOne({ name: data.name });
    if (existingData) {
      return withCORS(NextResponse.json({ message: "Pokemon with this name already exists" }, { status: 409 }));
    }

    const newPokemon = new Pokemon(data);
    await newPokemon.save();

    return withCORS(NextResponse.json(newPokemon, { status: 200 }));
  } catch (error) {
    console.error("Error creating Pokemon:", error);
    return withCORS(NextResponse.json({ message: "Internal Server Error" }, { status: 500 }));
  }
}

// Tangani preflight (OPTIONS)
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
