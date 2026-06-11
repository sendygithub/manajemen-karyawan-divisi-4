import type { ChangeEvent, FormEvent } from "react";

type LeaveForm = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
};

type LeaveDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: LeaveForm;
  handleChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

const leaveTypes = [
  {
    value: "ANNUAL",
    label: "Annual Leave",
  },
  {
    value: "SICK",
    label: "Sick Leave",
  },
  {
    value: "PERSONAL",
    label: "Personal Leave",
  },
];

export default function LeaveDialog({
  open,
  setOpen,
  form,
  handleChange,
  handleSubmit,
  isLoading = false,
}: LeaveDialogProps) {
  const totalDays =
    form.startDate && form.endDate
      ? Math.ceil(
          (new Date(form.endDate).getTime() -
            new Date(form.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Request Leave</h2>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* LEAVE TYPE */}
          <div>
            <label className="text-sm text-zinc-400">Leave Type</label>

            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              required
            >
              <option value="">Select Leave Type</option>

              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* START DATE */}
          <div>
            <label className="text-sm text-zinc-400">Start Date</label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              required
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="text-sm text-zinc-400">End Date</label>

            <input
              type="date"
              name="endDate"
              min={form.startDate}
              value={form.endDate}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              required
            />
          </div>

          {/* TOTAL DAYS */}
          {totalDays > 0 && (
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <p className="text-sm text-zinc-400">Total Leave Duration</p>

              <p className="text-lg font-semibold mt-1">
                {totalDays} Day{totalDays > 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* REASON */}
          <div>
            <label className="text-sm text-zinc-400">Reason</label>

            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none resize-none"
              placeholder="Enter your reason..."
              required
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-white/10 py-2 hover:bg-white/5 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="
                flex-1
                rounded-lg
                bg-white
                text-black
                py-2
                font-medium
                hover:bg-zinc-200
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
