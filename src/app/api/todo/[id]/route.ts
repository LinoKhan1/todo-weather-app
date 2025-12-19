import { NextResponse } from "next/server";
import { updateTodo, deleteTodo } from "@/src/data/todo";

interface Params {
  params: { id: string };
}

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
