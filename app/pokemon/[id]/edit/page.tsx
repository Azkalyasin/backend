"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";


interface Pokemon {
  _id: string;
  name: string;
  type: string[];
  abilities: string[];
  image: string;
}

const EditPokemonPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon>({
    _id: "",
    name: "",
    type: [],
    abilities: [],
    image: "",
  });

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/pokemon/${params.id}`
        );
        setPokemon(response.data);
      } catch (error) {
        console.error("Error fetching pokemon:", error);
        setError("Failed to load Pokemon");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPokemon();
    }
  }, [params.id]);

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

    try {
      await axios.put(`http://localhost:3000/api/pokemon/${pokemon._id}`, pokemon);
      router.push("/pokemon");
    } catch (error) {
      console.error("Error updating pokemon:", error);
      setError("Failed to update Pokemon");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Pokemon</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            name="name"
            value={pokemon.name}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Types (comma-separated)
          </label>
          <Input
            name="type"
            value={pokemon.type.join(", ")}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Abilities (comma-separated)
          </label>
          <Input
            name="abilities"
            value={pokemon.abilities.join(", ")}
            onChange={handleInputChange}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input
            name="image"
            value={pokemon.image}
            onChange={handleInputChange}
            type="url"
            className="w-full"
            required
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Pokemon"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPokemonPage;