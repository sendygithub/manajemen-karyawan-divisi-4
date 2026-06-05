"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+62 812 3456 7890",
    gender: "Male",
    birthDate: "1998-05-12",
    address: "Jakarta, Indonesia",
    position: "Frontend Developer",
    department: "Information Technology",
    employeeId: "EMP-001",
    joinDate: "2024-01-15",
    emergencyContact: "Michael Doe",
    emergencyPhone: "+62 811 9999 8888",
    bankName: "BCA",
    bankAccount: "1234567890",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    alert("Profile updated!");
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>

        <p className="text-zinc-400 text-sm">
          Manage your personal employee information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROFILE CARD */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-2xl font-bold">
            J
          </div>

          <div>
            <h2 className="text-xl font-semibold">{form.fullName}</h2>

            <p className="text-zinc-400">{form.position}</p>

            <p className="text-zinc-500 text-sm">
              Employee ID: {form.employeeId}
            </p>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-5">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Full Name</label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
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
              <label className="text-sm text-zinc-400">Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Birth Date</label>

              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
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
        </div>

        {/* JOB INFORMATION */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-5">Job Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Position</label>

              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Department</label>

              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Employee ID</label>

              <input
                type="text"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Join Date</label>

              <input
                type="date"
                name="joinDate"
                value={form.joinDate}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACT */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-5">Emergency Contact</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Contact Name</label>

              <input
                type="text"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Contact Phone</label>

              <input
                type="text"
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* BANK INFORMATION */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold mb-5">Bank Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400">Bank Name</label>

              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">
                Bank Account Number
              </label>

              <input
                type="text"
                name="bankAccount"
                value={form.bankAccount}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
