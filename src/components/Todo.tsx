"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

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

  // Fetch todos on mount
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

  // Toggle completed with optimistic update
  const toggleCompleted = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    // Fire-and-forget PATCH to server
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

  if (loading) return <p className="text-center mt-40">Loading todos...</p>;

  return (
    <section className="mt-[160px] max-w-4xl mx-auto space-y-4">
      {/* Form */}
      <form
        className="flex rounded-[50px] bg-[#F1ECE6] overflow-hidden"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-l-[50px] focus:outline-none bg-[#F1ECE6] placeholder-[#969696]"
          placeholder="What do you need to do?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#76B7CD] text-[#F3F3F3] rounded-r-[50px] font-semibold"
        >
          ADD
        </button>
      </form>

      {/* Hide Completed */}
      <div className="text-right px-6">
        <span
          className="text-[#D98326] cursor-pointer"
          onClick={() => setHideCompleted(!hideCompleted)}
        >
          Hide Completed
        </span>
      </div>

      {/* Todo List */}
      <ul className="space-y-2 bg-[#F1ECE6] rounded-[25px] ">
        {visibleTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between  px-4 py-4 "
          >
            <div className="flex items-center space-x-2">
              {/* Check / Empty circle */}
              {todo.completed ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-[#D98326] cursor-pointer"
                  onClick={() => toggleCompleted(todo.id)}
                />
              ) : (
                <span
                  className="inline-block h-6 w-6 border-2 border-[#737373] rounded-full cursor-pointer"
                  onClick={() => toggleCompleted(todo.id)}
                />
              )}

              {/* Todo title */}
              <span
                className={`transition-all ${
                  todo.completed ? "line-through text-gray-500 " : ""
                }`}
              >
                {todo.title}
              </span>
            </div>

            {/* Trash Icon */}
            <TrashIcon
              className="h-5 w-5 text-[#B30B04] cursor-pointer"
              onClick={() => deleteTodoItem(todo.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
