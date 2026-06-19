import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get("/activity");
        setActivities(res.data);
      } catch (error) {
        console.log("Activity load error:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.length === 0 && (
          <p className="text-gray-500 text-sm">
            No recent activity found.
          </p>
        )}

        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 shrink-0"></div>

              <div>
                <p className="text-gray-800 font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-gray-500">
                  {activity.description}
                </p>

                <span className="text-xs text-gray-400">
                  {new Date(activity.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Link
              to={`/activity/${activity._id}`}
              className="text-blue-700 font-medium text-sm hover:underline shrink-0"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;