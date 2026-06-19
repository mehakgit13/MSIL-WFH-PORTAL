function StatsCards() {
  const cards = [
    {
      title: "Annual Leave",
      value: "20",
      sub: "12 Remaining"
    },
    {
      title: "Sick Leave",
      value: "8",
      sub: "6 Remaining"
    },
    {
      title: "WFH Quota",
      value: "5",
      sub: "2 Used This Month"
    },
    {
      title: "Attendance",
      value: "96%",
      sub: "Excellent"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow p-5"
        >
          <h3 className="text-gray-500">
            {card.title}
          </h3>

          <h1 className="text-3xl font-bold mt-2">
            {card.value}
          </h1>

          <p className="text-blue-700 mt-2">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;