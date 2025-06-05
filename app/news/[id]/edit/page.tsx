"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { News } from "@/types/NewsType";

const EditNewsPage = () => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [news, setNews] = useState<News>({
    _id: "",
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/news/${params.id}`);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching News:", error);
        setError("Failed to load News");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNews();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await axios.put(`http://localhost:3000/api/news/${news._id}`, news);
      router.push("/news");
    } catch (error) {
      console.error("Error updating news:", error);
      setError("Failed to update news");
    } finally {
      setSubmitting(false);
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
      <h1 className="text-2xl font-bold mb-6">Edit News</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input name="title" value={news.title} onChange={handleInputChange} className="w-full" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Textarea name="content" value={news.content} onChange={handleInputChange} className="w-full min-h-[200px]" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input name="image" value={news.image} onChange={handleInputChange} type="url" className="w-full" required />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update News"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditNewsPage;
