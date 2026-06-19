import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[400px]">

        <h1 className="text-3xl font-bold text-center text-blue-900">
          Maruti Suzuki
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Employee Portal Login
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Corporate Email"
            className="w-full border p-3 rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            className="w-full bg-blue-900 text-white p-3 rounded"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          New Employee?{" "}
          <Link
            to="/signup"
            className="text-blue-900 font-semibold"
          >
            Signup
          </Link>
        </p>
      </div>

    </div>
  );
}

export default Login;