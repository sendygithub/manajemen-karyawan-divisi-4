import { Employee } from "@/types/type.employee";

type Props = {
  employees: Employee[];
};

export default function EmployeeTable({ employees }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Position</th>
            <th className="p-4">Department</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t border-white/10">
              <td className="p-4">{employee.name}</td>

              <td className="p-4">{employee.email}</td>

              <td className="p-4">{employee.position}</td>
              <td className="p-4">{employee.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
