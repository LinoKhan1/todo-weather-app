"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { PiTrashSimple } from "react-icons/pi";

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  // Fetch todos from API on mount
  useEffect(() => {
    fetch("/api/todo")
      .then((res) => res.json())
      .then((data: TodoItem[]) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch todos:", err);
        setLoading(false);
      });
  }, []);

  const visibleTodos = hideCompleted
    ? todos.filter((todo) => !todo.completed)
    : todos;

  // Add new todo
  const handleAdd = async () => {
    if (!newTodo.trim()) return;

    try {
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      const data: TodoItem = await res.json();
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // Toggle completed
  const toggleCompleted = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    const current = todos.find((t) => t.id === id);
    fetch(`/api/todo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !current?.completed }),
    }).catch((err) => console.error("Failed to update todo:", err));
  };

  // Delete todo
  const deleteTodoItem = async (id: string) => {
    try {
      await fetch(`/api/todo/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  // Finish editing a todo
  const handleFinishEditing = async (id: string) => {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }

    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: editingText } : t))
    );
    setEditingId(null);

    try {
      await fetch(`/api/todo/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingText }),
      });
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  if (loading) return <p className="text-center mt-40">Loading todos...</p>;

  return (
    <section className="mt-25 md:mt-40 max-w-4xl mx-6.25 md:mx-auto space-y-6">
      {/* Input form */}
      <form
        className="flex rounded-[50px] bg-cream overflow-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          type="text"
          className="flex-1 px-6 py-3 rounded-l-[50px] focus:outline-none input-text"
          placeholder="What do you need to do?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="px-4 py-2 button-primary cursor-pointer rounded-r-[50px] font-semibold">
          ADD
        </button>
      </form>

      {/* Hide completed */}
      <div className="text-right px-6">
        <span
          className="text-hide-completed cursor-pointer"
          onClick={() => setHideCompleted(!hideCompleted)}
        >
          Hide Completed
        </span>
      </div>

      {/* Todo list */}
      <ul className="space-y-2 bg-[#F1ECE6] rounded-[25px] md:rounded-[50px]">
        {visibleTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between py-4 px-8 md:py-6"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Completed / not completed indicator */}
              {todo.completed ? (
                <CheckCircleIcon
                  className="icon-check ml-0 text-[#D98326] cursor-pointer"
                  onClick={() => toggleCompleted(todo.id)}
                />
              ) : (
                <span
                  className="inline-block ml-1 h-7.5 w-7.5 md:h-9 md:w-9 border-2 border-[#737373] rounded-full cursor-pointer"
                  onClick={() => toggleCompleted(todo.id)}
                />
              )}

              {/* Editable title with underline */}
              <div className="flex-1 border-b border-[#76B7CD] pb-1">
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    autoFocus
                    className="w-full bg-transparent focus:outline-none"
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleFinishEditing(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleFinishEditing(todo.id);
                    }}
                  />
                ) : (
                  <span
                    className={`block transition-all cursor-pointer ${
                      todo.completed
                        ? "line-through todo-item-completed"
                        : "todo-item ml-1"
                    }`}
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>
                )}
              </div>
            </div>

            {/* Delete icon */}
            <PiTrashSimple
              className="icon-bin cursor-pointer"
              onClick={() => deleteTodoItem(todo.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
