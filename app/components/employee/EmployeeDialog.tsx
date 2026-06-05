export default function EmployeeDialog({
  open,
  setOpen,
  form,
  setForm,
  handleChange,
  handleSubmit,
}: any) {
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
                <label className="text-sm text-zinc-400">Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
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
