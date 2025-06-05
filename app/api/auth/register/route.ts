import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectionDb from "@/lib/db/ConnectionDb";
import { User } from "@/lib/models/User";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    await connectionDb();
    const body = (await request.json()) as RegisterBody;

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (body.password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const newUser = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "user",
    });

    // Return only safe fields
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
