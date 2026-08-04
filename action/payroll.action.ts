"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "../lib/auth";
import {
  createPayrollEntry,
  updatePayrollEntry,
  deletePayrollEntry,
  markPayrollAsPaid,
  markPayrollAsPending,
} from "../service/payroll.service";
import type { PayrollFormData, PayrollUpdateData } from "../app/types/type.payroll";

// Semua action payroll hanya boleh dijalankan oleh ADMIN.
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.id && session.user.role === "ADMIN";
}

function denied() {
  return { success: false, error: "Unauthorized" };
}

export async function createPayrollAction(formData: PayrollFormData) {
  if (!(await requireAdmin())) return denied();

  try {
    const payroll = await createPayrollEntry(formData);
    revalidatePath("/dashboard/admin/payroll");
    return { success: true, data: payroll };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create payroll",
    };
  }
}

export async function updatePayrollAction(
  id: string,
  updateData: PayrollUpdateData,
) {
  if (!(await requireAdmin())) return denied();

  try {
    const payroll = await updatePayrollEntry(id, updateData);
    revalidatePath("/dashboard/admin/payroll");
    return { success: true, data: payroll };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update payroll",
    };
  }
}

export async function deletePayrollAction(id: string) {
  if (!(await requireAdmin())) return denied();

  try {
    await deletePayrollEntry(id);
    revalidatePath("/dashboard/admin/payroll");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete payroll",
    };
  }
}

export async function markAsPaidAction(id: string) {
  if (!(await requireAdmin())) return denied();

  try {
    const payroll = await markPayrollAsPaid(id);
    revalidatePath("/dashboard/admin/payroll");
    revalidatePath(`/dashboard/payroll/${id}`);
    return { success: true, data: payroll };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark as paid",
    };
  }
}

export async function markAsPendingAction(id: string) {
  if (!(await requireAdmin())) return denied();

  try {
    const payroll = await markPayrollAsPending(id);
    revalidatePath("/dashboard/admin/payroll");
    revalidatePath(`/dashboard/payroll/${id}`);
    return { success: true, data: payroll };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to mark as pending",
    };
  }
}
