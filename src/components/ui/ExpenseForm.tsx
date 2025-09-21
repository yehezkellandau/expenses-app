import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./datePicker";
import { type Expense } from "@/types/Expense";
import api from "@/api/axios"; // your axios instance
import type { ExpensePayload } from "@/api/expenses";

type Category = {
  id: number;
  name: string;
};

type Props = {
  initialData?: Expense | null;
  onSubmit: (payload: ExpensePayload) => Promise<void>; // async
  onCancel: () => void;
  errors?: Record<string, string[]>;
  loading?: boolean;
};

export function ExpenseForm({ initialData, onSubmit, onCancel, errors, loading }: Props) {
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    amount: "",
    method: "cash",
    date: new Date(),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        category_id: String(initialData.category_id),
        name: initialData.name,
        amount: initialData.amount.toString(),
        method: initialData.method,
        date: new Date(initialData.date + "T12:00:00"),
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      category_id: "",
      name: "",
      amount: "",
      method: "cash",
      date: new Date(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      category_id: parseInt(form.category_id, 10),
      name: form.name,
      amount: parseFloat(form.amount),
      method: form.method as "cash" | "credit_card",
      date: form.date.toISOString().split("T")[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded space-y-1">
          {errors.general?.map((msg, idx) => (
            <div key={`general-${idx}`}>{msg}</div>
          ))}
          {Object.entries(errors)
            .filter(([key]) => key !== "general")
            .map(([key, messages]) =>
              messages.map((msg, idx) => (
                <div key={`${key}-${idx}`}>{msg}</div>
              ))
            )}
        </div>
      )}

      <div>
        <Label htmlFor="category_id">Category</Label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
          disabled={loadingCategories}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors?.category_id && (
          <p className="text-sm text-red-600">{errors.category_id.join(", ")}</p>
        )}
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors?.name && (
          <p className="text-sm text-red-600">{errors.name.join(", ")}</p>
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
        <Label htmlFor="method">Payment Method</Label>
        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="cash">Cash</option>
          <option value="credit_card">Credit Card</option>
        </select>
        {errors?.method && (
          <p className="text-sm text-red-600">{errors.method.join(", ")}</p>
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
        <Button type="submit" className="flex-grow" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
