import { useEffect, useState } from 'react';
import { getExpenses } from '../api/expenses';
import { type Expense } from '../types/Expense';

const List = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
      getExpenses().then(setExpenses);
    }, []);
    return (
        <div>
      <h2>All Expenses</h2>
      <div>
        {expenses.map(exp => (
          <p key={exp.id}>
            {exp.date} - {exp.category} - ${exp.amount} ({exp.type})
          </p>
        ))}
      </div>
    </div>
    );
};
export default List;