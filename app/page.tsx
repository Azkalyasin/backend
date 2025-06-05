
import { Pokemon } from "../types/pokemonTypes";
import { News } from "@/types/NewsType";

async function getStats() {
  try {
    const pokemonRes = await fetch("http://localhost:3000/api/pokemon", { cache: "no-store" });
    const newsRes = await fetch("http://localhost:3000/api/news", { cache: "no-store" });

    const pokemon: Pokemon[] = await pokemonRes.json();
    const news: News[] = await newsRes.json();

    return {
      pokemonCount: pokemon.length,
      newsCount: news.length,
      typeCount: [...new Set(pokemon.flatMap((p) => p.type))].length,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { pokemonCount: 0, newsCount: 0, typeCount: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">Pokemon World</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">Discover the fascinating world of Pokemon, explore their abilities, and stay updated with the latest news.</p>
        </div>

        {/* Stats Section with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.pokemonCount}</div>
              <div className="text-gray-600">Pokemon Collection</div>
            </div>
          </div>
          <div className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.typeCount}</div>
              <div className="text-gray-600">Unique Types</div>
            </div>
          </div>
          <div className="transform hover:scale-105 transition-all duration-300">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100">
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.newsCount}</div>
              <div className="text-gray-600">Latest Articles</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
