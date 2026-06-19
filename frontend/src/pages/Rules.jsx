import DashboardLayout from "../layouts/DashboardLayout";

function Rules() {
  return (
    <DashboardLayout>
      <div className="page-pro">
        <section className="page-hero">
          <div>
            <p>Company Policy</p>
            <h1>Policies & Guidelines</h1>
            <span>Official workforce rules for attendance, WFH, leave and employee conduct.</span>
          </div>
        </section>

        <section className="metric-grid four">
          <MetricCard title="Annual Leave" value="20 Days" sub="Yearly quota" />
          <MetricCard title="Sick Leave" value="8 Days" sub="Yearly quota" />
          <MetricCard title="WFH Limit" value="5 Days" sub="Monthly quota" />
          <MetricCard title="Min Attendance" value="90%" sub="Required" />
        </section>

        <section className="policy-doc">
          <PolicySection
            title="Work From Home Policy"
            items={[
              "Maximum 5 WFH days are allowed every month.",
              "WFH requests require manager approval before the selected date.",
              "Requests must be submitted at least 24 hours in advance.",
              "Employees must remain available during shift timings.",
              "Employees must complete 9 working hours per day.",
            ]}
          />

          <PolicySection
            title="Attendance Policy"
            items={[
              "Minimum attendance required is 90%.",
              "Working hours are 9 hours per day.",
              "Late login beyond 15 minutes is recorded.",
              "Multiple violations may impact performance review.",
            ]}
          />

          <PolicySection
            title="Leave Policy"
            items={[
              "Annual Leave quota is 20 days per year.",
              "Sick Leave quota is 8 days per year.",
              "Leave requests require manager approval.",
              "Unapproved absence may impact attendance score.",
            ]}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, sub }) {
  return (
    <div className="metric-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{sub}</span>
    </div>
  );
}

function PolicySection({ title, items }) {
  return (
    <div className="policy-section">
      <h2>{title}</h2>

      <div className="policy-items">
        {items.map((item) => (
          <div className="policy-item" key={item}>
            <span></span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rules;