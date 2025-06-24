import api from './axios';
import { type Expense } from '@/types/Expense';

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get('expenses?household_id=1&month=6&year=2025');
  return response.data.data;
};
