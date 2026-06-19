import DashboardLayout from "../layouts/DashboardLayout";
import { companyPolicy } from "../data/portalData";

function Leaves() {
  const annualUsed = 1;
  const sickUsed = 1;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Leave Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeaveCard
          title="Annual Leave"
          total={companyPolicy.annualLeaveTotal}
          used={annualUsed}
        />

        <LeaveCard
          title="Sick Leave"
          total={companyPolicy.sickLeaveTotal}
          used={sickUsed}
        />
      </div>
    </DashboardLayout>
  );
}

function LeaveCard({ title, total, used }) {
  const remaining = total - used;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="text-4xl font-bold mt-4">{total} Days</p>

      <div className="mt-5 space-y-2 text-slate-600">
        <p>Used: {used} Days</p>
        <p className="font-bold text-blue-900">
          Remaining: {remaining} Days
        </p>
      </div>
    </div>
  );
}

export default Leaves;