import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    };

    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);

    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, isRead: true } : item
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Notification Center
          </h1>

          <p className="text-gray-500 mt-2">
            View company updates, approval alerts and HR notifications.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
          {notifications.length === 0 && (
            <p className="text-gray-500">
              No notifications available.
            </p>
          )}

          {notifications.map((item) => (
            <div
              key={item._id}
              className={`border rounded-2xl p-5 ${
                item.isRead
                  ? "bg-white"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {item.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(item.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => markRead(item._id)}
                    className="bg-blue-900 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;