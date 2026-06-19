import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function ApplyLeave() {
  const [form, setForm] = useState({
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLeave = async (e) => {
    e.preventDefault();

    try {
await api.post("/leaves/apply", form);
      alert("Leave request submitted successfully");

      setForm({
        leaveType: "Annual",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Leave request failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <section className="bg-gradient-to-r from-blue-950 to-blue-700 text-white rounded-3xl p-10 shadow-xl">
          <p className="uppercase tracking-widest text-blue-200 text-sm font-bold">
            Leave Management
          </p>
          <h1 className="text-4xl font-black mt-3">Apply Leave</h1>
          <p className="text-blue-100 mt-3">
            Submit annual or sick leave request for manager approval.
          </p>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Leave Request Form
          </h2>

          <form onSubmit={submitLeave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
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
                placeholder="Enter leave reason"
                className="w-full min-h-36 border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-800"
              >
                Submit Leave Request
              </button>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ApplyLeave;