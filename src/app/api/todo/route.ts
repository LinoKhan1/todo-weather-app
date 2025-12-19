import { NextResponse } from "next/server";
import { getTodos, addTodo } from "@/src/data/todo";

/**
 * GET /api/todo
 * Retrieves all todos from the in-memory store.
 */
export async function GET() {
  const todos = getTodos();
  return NextResponse.json(todos);
}

/**
 * POST /api/todo
 * Adds a new todo item.
 * Expects a JSON body with a `title` field.
 * Returns 400 if `title` is missing or request is invalid.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTodo = addTodo(body.title);

    // Return the newly created todo with 201 status
    return NextResponse.json(newTodo, { status: 201 });
  } catch (err) {
    console.error("POST /api/todo error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
