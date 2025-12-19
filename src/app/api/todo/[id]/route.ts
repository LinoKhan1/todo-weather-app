import { NextResponse } from "next/server";
import { updateTodo, deleteTodo } from "@/src/data/todo";

interface Params {
  params: { id: string };
}

/**
 * PATCH /api/todo/:id
 * Updates a todo item by its ID.
 * Expects a JSON body with `title` and/or `completed`.
 * Returns 404 if the todo does not exist.
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const updated = updateTodo(params.id, body);

    if (!updated) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(`PATCH /api/todo/${params.id} error:`, err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/**
 * DELETE /api/todo/:id
 * Deletes a todo item by its ID.
 * Returns 404 if the todo does not exist.
 */
export async function DELETE(req: Request, { params }: Params) {
  try {
    const deleted = deleteTodo(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/todo/${params.id} error:`, err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
