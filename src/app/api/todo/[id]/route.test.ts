import { PATCH, DELETE } from "./route";
import { updateTodo, deleteTodo } from "../../../../data/todo";

// Mock data layer to isolate route behavior
jest.mock("../../../../data/todo", () => ({
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

describe("Todo API [id] route", () => {
  const params = { params: { id: "test-id" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PATCH /api/todo/:id", () => {
    it("updates a todo successfully", async () => {
      const updatedTodo = {
        id: "test-id",
        title: "Updated title",
        completed: true,
        createdAt: new Date().toISOString(),
      };

      (updateTodo as jest.Mock).mockReturnValue(updatedTodo);

      const request = new Request("http://localhost/api/todo/test-id", {
        method: "PATCH",
        body: JSON.stringify({ completed: true }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PATCH(request, params);
      const data = await response.json();

      // Verify response and data layer call
      expect(response.status).toBe(200);
      expect(data).toEqual(updatedTodo);
      expect(updateTodo).toHaveBeenCalledWith("test-id", { completed: true });
    });

    it("returns 404 when todo is not found", async () => {
      (updateTodo as jest.Mock).mockReturnValue(null);

      const request = new Request("http://localhost/api/todo/test-id", {
        method: "PATCH",
        body: JSON.stringify({ completed: true }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await PATCH(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Todo not found" });
    });

    it("returns 400 for invalid JSON body", async () => {
      const request = new Request("http://localhost/api/todo/test-id", {
        method: "PATCH",
        body: "invalid-json",
        headers: { "Content-Type": "application/json" },
      });

      const response = await PATCH(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Invalid request" });

      // Ensure data layer was not called
      expect(updateTodo).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/todo/:id", () => {
    it("deletes a todo successfully", async () => {
      (deleteTodo as jest.Mock).mockReturnValue(true);

      const request = new Request("http://localhost/api/todo/test-id", {
        method: "DELETE",
      });

      const response = await DELETE(request, params);
      const data = await response.json();

      // Verify deletion and response
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(deleteTodo).toHaveBeenCalledWith("test-id");
    });

    it("returns 404 when todo is not found", async () => {
      (deleteTodo as jest.Mock).mockReturnValue(false);

      const request = new Request("http://localhost/api/todo/test-id", {
        method: "DELETE",
      });

      const response = await DELETE(request, params);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "Todo not found" });
    });

    it("returns 400 on unexpected error", async () => {
      (deleteTodo as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const request = new Request("http://localhost/api/todo/test-id", {
        method: "DELETE",
      });

      const response = await DELETE(request, params);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Invalid request" });
    });
  });
});
