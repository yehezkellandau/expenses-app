import { useState, useEffect } from "react";
import { getExpenses, deleteExpense, createExpense, updateExpense } from "../api/expenses";
import { type Expense } from "../types/Expense";
import type { ExpensePayload } from "@/api/expenses";
import {
    Table, TableHead, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import { SelectScrollable } from "./ui/selectScrollable";
import { Button } from "@/components/ui/button";
import { X, DollarSign, CreditCard } from "lucide-react";
import { ExpenseActions } from "./ui/ExpenseActions";
import { ExpenseModal } from "./ui/ExpenseModal";
import ExpenseSummary from "./ui/ExpenseSummary";
import api from "@/api/axios";

type Category = {
    id: number;
    name: string;
};

const List = () => {
    const today = new Date();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [month, setMonth] = useState<number>(today.getMonth() + 1);
    const [year, setYear] = useState<number>(today.getFullYear());
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) return;
            const res = await api.get("/categories", { headers: { Authorization: `Bearer ${token}` } });
            setCategories(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    const fetchExpenses = () => {
        setLoading(true);
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            setExpenses([]);
            setLoading(false);
            return;
        }

        getExpenses(month, year, token)
            .then(data => setExpenses(Array.isArray(data) ? data : []))
            .catch(error => {
                console.error("Failed to fetch expenses:", error);
                setExpenses([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchExpenses();
    }, [month, year]);

    const resetToToday = () => {
        setMonth(today.getMonth() + 1);
        setYear(today.getFullYear());
    };

    const monthOptions = [...Array(12)].map((_, i) => ({
        label: new Date(0, i).toLocaleString("default", { month: "long" }),
        value: String(i + 1),
    }));

    const yearsOptions = Array.from({ length: 101 }, (_, i) => {
        const year = 2000 + i;
        return { label: String(year), value: year };
    });

    const openAddModal = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEditModal = (expense: Expense) => {
        setEditing(expense);
        setModalOpen(true);
    };

    const handleSave = async (payload: ExpensePayload, id?: number) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        if (typeof id === "number") await updateExpense(id, payload, token);
        else await createExpense(payload, token);

        await fetchExpenses();
    };

    // Create a mapping from category_id to category name
    const categoryMap = categories.reduce<Record<number, string>>((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {});

    // Totals
    const totals = expenses.reduce(
        (acc, exp) => {
            const amount = Number(exp.amount);
            acc.total += amount;
            if (exp.method === "cash") acc.cash += amount;
            else if (exp.method === "credit_card") acc.credit += amount;
            return acc;
        },
        { total: 0, cash: 0, credit: 0 }
    );

    return (
        <div>
            <ExpenseSummary total={totals.total} cash={totals.cash} credit={totals.credit} />

            <div className="flex flex-wrap items-center">
                {(month !== today.getMonth() + 1 || year !== today.getFullYear()) && (
                    <Button variant="destructive" onClick={resetToToday} className="mb-5 mt-5 mr-3 ml-3">
                        <X strokeWidth={1.75} />
                    </Button>
                )}

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
                    className="w-[130px] mb-5 mt-5 mr-3 ml-3"
                    onClick={openAddModal}
                >
                    + Add Expense
                </Button>
            </div>

            <div className="overflow-x-auto px-4">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">Loading...</TableCell>
                            </TableRow>
                        ) : expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">No data available for this month.</TableCell>
                            </TableRow>
                        ) : (
                            expenses.map((exp) => (
                                <TableRow key={exp.id}>
                                    <TableCell>{categoryMap[exp.category_id] || exp.category_id}</TableCell>
                                    <TableCell>{exp.name}</TableCell>
                                    <TableCell>${exp.amount}</TableCell>
                                    <TableCell>
                                        {exp.method === "credit_card"
                                            ? <CreditCard className="w-5 h-5 text-red-500" />
                                            : <DollarSign className="w-5 h-5 text-green-500" />}
                                    </TableCell>
                                    <TableCell className="text-right">{exp.date}</TableCell>
                                    <TableCell className="text-right">
                                        <ExpenseActions
                                            expense={exp}
                                            onEdit={() => openEditModal(exp)}
                                            onDelete={async (id) => {
                                                if (confirm("Are you sure you want to delete this expense?")) {
                                                    const token = localStorage.getItem("token");
                                                    if (!token) return;
                                                    await deleteExpense(id, token);
                                                    fetchExpenses();
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ExpenseModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                initialData={editing}
                onSaved={handleSave}
            />
        </div>
    );
};

export default List;
