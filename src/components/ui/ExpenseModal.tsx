// src/components/ui/ExpenseModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Expense } from "@/types/Expense";
import { useEffect, useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import type { ExpensePayload } from "@/api/expenses";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Expense | null;
  /**
   * onSaved: parent should perform API (create/update) and refresh data.
   * - payload: the ExpensePayload object
   * - id?: when editing, the id of the expense to update
   * Should throw on failure (so modal can display errors).
   */
  onSaved: (payload: ExpensePayload, id?: number) => Promise<void>;
}

export function ExpenseModal({ open, onOpenChange, initialData, onSaved }: Props) {
  const isEditing = !!initialData;
  const [apiErrors, setApiErrors] = useState<Record<string, string[]> | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Intercept Dialog open-change so we can prevent closing while saving
  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSaving) {
      // prevent close while saving
      return;
    }
    if (!nextOpen) {
      setApiErrors(undefined);
    }
    onOpenChange(nextOpen);
  };

  const handleSave = async (payload: ExpensePayload) => {
    setApiErrors(undefined);
    setIsSaving(true);

    try {
      // let parent do create/update and refresh
      await onSaved(payload, initialData ? initialData.id : undefined);
      // close only after parent succeeded
      onOpenChange(false);
    } catch (err: any) {
      // axios-style validation errors: err.response.data.errors
      if (err?.response?.data?.errors) {
        setApiErrors(err.response.data.errors);
      } else if (err?.message) {
        setApiErrors({ general: [err.message] });
      } else {
        setApiErrors({ general: ["Unknown error"] });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      setApiErrors(undefined);
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (!open) {
      // clear state when modal closes
      setApiErrors(undefined);
      setIsSaving(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[90%] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <ExpenseForm
          initialData={initialData}
          onSubmit={handleSave}
          onCancel={handleCancel}
          errors={apiErrors}
          loading={isSaving}
        />
      </DialogContent>
    </Dialog>
  );
}
