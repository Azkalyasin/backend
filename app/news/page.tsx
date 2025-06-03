"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { News } from "../types/NewsType";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

    const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        await axios.delete(`http://localhost:3000/api/news/${id}`);
        setNews(news.filter(news => news._id !== id));
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  useEffect(() => {
    const getPokemons = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/news");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to load news data");
      } finally {
        setLoading(false);
      }
    };
    getPokemons();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">News</h1>
        <Button onClick={() => router.push("/news/create")} className="bg-blue-500 text-white hover:bg-blue-600">
          Add New News
        </Button>
      </div>
      <Table>
        <TableCaption>List of News</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((news) => (
            <TableRow key={news._id}>
              <TableCell>{news.title}</TableCell>
              <TableCell>{news.content}</TableCell>
              <TableCell>
                <Image src={news.image} alt={news.title} width={100} height={100} />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => router.push(`/news/${news._id}/edit`)}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Edit
                </Button>
                <Button className="ml-2 bg-red-500 text-white hover:bg-red-600" onClick={() => handleDelete(news._id, news.title)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NewsPage;
