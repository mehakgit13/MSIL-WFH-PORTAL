import { Link } from "react-router-dom";
import { useState } from "react";

function Signup() {

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    department: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email.endsWith("@maruti.co.in")) {
      alert("Only Maruti employees can register");
      return;
    }

    alert("Registered Successfully");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[450px]">

        <h1 className="text-3xl font-bold text-blue-900 text-center">
          Employee Registration
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          <input
            placeholder="Employee ID"
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            placeholder="Name"
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            placeholder="Department"
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            placeholder="Corporate Email"
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 mb-4 rounded"
          />

          <button className="w-full bg-blue-900 text-white p-3 rounded">
            Signup
          </button>

        </form>

        <p className="mt-4 text-center">
          Already have account?{" "}
          <Link
            to="/"
            className="text-blue-900"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;