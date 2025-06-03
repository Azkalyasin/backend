"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import axios from "axios";

type NewsWithoutId = {
  title: string;
  content: string;
  image: string;
};

const CreateNewsPage = () => {
  const router = useRouter();
  const [news, setNews] = useState<NewsWithoutId>({
    title: "",
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3000/api/news", news);
      router.push("/news");
    } catch (error) {
      setError("Failed to create news");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create News</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleForm} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <Input
            name="title"
            value={news.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Content</label>
          <Textarea
            name="content"
            value={news.content}
            onChange={handleInputChange}
            required
            rows={5}
          />
        </div>
        <div>
          <label className="block mb-2">Image URL</label>
          <Input
            name="image"
            value={news.image}
            onChange={handleInputChange}
            type="url"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create News"}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewsPage;