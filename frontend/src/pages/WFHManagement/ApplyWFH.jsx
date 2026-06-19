import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function ApplyWFH() {
  const [form, setForm] = useState({
    date: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitWFH = async (e) => {
    e.preventDefault();

    try {
      await api.post("/wfh/apply", form);

      alert("WFH request submitted successfully");

      setForm({
        date: "",
        reason: "",
      });
    } catch (error) {
      console.log("WFH error:", error.response?.data);
      alert(error.response?.data?.message || "WFH request failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <section className="bg-gradient-to-r from-blue-950 to-blue-700 text-white rounded-3xl p-10 shadow-xl">
          <p className="uppercase tracking-widest text-blue-200 text-sm font-bold">
            Work From Home
          </p>

          <h1 className="text-4xl font-black mt-3">
            Apply WFH
          </h1>

          <p className="text-blue-100 mt-3">
            Submit work from home request under 5 days monthly policy.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            WFH Request Form
          </h2>

          <form
            onSubmit={submitWFH}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                WFH Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-2">
                Reason
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                placeholder="Enter WFH reason"
                className="w-full min-h-36 border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-800"
              >
                Submit WFH Request
              </button>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ApplyWFH;