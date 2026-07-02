import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../services/api";

function localDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CalendarWidget() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({ holidays: [], leaves: [], wfh: [] });
  const [teamOnDate, setTeamOnDate] = useState([]);
  const [showTeam, setShowTeam] = useState(false);

  const fetchCalendarEvents = async () => {
    try {
      const res = await api.get("/calendar");
      setEvents(res.data);
    } catch (error) {
      console.log("Calendar error:", error.response?.data || error.message);
    }
  };

  const fetchTeamByDate = async (selectedDate) => {
    try {
      const key = localDateKey(selectedDate);
      const res = await api.get(`/team-wfh/by-date?date=${key}`);
      setTeamOnDate(res.data.members || []);
      setShowTeam(true);
    } catch (error) {
      console.log("Team WFH error:", error.response?.data || error.message);
      setTeamOnDate([]);
      setShowTeam(true);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const holidayDates = events.holidays.map((x) => localDateKey(x.date));
  const wfhDates = events.wfh.map((x) => localDateKey(x.date));

  const leaveDates = [];
  events.leaves.forEach((item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      leaveDates.push(localDateKey(d));
    }
  });

  const tileClassName = ({ date }) => {
    const key = localDateKey(date);

    if (holidayDates.includes(key)) return "calendar-day-holiday";
    if (leaveDates.includes(key)) return "calendar-day-leave";
    if (wfhDates.includes(key)) return "calendar-day-wfh";

    return "";
  };

  const handleDateClick = async (selectedDate) => {
    setDate(selectedDate);
    await fetchTeamByDate(selectedDate);
  };

  return (
    <div className="calendar-card">
      <h3 className="calendar-title">Calendar</h3>

      <Calendar
        value={date}
        onChange={handleDateClick}
        tileClassName={tileClassName}
      />

      <div className="calendar-selected">
        <p>Selected Date</p>
        <h4>{date.toDateString()}</h4>
      </div>

      {showTeam && (
        <div className="calendar-team-box">
          <h4>Team WFH on this date</h4>

          {teamOnDate.length === 0 ? (
            <p>No team member has WFH.</p>
          ) : (
            teamOnDate.map((member) => (
              <div className="calendar-team-row" key={member.id}>
                <b>{member.name}</b>
                <span>{member.department}</span>
              </div>
            ))
          )}
        </div>
      )}

      <div className="calendar-legend">
        <Legend color="red" text="Holiday / Weekend" />
        <Legend color="orange" text="Approved Leave" />
        <Legend color="green" text="Allocated WFH" />
        <Legend color="blue" text="Selected Date" />
      </div>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`legend-dot ${color}`}></span>
      <span>{text}</span>
    </div>
  );
}

export default CalendarWidget;