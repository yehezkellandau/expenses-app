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
import { Plus } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/datePicker" // or correct path
import { useState } from "react"

export function AddExpense() {  
    // Form state
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("")
    const [date, setDate] = useState<Date | undefined>(new Date())

    // Dialog open state
    const [open, setOpen] = useState(false)

    // Reset form fields
    const resetForm = () => {
        setName("")
        setAmount("")
        setType("")
        setDate(new Date())
    }

    // When dialog closes (open === false), reset form
    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) resetForm()
        setOpen(isOpen)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Close dialog after submit
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="w-[130px] mb-5 mt-5 mr-3 ml-3">
                    <Plus strokeWidth={1.75} />
                    Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Groceries"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                placeholder="e.g. 25.50"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                name="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                required
                            >
                                <option value="">Select payment method</option>
                                <option value="cash">Cash</option>
                                <option value="credit_card">Credit Card</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <DatePicker date={date} onChange={setDate} />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="m-1" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button className="m-1" type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
