export type Expense = {
  id: number;
  category: string;
  amount: number; // we cast it to number
  type: 'cash' | 'credit_card'; // feel free to add more types if needed
  date: string; // ISO format: 'YYYY-MM-DD'
  created_at: string;
  updated_at: string;
  household_id: number;
  month:number;
  year: number;
};