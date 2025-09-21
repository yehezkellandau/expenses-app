import api from "./axios";
import { type Expense } from "@/types/Expense";

// 🔹 Shape of data you send when creating/updating
export type ExpensePayload = {
  id?: number; // only for update
  household_id?: number; // optional on create
  user_id?: number;      // optional on create
  category_id: number;
  name: string;
  amount: number;
  method: "cash" | "credit_card";
  date: string; // ISO date
};



// 🔹 Create a new expense
export const createExpense = async (
  data: ExpensePayload,
  token: string
): Promise<Expense> => {
  const response = await api.post("/expenses", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // ✅ assuming API returns { data: { ...expense } }
};

// 🔹 Fetch all expenses for given month/year
export const getExpenses = async (
  month: number,
  year: number,
  token: string
): Promise<Expense[]> => {
  const response = await api.get(`/expenses?month=${month}&year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // ✅ returns array
};

// 🔹 Delete an expense by ID
export const deleteExpense = async (id: number, token: string): Promise<void> => {
  await api.delete(`/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 🔹 Update an existing expense
export const updateExpense = async (
  id: number,
  data: Partial<ExpensePayload>,
  token: string
): Promise<Expense> => {
  const response = await api.put(`/expenses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // ✅ updated expense object
};
