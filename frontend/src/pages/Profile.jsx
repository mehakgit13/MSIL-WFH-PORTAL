import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/profile");
      setProfile(res.data);
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <DashboardLayout>
        Loading profile...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold">
          {profile.name}
        </h1>

        <p className="text-gray-500">
          {profile.designation}
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <div>
            <p className="text-gray-500">Employee ID</p>
            <h3 className="font-semibold">{profile.employeeId}</h3>
          </div>

          <div>
            <p className="text-gray-500">Department</p>
            <h3 className="font-semibold">{profile.department}</h3>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <h3 className="font-semibold">{profile.email}</h3>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <h3 className="font-semibold">{profile.location}</h3>
          </div>

          <div>
            <p className="text-gray-500">Manager</p>
            <h3 className="font-semibold">{profile.manager}</h3>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;