import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: { type: [String], required: true },
    abilities: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Pokemon = mongoose.models.Pokemon || mongoose.model("Pokemon", pokemonSchema);
