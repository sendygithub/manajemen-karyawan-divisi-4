export default function DepartmentDialog({
  open,
  setOpen,
  form,
  setForm,
  handleChange,
  handleSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: {
    name: string;
    jobdesk: string;
    plant: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      jobdesk: string;
      plant: string;
    }>
  >;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Department</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Department Name</label>

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
                <label className="text-sm text-zinc-400">Job Title</label>

                <input
                  type="text"
                  name="jobdesk"
                  value={form.jobdesk}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Plant</label>

                <input
                  type="text"
                  name="plant"
                  value={form.plant}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-white text-black py-2 font-medium hover:bg-zinc-200 transition"
              >
                Save Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
