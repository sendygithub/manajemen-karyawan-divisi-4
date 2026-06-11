import { Department } from "@/types/type.department";
import { useEffect, useState } from "react";
import { getDepartments } from "service/department.service";

type Props = {
  departments: Department[];
};

export default function DepartmentTable({
  departments: initialDepartments,
}: Props) {
  const [departments, setDepartments] = useState<Props["departments"]>(
    initialDepartments || [],
  );

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await getDepartments();

        setDepartments(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDepartments();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Department Name</th>
            <th className="p-4">Job Description</th>
            <th className="p-4">Plant</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept) => (
            <tr
              key={dept.id}
              className="border-t border-white/10 hover:bg-white/5 transition"
            >
              <td className="p-4">{dept.name}</td>
              <td className="p-4">{dept.jobdesk}</td>
              <td className="p-4">{dept.plant}</td>
              <td className="p-4">
                <button className="text-blue-500 hover:text-blue-700">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700 ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
