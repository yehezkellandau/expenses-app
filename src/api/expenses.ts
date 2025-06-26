import api from './axios';
import { type Expense } from '@/types/Expense';

export const getExpenses = async (month: number, year: number): Promise<Expense[]> => {
  const response = await api.get(`expenses?household_id=1&month=${month}&year=${year}`);
  return response.data.data;
};

export const deleteExpense = async (id: number) => {
  await api.delete(`/expenses/${id}`);
};

export const updateExpense = async (id: number, data: Partial<Expense>) => {
  await api.put(`/expenses/${id}`, data);
};