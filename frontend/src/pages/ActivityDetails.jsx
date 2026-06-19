import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function ActivityDetails() {
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get(`/activity/${id}`);
        setActivity(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load activity details"
        );
      }
    };

    fetchActivity();
  }, [id]);

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!activity) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          Loading activity details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <Link
            to="/dashboard"
            className="text-blue-700 font-medium hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mt-6">
            {activity.title}
          </h1>

          <p className="text-gray-500 mt-2">
            {new Date(activity.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Activity Information
          </h2>

          <p className="text-gray-700 leading-7">
            {activity.description}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ActivityDetails;