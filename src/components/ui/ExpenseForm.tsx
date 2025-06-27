import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./datePicker";
import { type Expense } from "@/types/Expense";


type Props = {
    initialData?: Expense | null;
    onSaved: (payload: {
        category: string;
        amount: number;
        type: "cash" | "credit_card";
        date: string;
    }) => void;
    onCancel: () => void;
    errors?: Record<string, string[]>;
};

export function ExpenseForm({ initialData, onSaved, onCancel, errors }: Props) {
    const [form, setForm] = useState({
        category: "",
        amount: "",
        type: "cash",
        date: new Date(),
        household_id: 1
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                category: initialData.category,
                amount: initialData.amount.toString(),
                type: initialData.type,
                date: new Date(initialData.date + "T12:00:00"),
                household_id: 1
            });
        } else {
            resetForm();
        }
    }, [initialData]);

    const resetForm = () => {
        setForm({
            category: "",
            amount: "",
            type: "cash",
            date: new Date(),
            household_id: 1
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            category: form.category,
            amount: parseFloat(form.amount),
            type: form.type as "cash" | "credit_card",
            date: form.date.toISOString().split("T")[0],
            household_id: 1
        };

        try {
            await onSaved(payload);
            resetForm();
        } catch (err) {
            console.error("Failed to save expense", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded space-y-1">
                    {/* Show general errors */}
                    {errors.general?.map((msg, idx) => (
                        <div key={`general-${idx}`}>{msg}</div>
                    ))}

                    {/* Show only unknown field errors, exclude category, amount, type, date */}
                    {Object.entries(errors)
                        .filter(([key]) => !["general", "category", "amount", "type", "date"].includes(key))
                        .map(([key, messages]) =>
                            messages.map((msg, idx) => (
                                <div key={`${key}-${idx}`}>
                                    <strong>{key}:</strong> {msg}
                                </div>
                            ))
                        )}
                </div>
            )}


            <div>
                <Label htmlFor="category">Category</Label>
                <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                />
                {errors?.category && (
                    <p className="text-sm text-red-600">{errors.category.join(", ")}</p>
                )}
            </div>

            <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />
                {errors?.amount && (
                    <p className="text-sm text-red-600">{errors.amount.join(", ")}</p>
                )}
            </div>

            <div>
                <Label htmlFor="type">Payment Method</Label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                </select>
                {errors?.type && (
                    <p className="text-sm text-red-600">{errors.type.join(", ")}</p>
                )}
            </div>

            <div>
                <Label htmlFor="date">Date</Label>
                <DatePicker
                    date={form.date}
                    onChange={(date) =>
                        setForm((prev) => ({ ...prev, date: date ?? new Date() }))
                    }
                />
                {errors?.date && (
                    <p className="text-sm text-red-600">{errors.date.join(", ")}</p>
                )}
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" className="flex-grow">
                    {initialData ? "Update Expense" : "Add Expense"}
                </Button>
            </div>
        </form>
    );
}
