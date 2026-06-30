import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", form);
      console.log(JSON.stringify(response.data.null, 2));


      // Save token
      localStorage.setItem("token", response.data.token);

      // Save userId
      localStorage.setItem("userId", response.data.user.id);

      setMsg("Login Successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {msg && <p className="mb-4 text-center">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}