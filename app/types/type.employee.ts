import { Department } from "./type.department";

export type EmployeeForm = {
  name: string;
  email: string;
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
