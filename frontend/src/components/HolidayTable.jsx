import { useEffect, useState } from "react";
import api from "../services/api";

function HolidayTable() {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await api.get("/holidays");
        setHolidays(res.data);
      } catch (error) {
        console.log("Holiday load error:", error);
      }
    };

    fetchHolidays();
  }, []);

  return (
    <div className="space-y-3">
      {holidays.length === 0 && (
        <p className="text-gray-500 text-sm">
          No upcoming holidays found.
        </p>
      )}

      {holidays.map((holiday) => (
        <div
          key={holiday._id}
          className="flex justify-between items-center border-b pb-3"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {holiday.title}
            </p>

            <p className="text-sm text-gray-500">
              {holiday.description || "Company Holiday"}
            </p>
          </div>

          <span className="text-sm font-medium text-blue-900">
            {new Date(holiday.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default HolidayTable;