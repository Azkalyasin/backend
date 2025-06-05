import { NextResponse } from "next/server";
import connectionDb from "@/lib/db/ConnectionDb";
import { News } from "@/lib/models/News";
import { ObjectId } from "mongodb";

interface NewsUpdateBody {
  title: string;
  content: string;
  image: string;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectionDb();

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ Message: "object id is not valid" }, { status: 400 });
    }

    const findById = await News.findById(params.id);

    if (!findById) {
      return NextResponse.json({ Message: "cant find news" }, { status: 404 });
    }

    return NextResponse.json(findById, { status: 200 });
  } catch (error) {
    console.error("Error fetching news: ", error);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectionDb();
    const body = (await request.json()) as NewsUpdateBody;

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid object ID" }, { status: 400 });
    }

    if (!body.title || !body.content || !body.image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const updateNews = await News.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        content: body.content,
        image: body.image,
      },
      { new: true }
    );

    if (!updateNews) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "News updated successfully",
        data: updateNews.toObject(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectionDb();

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ Message: "object id is not valid" }, { status: 400 });
    }

    const deleteNew = await News.findByIdAndDelete(params.id);

    if (!deleteNew) {
      return NextResponse.json({ message: "dont have data with this id" }, { status: 404 });
    }

    return NextResponse.json({ message: "berhasil menghapus data" }, { status: 200 });
  } catch (error) {
    console.error("error to fatch", error);
    return NextResponse.json({ Message: "internal server error" }, { status: 500 });
  }
}
