import { GET, POST } from "./route";
import { getTodos, addTodo } from "../../../data/todo";

jest.mock("../../../data/todo", () => ({
  getTodos: jest.fn(),
  addTodo: jest.fn(),
}));

describe("Todo API route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/todo", () => {
    it("returns all todos", async () => {
      const mockTodos = [
        {
          id: "1",
          title: "Test Todo",
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];

      (getTodos as jest.Mock).mockReturnValue(mockTodos);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTodos);
      expect(getTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/todo", () => {
    it("creates a new todo when title is provided", async () => {
      const mockTodo = {
        id: "123",
        title: "New Todo",
        completed: false,
        createdAt: new Date().toISOString(),
      };

      (addTodo as jest.Mock).mockReturnValue(mockTodo);

      const request = new Request("http://localhost/api/todo", {
        method: "POST",
        body: JSON.stringify({ title: "New Todo" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockTodo);
      expect(addTodo).toHaveBeenCalledWith("New Todo");
      expect(addTodo).toHaveBeenCalledTimes(1);
    });

    it("returns 400 if title is missing", async () => {
      const request = new Request("http://localhost/api/todo", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Title is required" });
      expect(addTodo).not.toHaveBeenCalled();
    });

    it("returns 400 on invalid JSON body", async () => {
      const request = new Request("http://localhost/api/todo", {
        method: "POST",
        body: "invalid-json",
        headers: { "Content-Type": "application/json" },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Invalid request" });
      expect(addTodo).not.toHaveBeenCalled();
    });
  });
});
