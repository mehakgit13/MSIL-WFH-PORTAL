import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { activities } from "../data/activities";

function ActivityDetails() {
  const { id } = useParams();

  const activity = activities.find(
    (a) => a.id === id
  );

  if (!activity) {
    return <div>Activity Not Found</div>;
  }

  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-2xl">
        <h1 className="text-3xl font-bold">
          {activity.title}
        </h1>

        <p className="mt-4">
          {activity.description}
        </p>

        {activity.details && (
          <div className="mt-6">
            <p>
              Attendance:
              {activity.details.attendance}
            </p>

            <p>
              Present Days:
              {activity.details.presentDays}
            </p>

            <p>
              Late Logins:
              {activity.details.lateLogins}
            </p>

            <p>
              Leave Days:
              {activity.details.leaveDays}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ActivityDetails;