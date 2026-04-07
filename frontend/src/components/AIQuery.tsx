import { useState } from "react";
import API from "../api/api";

export default function AIQuery() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    console.log("ASK CLICKED");

    if (!question.trim()) {
      alert("Enter question ❌");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

      const res = await API.post(
  `/ai-query`,
  null,
  {
    params: { question },   // ✅ IMPORTANT
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log("RESPONSE:", res.data);

      setAnswer(res.data.answer);

    } catch (err) {
      console.log("AI error ❌", err);
      setAnswer("Error getting answer ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-semibold text-center">
        Ask AI 🤖
      </h3>

      <input
        type="text"
        placeholder="what is my task?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-3 rounded-full border"
      />

      <button
        onClick={handleAsk}
        className="w-full p-3 rounded-full bg-blue-500 text-white"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="bg-gray-100 p-3 rounded-xl whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}