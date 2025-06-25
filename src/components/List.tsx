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
} from "@/components/ui/table";
import { SelectScrollable } from './selectScrollable';
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';

const List = () => {
    const today = new Date();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [month, setMonth] = useState<number>(today.getMonth() + 1); // 1-12
    const [year, setYear] = useState<number>(today.getFullYear());
    const [loading, setLoading] = useState(false)

    const monthOptions = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ]
    const yearsOptions = Array.from({ length: 101 }, (_, i) => {
        const year = 2000 + i;
        return { label: year, value: year };
    });
    const resetToToday = () => {
        const today = new Date();
        setMonth(today.getMonth() + 1);
        setYear(today.getFullYear());
    };
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const filtersChanged = month !== currentMonth || year !== currentYear;

    useEffect(() => {
        setLoading(true)
        getExpenses(month, year)
            .then(setExpenses)
            .finally(() => setLoading(false))
    }, [month, year])
    return (
        <div>
            <div className="flex">
                <SelectScrollable
                    value={String(month)}
                    onChange={(val) => setMonth(Number(val))}
                    options={monthOptions}
                />
                <SelectScrollable
                    value={String(year)}
                    onChange={(val) => setYear(Number(val))}
                    options={yearsOptions}
                />
                <Button
                    className="w-[100px] mb-5 mt-5 mr-3 ml-3"
                    variant={filtersChanged ? "destructive" : "outline"}
                    onClick={resetToToday}
                >
                    Today
                </Button>
                <Button
                    className="w-[130px] mb-5 mt-5 mr-3 ml-3"
                    onClick={resetToToday}
                >
                    <Plus strokeWidth={1.75} />
                    Add Expense
                </Button>
            </div>
            <div className="overflow-x-auto px-4">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    No data available for this month.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((exp) => (
                                <TableRow key={exp.id}>
                                    <TableCell>{exp.category}</TableCell>
                                    <TableCell>${exp.amount}</TableCell>
                                    <TableCell>{exp.type === "credit_card" ? "Credit Card" : "Cash"}</TableCell>
                                    <TableCell className="text-right">{exp.date}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>

    );
};
export default List;