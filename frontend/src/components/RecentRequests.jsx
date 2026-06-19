function RecentRequests() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="font-semibold text-lg mb-4">
        Recent Requests
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Type</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="py-3">10-Jun</td>
            <td>WFH</td>
            <td className="text-green-600">
              Approved
            </td>
          </tr>

          <tr>
            <td className="py-3">05-Jun</td>
            <td>Leave</td>
            <td className="text-green-600">
              Approved
            </td>
          </tr>

          <tr>
            <td className="py-3">22-May</td>
            <td>WFH</td>
            <td className="text-orange-500">
              Pending
            </td>
          </tr>
        </tbody>

      </table>

    </div>
  );
}

export default RecentRequests;