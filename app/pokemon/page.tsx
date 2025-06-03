"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pokemon } from "../types/pokemonTypes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PokemonPage = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`http://localhost:3000/api/pokemon/${id}`);
        setPokemons(pokemons.filter(pokemon => pokemon._id !== id));
      } catch (error) {
        console.error("Error deleting pokemon:", error);
        setError("Failed to delete Pokemon");
      }
    }
  };

  useEffect(() => {
    const getPokemons = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/pokemon");
        setPokemons(response.data);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
        setError("Failed to load Pokemon data");
      } finally {
        setLoading(false);
      }
    };
    getPokemons();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pokemon Collection</h1>
        <Button 
          onClick={() => router.push("/pokemon/create")}
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add New Pokemon
        </Button>
      </div>
      <Table>
        <TableCaption>List of Pokemon</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Abilities</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pokemons.map((pokemon) => (
            <TableRow key={pokemon._id}>
              <TableCell className="font-medium">{pokemon.name}</TableCell>
              <TableCell>{Array.isArray(pokemon.type) ? pokemon.type.join(", ") : pokemon.type}</TableCell>
              <TableCell>{Array.isArray(pokemon.abilities) ? pokemon.abilities.join(", ") : "No abilities"}</TableCell>
              <TableCell>
                <div className="relative w-24 h-24">
                  <Image 
                    src={pokemon.image} 
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png"; // Add a placeholder image
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  onClick={() => router.push(`/pokemon/${pokemon._id}/edit`)}
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDelete(pokemon._id, pokemon.name)}
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PokemonPage;