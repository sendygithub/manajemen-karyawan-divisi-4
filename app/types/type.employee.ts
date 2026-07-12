import { Department } from "./type.department";

export type EmployeeForm = {
  name: string;
  position: string;
  departmentId: string;
};

export type EmployeeDialogProps = {
  open: boolean;

  setOpen: (open: boolean) => void;

  form: EmployeeForm;

  setForm: React.Dispatch<React.SetStateAction<EmployeeForm>>;

  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;

  handleSubmit: (e: React.FormEvent) => void;

  departments: Department[];
};

export type DepartmentWithEmployees = {
  id: string;
  name: string;
  jobdesk: string;
  plant: string;
  createdAt?: Date;
  employees: { id: string; name: string; position: string }[];
  _count: { employees: number };
};

export type EmployeeData = {
  userId: string; // Tambahkan userId untuk mencocokkan dengan form
  id: string;
  name: string;
  email: string;
  position: string;
  department: {
    name: string;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
};
