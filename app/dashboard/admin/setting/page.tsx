"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    companyName: "Tech Corp",
    companyEmail: "admin@techcorp.com",
    phone: "+62 812 3456 7890",
    address: "Jakarta, Indonesia",
    adminName: "Admin",
    adminEmail: "admin@techcorp.com",
    timezone: "Asia/Jakarta",
    notifications: true,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleToggle() {
    setForm({
      ...form,
      notifications: !form.notifications,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    alert("Settings saved!");
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <p className="text-zinc-400 text-sm">
          Manage system configuration and account settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* COMPANY SETTINGS */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Company Name</label>

              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Company Email</label>

              <input
                type="email"
                name="companyEmail"
                value={form.companyEmail}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Phone Number</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Timezone</label>

              <input
                type="text"
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-zinc-400">Address</label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
            />
          </div>
        </div>

        {/* ADMIN ACCOUNT */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Admin Account</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Admin Name</label>

              <input
                type="text"
                name="adminName"
                value={form.adminName}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Admin Email</label>

              <input
                type="email"
                name="adminEmail"
                value={form.adminEmail}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-zinc-400">Change Password</label>

            <input
              type="password"
              placeholder="New password"
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
            />
          </div>
        </div>

        {/* SYSTEM PREFERENCES */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">System Preferences</h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Email Notifications</h3>

              <p className="text-sm text-zinc-400">
                Receive system and leave request notifications
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className={`w-14 h-8 rounded-full transition relative ${
                form.notifications ? "bg-green-500" : "bg-zinc-700"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
                  form.notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
