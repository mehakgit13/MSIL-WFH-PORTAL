import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../services/api";

function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({
    holidays: [],
    leaves: [],
    wfh: [],
  });

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const res = await api.get("/calendar");
        setEvents(res.data);
      } catch (error) {
        console.log("Calendar load error:", error.response?.data);
      }
    };

    fetchCalendarEvents();
  }, []);

  const holidayDates = events.holidays.map((item) => formatDate(item.date));
  const wfhDates = events.wfh.map((item) => formatDate(item.date));

  const leaveDates = [];

events.leaves.forEach((item) => {
  const start = new Date(item.startDate);
  const end = new Date(item.endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();

    // skip Saturday and Sunday
    if (day !== 0 && day !== 6) {
      leaveDates.push(formatDate(new Date(d)));
    }
  }
});

 const tileClassName = ({ date }) => {
  const current = formatDate(date);
  const day = date.getDay();

  if (day === 0 || day === 6) return "calendar-day-weekend";
  if (holidayDates.includes(current)) return "calendar-day-holiday";
  if (leaveDates.includes(current)) return "calendar-day-leave";
  if (wfhDates.includes(current)) return "calendar-day-wfh";

  return "";
};

  return (
    <div className="calendar-card">
      <h3 className="calendar-title">Calendar</h3>

      <Calendar onChange={setDate} value={date} tileClassName={tileClassName} />

      <div className="calendar-selected">
        <p>Selected Date</p>
        <h4>
          {date.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </h4>
      </div>

     <div className="calendar-legend">
  <Legend color="legend-red" text="Holiday / Weekend" />
  <Legend color="legend-orange" text="Approved Leave" />
  <Legend color="legend-green" text="Allocated WFH" />
  <Legend color="legend-blue" text="Selected Date" />
</div>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="calendar-legend-item">
      <span className={`calendar-legend-dot ${color}`}></span>
      <span>{text}</span>
    </div>
  );
}

export default CalendarWidget;