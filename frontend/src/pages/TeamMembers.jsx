import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/team/all");
        setMembers(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load team members"
        );
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const text = `${member.name} ${member.email} ${member.department} ${member.designation}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Team Members
              </h1>

              <p className="text-gray-500 mt-2">
                Employee directory loaded from MongoDB.
              </p>
            </div>

            <div className="bg-blue-50 text-blue-900 px-5 py-3 rounded-2xl">
              <p className="text-sm">Total Employees</p>
              <h2 className="text-2xl font-bold">
                {members.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <input
            type="text"
            placeholder="Search by name, email, department or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              border
              rounded-2xl
              px-5
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Manager</th>
                <th className="p-4">Location</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                        w-10
                        h-10
                        rounded-full
                        bg-blue-900
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                        "
                      >
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {member.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">{member.employeeId}</td>
                  <td className="p-4">{member.department}</td>
                  <td className="p-4">{member.designation}</td>
                  <td className="p-4">{member.manager}</td>
                  <td className="p-4">{member.location}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No team members found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TeamMembers;