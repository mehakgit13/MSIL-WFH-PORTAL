import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CampaignIcon from "@mui/icons-material/Campaign";
import api from "../services/api";

function AnnouncementFeed() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (error) {
        console.log("Notice load error:", error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <CampaignIcon
          sx={{
            fontSize: 30,
            color: "#1E3A8A",
          }}
        />

        <h2 className="text-2xl font-bold text-gray-800">
          Company Announcements
        </h2>
      </div>

      <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2">
        {notices.length === 0 && (
          <p className="text-gray-500">
            No company announcements available.
          </p>
        )}

        {notices.map((item) => (
          <div
            key={item._id}
            className="
              border
              border-gray-200
              rounded-2xl
              p-5
              hover:shadow-md
              transition
            "
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <span
                className="
                  bg-blue-100
                  text-blue-800
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                "
              >
                {item.category}
              </span>
            </div>

            <p className="text-gray-600 mt-3 leading-relaxed line-clamp-2">
              {item.content}
            </p>

            <Link
              to={`/notices/${item._id}`}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                text-blue-700
                font-medium
                hover:underline
              "
            >
              View Full Notice →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnnouncementFeed;