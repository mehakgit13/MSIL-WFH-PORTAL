import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import FactCheckIcon from "@mui/icons-material/FactCheck";

function KPICards({ dashboard }) {
  if (!dashboard) return null;

  const cards = [
    {
      title: "Annual Leave",
      value: dashboard.leaves.annualQuota,
      sub: `${dashboard.leaves.annualRemaining} Remaining`,
      icon: <EventAvailableIcon fontSize="large" />,
      color: "bg-blue-100 text-blue-900",
    },
    {
      title: "Sick Leave",
      value: dashboard.leaves.sickQuota,
      sub: `${dashboard.leaves.sickRemaining} Remaining`,
      icon: <MedicalServicesIcon fontSize="large" />,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "WFH Quota",
      value: dashboard.wfh.monthlyQuota,
      sub: `${dashboard.wfh.approved} Used This Month`,
      icon: <HomeWorkIcon fontSize="large" />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Attendance",
      value: `${dashboard.attendance.percentage}%`,
      sub:
        dashboard.attendance.percentage >= 90
          ? "Excellent"
          : "Needs Attention",
      icon: <FactCheckIcon fontSize="large" />,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
          bg-white
          rounded-2xl
          border
          border-gray-100
          shadow-sm
          hover:shadow-lg
          transition-all
          duration-300
          p-6
          "
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                {card.title}
              </p>

              <h2 className="text-4xl font-bold text-gray-800 mt-3">
                {card.value}
              </h2>
            </div>

            <div
              className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                ${card.color}
              `}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Current Status
            </span>

            <span className="text-sm font-semibold text-blue-900">
              {card.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default KPICards;