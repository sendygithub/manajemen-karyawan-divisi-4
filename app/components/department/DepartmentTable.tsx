import { Department } from "@/types/type.department";

export default function DepartmentTable({
  departments,
}: {
  departments: Department[];
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/5
      "
    >
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Department Name</th>

            <th className="p-4">Job Description</th>

            <th className="p-4">Plant</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => {
            // safety check
            if (!dept) return null;

            return (
              <tr
                key={dept.id}
                className="
                    border-t
                    border-white/10
                    hover:bg-white/5
                    transition
                  "
              >
                <td className="p-4">{dept.name}</td>

                <td className="p-4">{dept.jobdesk}</td>

                <td className="p-4">{dept.plant}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
