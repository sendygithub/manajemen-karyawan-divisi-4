import { useEffect, useState } from "react";
import { getEmployees } from "service/employee.service";

interface Props {
  employees: {
    id: string;
    name: string;
    email: string;
    position: string;
    department: {
      name: string;
    };
  }[];
}

export default function EmployeeTable({ employees: initialEmployees }: Props) {
  const [employees, setEmployees] = useState<Props["employees"]>(
    initialEmployees || [],
  );

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getEmployees();

        setEmployees(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchEmployees();
  }, []);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Name</th>

            <th className="p-4">Position</th>
            <th className="p-4">Department</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t border-white/10">
              <td className="p-4">{employee.name}</td>

              <td className="p-4">{employee.position}</td>
              <td className="p-4">{employee.department?.name}</td>
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
