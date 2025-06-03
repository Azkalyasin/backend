import { NextResponse } from "next/server";
import connectionDb from "@/app/lib/db/ConnectionDb";
import { Pokemon } from "@/app/lib/models/pokemon";
import { ObjectId } from "mongodb";

// Helper untuk CORS
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// GET /api/pokemon/:id
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectionDb();

    if (!ObjectId.isValid(params.id)) {
      return withCORS(NextResponse.json({ error: "Invalid ID format" }, { status: 400 }));
    }

    const pokemon = await Pokemon.findById(params.id);

    if (!pokemon) {
      return withCORS(NextResponse.json({ message: "Pokemon not found" }, { status: 404 }));
    }

    return withCORS(NextResponse.json(pokemon, { status: 200 }));
  } catch (error) {
    console.error("Error fetching Pokemon:", error);
    return withCORS(NextResponse.json({ message: "Internal Server Error" }, { status: 500 }));
  }
}

// PUT /api/pokemon/:id
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectionDb();
    const body = await request.json();

    if (!ObjectId.isValid(params.id)) {
      return withCORS(NextResponse.json({ error: "Invalid ID format" }, { status: 400 }));
    }

    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        type: body.type,
        abilities: body.abilities,
        image: body.image,
      },
      { new: true }
    );

    if (!updatedPokemon) {
      return withCORS(NextResponse.json({ error: "Pokemon not found" }, { status: 404 }));
    }

    return withCORS(NextResponse.json({ message: "Pokemon updated successfully", pokemon: updatedPokemon }, { status: 200 }));
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error updating Pokemon:", err.message);
      return withCORS(NextResponse.json({ error: err.message }, { status: 500 }));
    }
    return withCORS(NextResponse.json({ error: "Unknown error occurred" }, { status: 500 }));
  }
}

// DELETE /api/pokemon/:id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectionDb();

    if (!ObjectId.isValid(params.id)) {
      return withCORS(NextResponse.json({ error: "Invalid ID format" }, { status: 400 }));
    }

    const deletedPokemon = await Pokemon.findByIdAndDelete(params.id);

    if (!deletedPokemon) {
      return withCORS(NextResponse.json({ error: "Pokemon not found" }, { status: 404 }));
    }

    return withCORS(NextResponse.json({ message: "Pokemon deleted successfully" }, { status: 200 }));
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error deleting Pokemon:", err.message);
      return withCORS(NextResponse.json({ error: err.message }, { status: 500 }));
    }
    return withCORS(NextResponse.json({ error: "Unknown error occurred" }, { status: 500 }));
  }
}

// OPTIONS handler (preflight request)
export async function OPTIONS() {
  return withCORS(new NextResponse(null, { status: 204 }));
}
