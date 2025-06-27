import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { type Expense } from "@/types/Expense";
import api from "@/api/axios";
import { useState } from "react";
import { ExpenseForm } from "./ExpenseForm";


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Expense | null;
    onSaved: () => void;
}

export function ExpenseModal({
    open,
    onOpenChange,
    initialData,
    onSaved,
}: Props) {
    const isEditing = !!initialData;

    const [apiErrors, setApiErrors] = useState<Record<string, string[]> | undefined>(undefined);

    const handleSave = async (payload: {
        category: string;
        amount: number;
        type: "cash" | "credit_card";
        date: string;
    }) => {
        setApiErrors(undefined); // reset errors before submit
        onOpenChange(false);  // optimistically close modal (optional)

        try {
            if (isEditing && initialData) {
                await api.put(`/expenses/${initialData.id}`, payload);
            } else {
                await api.post("/expenses", payload);
            }
            onSaved(); // refresh parent data
        } catch (err: any) {
            onOpenChange(true); // reopen modal
            if (err.response?.data?.errors) {
                setApiErrors(err.response.data.errors);
            } else {
                setApiErrors({ general: [err.message || "Unknown error"] });
            }
        }
    };

    // Handler when user cancels
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
                    errors={apiErrors}
                />
            </DialogContent>
        </Dialog>
    );
}
