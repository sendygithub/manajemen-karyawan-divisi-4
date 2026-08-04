import { toast } from "sonner";
import { Employee } from "@prisma/client";
import { createEmployee } from "service/employee.service";
import { Department } from "@/types/type.department";

export interface EmployeeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  form: {
    userId: string;
    name: string;
    position: string;
    departmentId: string;
  };

  setForm: React.Dispatch<
    React.SetStateAction<{
      userId: string;
      name: string;
      position: string;
      departmentId: string;
    }>
  >;

  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;

  onEmployeeAdded?: (employee: Employee) => void;

  users: {
    id: string;
    name: string;
    email: string;
  }[];

  departments: Department[];
}
export default function EmployeeDialog({
  open,
  setOpen,
  form,
  setForm,
  handleChange,
  onEmployeeAdded,
  users,
  departments,
}: EmployeeDialogProps) {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createEmployee(form)
      .then((newEmployee) => {
        toast.success("Employee created successfully!");
        if (onEmployeeAdded) {
          onEmployeeAdded(newEmployee);
        }
        setOpen(false);
        setForm({
          userId: "",
          name: "",
          position: "",
          departmentId: "",
        });
      })
      .catch((error) => {
        toast.error(error.message || "Failed to create employee");
      });
  }

  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Employee</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">User Account</label>

                <select
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
                  required
                >
                  <option value="">Select User</option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-zinc-400">Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Position</label>

                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>
              <div>
                <div>
                  <label className="text-sm text-zinc-400">Department</label>

                  <select
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="w-full    mt-1    rounded-lg    bg-zinc-900    border    border-white/10    px-4 py-2 outline-none"
                    required
                  >
                    <option value="">Select Department</option>

                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-white text-black py-2 font-medium hover:bg-zinc-200 transition"
              >
                Save Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
