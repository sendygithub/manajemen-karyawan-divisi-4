"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",

    phone: "",
    gender: "",

    birthDate: "",
    address: "",

    position: "",
    departmentId: "",

    joinDate: "",

    emergencyContact: "",
    emergencyPhone: "",

    bankName: "",
    bankAccount: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditMode(false);
    } catch (error: any) {
      toast.error(error.message || "Failed update profile");
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profile");

      const data = await response.json();

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
        address: data.address || "",
        position: data.position || "",
        departmentId: data.departmentId || "",
        joinDate: data.joinDate ? data.joinDate.split("T")[0] : "",
        emergencyContact: data.emergencyContact || "",
        emergencyPhone: data.emergencyPhone || "",
        bankName: data.bankName || "",
        bankAccount: data.bankAccount || "",
      });
    } catch (error) {
      toast.error("Failed load profile");
    }
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
      <div className="flex justify-end mb-6">
        {!isEditMode ? (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg text-white"
          >
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsEditMode(false);
              fetchProfile();
            }}
            className="bg-zinc-700 px-4 py-2 rounded-lg text-white"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROFILE CARD */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-2xl font-bold">
            {form.name?.charAt(0) || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{form.name}</h2>

            <p className="text-zinc-400">{form.position}</p>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400">Full Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Phone Number</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Gender</label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">Birth Date</label>

            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-zinc-400">Address</label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>
        </div>

        {/* JOB INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400">Position</label>

            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Department ID</label>

            <input
              type="text"
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Join Date</label>

            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>
        </div>

        {/* EMERGENCY CONTACT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400">
              Emergency Contact Name
            </label>

            <input
              type="text"
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Emergency Contact Phone
            </label>

            <input
              type="text"
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>
        </div>

        {/* BANK INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-400">Bank Name</label>

            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">Bank Account Number</label>

            <input
              type="text"
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              disabled={!isEditMode}
              className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mb-4">
          {isEditMode && (
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black px-6 py-2 rounded-lg"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
