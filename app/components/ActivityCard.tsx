const activities = [
  "New user registered",
  "Server restarted",
  "Payment received",
  "Database backup completed",
];

export default function ActivityCard() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-zinc-950
        p-6
      "
    >
      <h2 className="text-lg font-semibold">Recent Activity</h2>

      <div className="mt-6 space-y-4">
        {activities.map((item, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              bg-white/5
              p-4
            "
          >
            <span className="text-sm text-zinc-300">{item}</span>

            <span className="text-xs text-zinc-500">Just now</span>
          </div>
        ))}
      </div>
    </div>
  );
}
