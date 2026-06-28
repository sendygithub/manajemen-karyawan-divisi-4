"use server";

import { revalidatePath } from "next/cache";
import {
  createPayrollEntry,
  updatePayrollEntry,
  deletePayrollEntry,
  markPayrollAsPaid,
  markPayrollAsPending,
} from "service/payroll.service";
import type { PayrollFormData, PayrollUpdateData } from "@/types/type.payroll";

export async function createPayrollAction(formData: PayrollFormData) {
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
