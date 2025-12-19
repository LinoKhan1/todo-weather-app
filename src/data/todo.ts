import { Todo } from "../types/todo";

// In-memory store (resets on server restart)
let todos: Todo[] = [
  // Optional placeholder
  { id: "placeholder-1", title: "This is a placeholder todo", completed: false, createdAt: new Date().toISOString() },
];

/**
 * Get all todos
 */
export function getTodos(): Todo[] {
  return todos;
}

/**
 * Add a new todo
 */
export function addTodo(title: string): Todo {
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  return newTodo;
}

/**
 * Update an existing todo by ID
 */
export function updateTodo(id: string, updates: Partial<Pick<Todo, "title" | "completed">>): Todo | null {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return null;

  todos[index] = { ...todos[index], ...updates };
  return todos[index];
}

/**
 * Delete a todo by ID
 */
export function deleteTodo(id: string): boolean {
  const initialLength = todos.length;
  todos = todos.filter((todo) => todo.id !== id);
  return todos.length < initialLength;
}
