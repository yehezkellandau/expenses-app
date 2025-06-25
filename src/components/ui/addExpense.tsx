import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/datePicker"
import { useState } from "react"
import api from "@/api/axios"

type AddExpenseProps = {
    onAdded: () => void
}

export function AddExpense({ onAdded }: AddExpenseProps) {
    const [open, setOpen] = useState(false)

    const [form, setForm] = useState({
        category: "",
        amount: "",
        type: "cash",
        date: new Date(),
        household_id: 1
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (date: Date | undefined) => {
        setForm((prev) => ({ ...prev, date: date ?? new Date() }))
    }

    const resetForm = () => {
        setForm({
            category: "",
            amount: "",
            type: "cash",
            date: new Date(),
            household_id: 1
        })
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) resetForm()
        setOpen(isOpen)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload = {
            category: form.category,
            amount: parseFloat(form.amount),
            type: form.type,
            date: form.date.toISOString().split("T")[0],
            household_id: 1
        }

        try {
            await api.post("/expenses", payload)
            onAdded()
            resetForm()     // ✅ Reset form manually after success
            setOpen(false)  // ✅ Close dialog
        } catch (error) {
            console.error("Failed to add expense:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-[130px] mb-5 mt-5 mr-3 ml-3">
                    <Plus strokeWidth={1.75} />
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="e.g. Groceries"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                placeholder="e.g. 25.50"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Payment Method</Label>
                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="credit_card">Credit Card</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <DatePicker date={form.date} onChange={handleDateChange} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="m-1" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button className="m-1" type="submit">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
