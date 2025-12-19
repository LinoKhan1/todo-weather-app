import { Todo } from "../types/todo";

// In-memory store (resets on server restart)
let todos: Todo[] = [
  { 
    id: "placeholder-1", 
    title: "This is a placeholder todo", 
    completed: false, 
    createdAt: new Date().toISOString() 
  },
];

/**
 * Returns all todos in the in-memory store.
 */
export function getTodos(): Todo[] {
  return todos;
}

/**
 * Adds a new todo with a unique ID and timestamp.
 * @param title - The title of the todo item
 * @returns The newly created Todo object
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
 * Updates an existing todo by ID.
 * Supports partial updates (title and/or completed status).
 * @param id - The ID of the todo to update
 * @param updates - Partial updates to apply
 * @returns The updated Todo object, or null if not found
 */
export function updateTodo(
  id: string, 
  updates: Partial<Pick<Todo, "title" | "completed">>
): Todo | null {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return null;

  todos[index] = { ...todos[index], ...updates };
  return todos[index];
}

/**
 * Deletes a todo by ID.
 * @param id - The ID of the todo to delete
 * @returns True if a todo was deleted, false otherwise
 */
export function deleteTodo(id: string): boolean {
  const initialLength = todos.length;
  todos = todos.filter((todo) => todo.id !== id);
  return todos.length < initialLength;
}
