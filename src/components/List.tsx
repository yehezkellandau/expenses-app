import { useEffect, useState } from 'react';
import { getExpenses } from '../api/expenses';
import { type Expense } from '../types/Expense';

const List = () => {
    const today = new Date();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [year, setYear] = useState<number>(today.getFullYear());

  useEffect(() => {
    getExpenses(month, year).then(setExpenses);
  }, [month, year]);
    return (
        <div>
      <h2>
        All Expenses for the month of{' '}
        {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
      </h2>

      <div style={{ margin: '1rem 0' }}>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>

        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        {expenses.map((exp) => (
          <p key={exp.id}>
            {exp.date} - {exp.category} - ${exp.amount} ({exp.type})
          </p>
        ))}
      </div>
    </div>
        
    );
};
export default List;