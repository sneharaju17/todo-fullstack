import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CreateTodo from "./CreateTodo";
import TodoList from "./TodoList";
import type { RootState } from "../store/store";
import { clearUser } from "../store/authSlice";
import AIQuery from "./AIQuery";

export default function TodoPage() {
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleCreateTodoSuccess = () => setRefresh(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-5">
      <div className="w-[360px] bg-white rounded-3xl p-6 relative shadow-lg overflow-hidden">

        {/* Top shape */}
        <div className="absolute -top-40 -left-28 w-[340px] h-[340px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full z-0"></div>

        <div className="relative z-10">

          {/* Header */}
          <h2 className="mt-10 text-2xl font-semibold text-gray-800 text-center">
            My Todos 📝
          </h2>

          <p className="text-gray-500 text-sm text-center">
            {user?.email}
          </p>

          {/* Logout */}
          <p
            onClick={handleLogout}
            className="text-center text-sm text-red-500 mt-2 cursor-pointer hover:underline"
          >
            Logout
          </p>

          {/* Create Todo */}
          <div className="mt-6">
            <CreateTodo onCreateTodoSuccess={handleCreateTodoSuccess} />
          </div>

          {/* ✅ AI Query */}
          <div className="mt-6">
            <AIQuery />
          </div>

          {/* Todo List */}
          <div className="mt-6 space-y-3 max-h-[260px] overflow-y-auto">
            <TodoList refresh={refresh} />
          </div>

        </div>
      </div>
    </div>
  );
}