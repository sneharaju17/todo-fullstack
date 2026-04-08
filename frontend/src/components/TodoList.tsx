// src/components/TodoList.tsx
import { useEffect, useState } from "react";
import API from "../api/api";

type Todo = { id: number; title: string; category: string; due_date: string };

export default function TodoList({ refresh }: { refresh: boolean }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => { fetchTodos(); }, [refresh]);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/todos", { headers: { Authorization: `Bearer ${token}` } });
      setTodos(res.data);
    } catch { console.log("Failed to fetch todos ❌"); }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTodos();
    } catch { console.log("Delete failed ❌"); }
  };

  return (
  <div className="space-y-4">

    {/* Title */}
    <h2 className="text-gray-800 text-xl font-semibold text-center">
      Todo List
    </h2>

    {/* Empty State */}
    {todos.length === 0 && (
      <p className="text-gray-400 text-center text-sm">
        No todos yet.
      </p>
    )}

    {/* List */}
    <div className="space-y-3 max-h-[300px] overflow-y-auto">

      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex justify-between items-center p-4 rounded-xl bg-gray-50 shadow-sm"
        >
          {/* Left */}
          <div>
            <p className="text-gray-800 font-semibold text-lg">
              {todo.title}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              {/* Category badge */}
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                {todo.category}
              </span>{" "}
              • {new Date(todo.due_date).toLocaleDateString("en-IN")}
            </p>
          </div>

          {/* Delete */}
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-red-500 text-sm hover:scale-110 transition"
          >
            ❌
          </button>
        </div>
      ))}

    </div>

  </div>
);
}