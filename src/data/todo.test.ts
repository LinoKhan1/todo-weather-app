// __tests__/todo.test.ts
import { getTodos, addTodo, updateTodo, deleteTodo } from "../data/todo";
import { Todo } from "../types/todo";

describe("Todo Data Layer", () => {
  let placeholderTodo: Todo;

  beforeEach(() => {
    // Reset in-memory todos before each test
    const allTodos = getTodos();
    allTodos.forEach((t) => deleteTodo(t.id));

    // Add a placeholder todo for consistency
    placeholderTodo = addTodo("This is a placeholder todo");
  });

  it("should get all todos", () => {
    const todos = getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0]).toEqual(placeholderTodo);
  });

  it("should add a new todo", () => {
    const newTodo = addTodo("Test Todo");
    const todos = getTodos();
    expect(todos).toContainEqual(newTodo);
    expect(newTodo.completed).toBe(false);
    expect(typeof newTodo.id).toBe("string");
    expect(new Date(newTodo.createdAt)).toBeInstanceOf(Date);
  });

  it("should update an existing todo", () => {
    const updated = updateTodo(placeholderTodo.id, { completed: true, title: "Updated title" });
    expect(updated).not.toBeNull();
    expect(updated?.completed).toBe(true);
    expect(updated?.title).toBe("Updated title");

    const todos = getTodos();
    expect(todos.find((t) => t.id === placeholderTodo.id)?.completed).toBe(true);
  });

  it("should return null when updating a non-existent todo", () => {
    const result = updateTodo("invalid-id", { completed: true });
    expect(result).toBeNull();
  });

  it("should delete an existing todo", () => {
    const result = deleteTodo(placeholderTodo.id);
    expect(result).toBe(true);
    expect(getTodos()).toHaveLength(0);
  });

  it("should return false when deleting a non-existent todo", () => {
    const result = deleteTodo("invalid-id");
    expect(result).toBe(false);
  });

  it("should handle partial updates correctly", () => {
    const updated = updateTodo(placeholderTodo.id, { title: "Partial update" });
    expect(updated?.title).toBe("Partial update");
    expect(updated?.completed).toBe(false); // unchanged
  });

  it("should maintain unique IDs for multiple todos", () => {
    const todo1 = addTodo("Todo 1");
    const todo2 = addTodo("Todo 2");
    expect(todo1.id).not.toBe(todo2.id);
  });

  it("should preserve createdAt timestamp correctly", () => {
    const todo = addTodo("Timestamp test");
    const parsedDate = new Date(todo.createdAt);
    expect(parsedDate.toISOString()).toBe(todo.createdAt);
  });
});
