import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { type Expense } from "@/types/Expense";
  import { ExpenseForm } from "./ExpenseForm";
  import api from "@/api/axios";
  
  type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Expense | null;
    onSaved: () => void;
  };
  
  export function ExpenseModal({
    open,
    onOpenChange,
    initialData,
    onSaved,
  }: Props) {
    const isEditing = !!initialData;
  
    const handleSave = async (payload: {
      category: string;
      amount: number;
      type: "cash" | "credit_card";
      date: string;
    }) => {
      try {
        if (isEditing && initialData) {
          await api.put(`/expenses/${initialData.id}`, {
            ...payload,
            household_id: initialData.household_id,
          });
        } else {
          await api.post("/expenses", {
            ...payload,
            household_id: 1,
          });
        }
  
        onSaved();
        onOpenChange(false);
      } catch (err) {
        console.error("Error saving expense", err);
      }
    };
  
    const handleCancel = () => {
      onOpenChange(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90%] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
          </DialogHeader>
  
          <ExpenseForm
            initialData={initialData}
            onSaved={handleSave}
            onCancel={handleCancel}
          />
          <DialogFooter />
        </DialogContent>
      </Dialog>
    );
  }
  