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
};

export function ExpenseForm({ initialData, onSaved, onCancel }: Props) {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    type: "cash",
    date: new Date(),
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category,
        amount: initialData.amount.toString(),
        type: initialData.type,
        date: new Date(initialData.date + "T12:00:00"),
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
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
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
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <DatePicker
          date={form.date}
          onChange={(date) =>
            setForm((prev) => ({ ...prev, date: date ?? new Date() }))
          }
        />
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
