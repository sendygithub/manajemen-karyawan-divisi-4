"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { markAsPaidAction, markAsPendingAction } from "action/payroll.action";
import type {
  Payroll,
  PayrollFilter,
  PaginatedResult,
} from "@/types/type.payroll";

type Department = {
  id: string;
  name: string;
};

type Props = {
  payrollData: PaginatedResult<Payroll>;
  departments: Department[];
  currentFilter: PayrollFilter;
};

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function PayrollTable({
  payrollData,
  departments,
  currentFilter,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentFilter.search ?? "");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const buildHref = useCallback(
    (updates: Partial<PayrollFilter>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.search !== undefined) {
        if (updates.search) params.set("search", updates.search);
        else params.delete("search");
      }
      if (updates.departmentId !== undefined) {
        if (updates.departmentId)
          params.set("departmentId", updates.departmentId);
        else params.delete("departmentId");
      }
      if (updates.status !== undefined) {
        if (updates.status) params.set("status", updates.status);
        else params.delete("status");
      }
      if (updates.month !== undefined) {
        if (updates.month) params.set("month", String(updates.month));
        else params.delete("month");
      }
      if (updates.year !== undefined) {
        if (updates.year) params.set("year", String(updates.year));
        else params.delete("year");
      }
      if (updates.sortBy !== undefined) {
        if (updates.sortBy) {
          params.set("sortBy", updates.sortBy);
          if (updates.sortOrder) params.set("sortOrder", updates.sortOrder);
        } else {
          params.delete("sortBy");
          params.delete("sortOrder");
        }
      }
      if (updates.page !== undefined) {
        params.set("page", String(updates.page));
      }

      return `/dashboard/admin/payroll?${params.toString()}`;
    },
    [searchParams],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildHref({ search: searchValue, page: 1 }));
  };

  const handleSort = (field: string) => {
    const currentSortBy = currentFilter.sortBy;
    const currentSortOrder = currentFilter.sortOrder;

    if (currentSortBy === field) {
      const newOrder = currentSortOrder === "asc" ? "desc" : "asc";
      router.push(buildHref({ sortBy: field, sortOrder: newOrder }));
    } else {
      router.push(buildHref({ sortBy: field, sortOrder: "asc" }));
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    setLoadingId(id);
    await markAsPaidAction(id);
    setLoadingId(null);
  };

  const handleMarkAsPending = async (id: string) => {
    setLoadingId(id);
    await markAsPendingAction(id);
    setLoadingId(null);
  };

  const renderSortIcon = (field: string) => {
    if (currentFilter.sortBy !== field) {
      return <ChevronDown size={14} className="text-zinc-600" />;
    }
    return currentFilter.sortOrder === "asc" ? (
      <ChevronUp size={14} className="text-white" />
    ) : (
      <ChevronDown size={14} className="text-white" />
    );
  };

  const { data, pagination } = payrollData;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-3 items-end"
        >
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-zinc-500 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari karyawan..."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 pl-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">
              Department
            </label>
            <select
              value={currentFilter.departmentId ?? ""}
              onChange={(e) =>
                router.push(
                  buildHref({ departmentId: e.target.value, page: 1 }),
                )
              }
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Status</label>
            <select
              value={currentFilter.status ?? ""}
              onChange={(e) =>
                router.push(
                  buildHref({
                    status: e.target.value as PayrollFilter["status"],
                    page: 1,
                  }),
                )
              }
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Bulan</label>
            <select
              value={currentFilter.month ?? ""}
              onChange={(e) =>
                router.push(
                  buildHref({
                    month: e.target.value ? Number(e.target.value) : undefined,
                    page: 1,
                  }),
                )
              }
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">All Months</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Tahun</label>
            <select
              value={currentFilter.year ?? ""}
              onChange={(e) =>
                router.push(
                  buildHref({
                    year: e.target.value ? Number(e.target.value) : undefined,
                    page: 1,
                  }),
                )
              }
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-4 text-sm font-medium text-zinc-400">
                Employee
              </th>
              <th className="p-4 text-sm font-medium text-zinc-400">
                Department
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("month")}
              >
                <div className="flex items-center gap-1">
                  Periode {renderSortIcon("month")}
                </div>
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("baseSalary")}
              >
                <div className="flex items-center gap-1">
                  Gaji Pokok {renderSortIcon("baseSalary")}
                </div>
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("allowance")}
              >
                <div className="flex items-center gap-1">
                  Tunjangan {renderSortIcon("allowance")}
                </div>
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("deduction")}
              >
                <div className="flex items-center gap-1">
                  Potongan {renderSortIcon("deduction")}
                </div>
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("bonus")}
              >
                <div className="flex items-center gap-1">
                  Bonus {renderSortIcon("bonus")}
                </div>
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("totalSalary")}
              >
                <div className="flex items-center gap-1">
                  Total {renderSortIcon("totalSalary")}
                </div>
              </th>
              <th
                className="p-4 text-sm font-medium text-zinc-400 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status {renderSortIcon("status")}
                </div>
              </th>
              <th className="p-4 text-sm font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-zinc-400">
                  No payroll data found
                </td>
              </tr>
            ) : (
              data.map((payroll) => (
                <tr
                  key={payroll.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{payroll.employeeName}</p>
                      <p className="text-sm text-zinc-400">
                        {payroll.employeePosition}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">
                    {payroll.departmentName}
                  </td>
                  <td className="p-4">
                    {MONTHS.find((m) => m.value === payroll.month)?.label}{" "}
                    {payroll.year}
                  </td>
                  <td className="p-4">
                    Rp {payroll.baseSalary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    Rp {payroll.allowance.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    Rp {payroll.deduction.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    Rp {payroll.bonus.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4 font-semibold">
                    Rp {payroll.totalSalary.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payroll.status === "PAID"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {payroll.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/payroll/${payroll.id}`}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition"
                      >
                        <Eye size={16} />
                      </Link>
                      {payroll.status === "PENDING" ? (
                        <button
                          onClick={() => handleMarkAsPaid(payroll.id)}
                          disabled={loadingId === payroll.id}
                          className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition"
                          title="Mark as Paid"
                        >
                          <CheckCircle size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsPending(payroll.id)}
                          disabled={loadingId === payroll.id}
                          className="p-2 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition"
                          title="Mark as Pending"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                router.push(buildHref({ page: pagination.page - 1 }))
              }
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => router.push(buildHref({ page }))}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    page === pagination.page
                      ? "bg-white text-black"
                      : "border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              onClick={() =>
                router.push(buildHref({ page: pagination.page + 1 }))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
