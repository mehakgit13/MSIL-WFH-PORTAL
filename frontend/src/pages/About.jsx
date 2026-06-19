import DashboardLayout from "../layouts/DashboardLayout";

function About() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="bg-white rounded-3xl shadow-sm p-10">
          <h1 className="text-4xl font-bold text-slate-900">
            About Workforce Portal
          </h1>

          <p className="mt-4 text-slate-600 text-lg">
            Maruti Suzuki Workforce Management Portal is a centralized platform
            for attendance tracking, leave management, work-from-home approvals,
            employee communication, company notices, workforce analytics and HR
            policy management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>

            <ul className="space-y-3 text-slate-600">
              <li>Attendance Management</li>
              <li>Leave Management</li>
              <li>Work From Home Requests</li>
              <li>Company Announcements</li>
              <li>Official Notices</li>
              <li>Team Collaboration</li>
              <li>Reports & Analytics</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Technology Stack
            </h2>

            <ul className="space-y-3 text-slate-600">
              <li>React + Vite</li>
              <li>Tailwind CSS</li>
              <li>Node.js + Express</li>
              <li>MongoDB</li>
              <li>JWT Authentication</li>
              <li>REST APIs</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default About;