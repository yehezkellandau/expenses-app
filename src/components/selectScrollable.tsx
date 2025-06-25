import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Option {
  label: string | number
  value: string | number
}

interface SelectScrollableProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
}

export function SelectScrollable({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: SelectScrollableProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[150px] mb-5 mt-5 mr-3 ml-3">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
