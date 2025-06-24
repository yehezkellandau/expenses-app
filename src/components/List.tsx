import { useEffect, useState } from 'react';
import { getExpenses } from '../api/expenses';
import { type Expense } from '../types/Expense';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {expenses.map((exp) => (
                    <TableRow key={exp.id}>
                        <TableCell>{exp.category}</TableCell>
                        <TableCell>${exp.amount}</TableCell>
                        <TableCell>{exp.type === "credit_card" ? "Credit Card" : "Cash"}</TableCell>
                        <TableCell className="text-right">{exp.date}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>

    );
};
export default List;