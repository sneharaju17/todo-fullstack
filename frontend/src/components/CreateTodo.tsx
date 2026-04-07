// src/components/CreateTodo.tsx
import { useState } from "react";
import API from "../api/api";

type CreateTodoProps = { onCreateTodoSuccess: () => void };

export default function CreateTodo({ onCreateTodoSuccess }: CreateTodoProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
      setMessage("Token missing. Please login again ❌");
      return;
    }

    const newTodo = {
  title: title.trim(),
  category: category.trim(),
  due_date: dueDate // already correct from input type="date"
};


    const res = await API.post("/todos", newTodo, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("✅ TODO CREATED:", res.data);

    setMessage("Todo created successfully ✅");
    onCreateTodoSuccess();
    setTitle("");
    setCategory("");
    setDueDate("");

  } catch (err: any) {
    console.log("❌ FULL ERROR:", JSON.stringify(err.response?.data?.detail, null, 2));

    const errorData = err.response?.data?.detail;

    if (Array.isArray(errorData)) {
      setMessage(errorData[0]?.msg);
    } else if (typeof errorData === "string") {
      setMessage(errorData);
    } else {
      setMessage("Error creating todo ❌");
    }
  }
};
return (
  <div className="space-y-4 mt-6">

    {/* Title */}
    <h3 className="text-lg font-semibold text-gray-800 text-center">
      Create Todo
    </h3>
<<<<<<< HEAD
    
=======
>>>>>>> 24093ea5c0a2ca47dba0157f216cc3b270aee77d

    {/* Input - Title */}
    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full p-3 rounded-full border outline-none focus:ring-2 focus:ring-purple-200"
    />

    {/* Input - Category */}
    <input
      type="text"
      placeholder="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="w-full p-3 rounded-full border outline-none focus:ring-2 focus:ring-purple-200"
    />

    {/* Input - Date */}
    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      className="w-full p-3 rounded-full border outline-none focus:ring-2 focus:ring-purple-200"
    />

    {/* Button */}
    <button
      onClick={handleCreate}
      disabled={!title || !category || !dueDate}
      className="w-full mt-6 p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white"
    >
      Create Todo →
    </button>

    {/* Message */}
    {message && (
      <p
        className={`text-center text-sm ${
          message.includes("✅") ? "text-green-500" : "text-red-500"
        }`}
      >
        {message}
      </p>
    )}
<<<<<<< HEAD
    
=======
>>>>>>> 24093ea5c0a2ca47dba0157f216cc3b270aee77d

  </div>
);
}