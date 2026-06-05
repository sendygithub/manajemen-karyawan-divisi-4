export default function Topbar() {
  return (
    <header
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/10
        px-6
        py-5
      "
    >
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <p className="text-sm text-zinc-500">Welcome back</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            text-sm
            outline-none
            placeholder:text-zinc-500
            focus:border-white/30
          "
        />

        <div
          className="
            h-11
            w-11
            rounded-full
            bg-white
          "
        />
      </div>
    </header>
  );
}
