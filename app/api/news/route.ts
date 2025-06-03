import { NextResponse } from "next/server";
import { News } from "@/app/lib/models/News";
import connectionDb from "@/app/lib/db/ConnectionDb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    await connectionDb();
    const news = await News.find({});

    if (!news || news.length === 0) {
      return NextResponse.json({ message: "No news found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json(news, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    await connectionDb();
    const body = await request.json();

    if (!body || !body.title || !body.content || !body.image) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400, headers: corsHeaders });
    }

    const existingData = await News.findOne({ title: body.title });
    if (existingData) {
      return NextResponse.json({ message: "News with this title already exists" }, { status: 409, headers: corsHeaders });
    }

    const newNews = new News(body);
    await newNews.save();

    return NextResponse.json(newNews, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
