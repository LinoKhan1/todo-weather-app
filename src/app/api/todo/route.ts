import { NextResponse } from "next/server";
import { getTodos, addTodo } from "@/src/data/todo";

export async function GET() {
  const todos = getTodos();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTodo = addTodo(body.title);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (err) {
    console.error("POST /api/todo error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
