import { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "../api/expenses";
import { type Expense } from "../types/Expense";
import {
  Table, TableHead, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import { SelectScrollable } from "./ui/selectScrollable";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ExpenseActions } from "./ui/ExpenseActions";
import { ExpenseModal } from "./ui/ExpenseModal";

const List = () => {
  const today = new Date();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [modalOpen, setModalOpen] = useState(false);  // single modal open state
  const [isAdding, setIsAdding] = useState(false);    // track add vs edit mode

  const fetchExpenses = () => {
    setLoading(true);
    getExpenses(month, year)
      .then(setExpenses)
      .finally(() => setLoading(false));
  };

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
    setIsAdding(true);
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditing(expense);
    setIsAdding(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setIsAdding(false);
  };

  return (
    <div>
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
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
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
                  <TableCell className="text-right">
                    <ExpenseActions
                      expense={exp}
                      onEdit={() => openEditModal(exp)}
                      onDelete={async (id) => {
                        if (confirm("Are you sure you want to delete this expense?")) {
                          await deleteExpense(id);
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

      {/* Controlled single modal for both add & edit */}
      <ExpenseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialData={editing}
        onSaved={() => {
          fetchExpenses();
          closeModal();
        }}
      />
    </div>
  );
};

export default List;
