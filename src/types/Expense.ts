export type Expense = {
  id: number;
  household_id: number;
  user_id: number;
  category_id: number;
  name: string;
  amount: number;
  method: "cash" | "credit_card";
  date: string; // ISO date (YYYY-MM-DD)
  created_at: string;
  updated_at: string;
  month:number;
  year: number;
};