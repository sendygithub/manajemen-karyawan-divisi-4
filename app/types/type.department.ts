export type Department = {
  id: string;

  name: string;

  jobdesk: string;

  plant: string;

  createdAt?: Date;
};

export type DepartmentForm = {
  name: string;

  jobdesk: string;

  plant: string;
};
