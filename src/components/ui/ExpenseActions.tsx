import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/components/ui/button"
  import { MoreHorizontal } from "lucide-react"
  import { type Expense } from "@/types/Expense"
  
  interface Props {
    expense: Expense
    onEdit: (expense: Expense) => void
    onDelete: (id: number) => void
  }
  
  export function ExpenseActions({ expense, onEdit, onDelete }: Props) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(expense)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(expense.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  