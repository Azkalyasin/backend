"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

type PokemonWithoutId = {
  name: string;
  type: string;
  abilities: string[];
  image: string;
};

const CreatePage = () => {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonWithoutId>({
    name: "",
    type: "",
    abilities: [""],
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "type" || name === "abilities") {
      setPokemon((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setPokemon((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3000/api/pokemon", pokemon);
      router.push("/pokemon");
      setPokemon({
        name: "",
        type: "",
        abilities: [""],
        image: "",
      });
      alert("Pokemon created successfully!");
    } catch (error) {
      setError("Failed to create Pokemon");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Pokemon</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <Input name="name" value={pokemon.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block mb-2">Types (comma-separated)</label>
          <Input name="type" value={Array.isArray(pokemon.type) ? pokemon.type.join(", ") : pokemon.type} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block mb-2">Abilities (comma-separated)</label>
          <Input name="abilities" value={pokemon.abilities.join(", ")} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block mb-2">Image URL</label>
          <Input name="image" value={pokemon.image} onChange={handleInputChange} type="url" required />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Pokemon"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePage;
