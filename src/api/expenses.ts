import api from './axios';
import { type Expense } from '@/types/Expense';

// Fetch all expenses
export const getExpenses = async (month: number, year: number, token: string): Promise<Expense[]> => {
  const response = await api.get(`expenses?month=${month}&year=${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

// Delete an expense
export const deleteExpense = async (id: number, token: string) => {
  await api.delete(`/expenses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update an expense
export const updateExpense = async (id: number, data: Partial<Expense>, token: string) => {
  await api.put(`/expenses/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
